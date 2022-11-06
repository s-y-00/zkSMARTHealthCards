//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@semaphore-protocol/contracts/base/SemaphoreCore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";
import "@semaphore-protocol/contracts/interfaces/IVerifier.sol";

import "./interfaces/IZKSmartHealthCards.sol";

error NotRelayer(address relayerAddress);
error InvalidTreeDepth(uint8 depth);
error ImmunizationNotFound(uint256 immunizationId);
error InvalidContractAddress(address contractAddress);
error AlreadyRelayer(address relayerAddress);

contract ZKSmartHealthCards is
    IZKSmartHealthCards,
    SemaphoreCore,
    SemaphoreGroups,
    Ownable
{
    /// @dev Gets a tree depth and returns its verifier address.
    mapping(uint8 => IVerifier) public verifiers;
    /// @dev Mapping of relayers.
    mapping(address => bool) public relayers;
    /// @dev Mappng of immunizations.
    mapping(uint256 => Immunization) public immunizations;

    /// @dev Checks if there is a verifier for the given tree depth.
    /// @param depth: Depth of the tree.
    modifier onlySupportedDepth(uint8 depth) {
        if (address(verifiers[depth]) == address(0)) {
            revert InvalidTreeDepth(depth);
        }
        _;
    }

    /// @dev Checks if the msg.sender is one of the relayers.
    modifier onlyRelayer() {
        if (!relayers[_msgSender()]) {
            revert NotRelayer(_msgSender());
        }
        _;
    }

    /// @dev Initializes the Semaphore verifiers, relayers used to verify the user's ZK proofs, to add members to group.
    /// @param _verifiers: List of Semaphore verifiers (address and related Merkle tree depth).
    /// @param _relayers: List of relayers' addresses.
    constructor(
        Verifier[] memory _verifiers,
        address[] memory _relayers
    ) {
        uint8 i = 0;
        for (; i < _verifiers.length; i++) {
            verifiers[_verifiers[i].merkleTreeDepth] = IVerifier(
                _verifiers[i].contractAddress
            );
        }
        for (i = 0; i < _relayers.length; i++) {
            relayers[_relayers[i]] = true;
        }
    }

    /**
     * Receive function
     */
    receive() external payable {}

    /**
     * Fallback function
     */
    fallback() external payable {}

    ///@dev see {IZKSmartHealthCards-isEligible}
    function isEligible(uint256 _immunizationId, string calldata _vaccineCodeSystem, string calldata _vaccineCodeCode)
        public
        view
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(immunizations[_immunizationId].vaccineCodeSystem)) == keccak256(abi.encodePacked(_vaccineCodeSystem)) &&
            keccak256(abi.encodePacked(immunizations[_immunizationId].vaccineCodeCode)) == keccak256(abi.encodePacked(_vaccineCodeCode));
    }

    ///@dev see {IZKSmartHealthCards-verifyMembership}
    function verifyMembership(
        uint256 _immunizationId,
        bytes32 _signal,
        uint256 _nullifierHash,
        uint256 _externalNullifier,
        uint256[8] calldata _proof
    ) public view returns (bool) {
        uint256 root = getRoot(_immunizationId);
        uint8 depth = getDepth(_immunizationId);

        if (depth == 0) {
            revert ImmunizationNotFound(_immunizationId);
        }

        // we do not need to save nullfierHash because
        // we only need to make sure the merkle tree inclusion proof.
        // _saveNullifierHash

        IVerifier verifier = verifiers[depth];

        _verifyProof(
            _signal,
            root,
            _nullifierHash,
            _externalNullifier,
            _proof,
            verifier
        );
        return true;
    }

    ///@dev see {IZKSmartHealthCards-createImmunization}.
    function createImmunization(
        uint256 _immunizationId,
        uint8 _depth,
        uint256 _zeroValue,
        string calldata _vaccineType,
        string calldata _vaccineCodeSystem,
        string calldata _vaccineCodeCode
    ) external payable onlySupportedDepth(_depth) {
        // create group
        _createGroup(_immunizationId, _depth, _zeroValue);

        // create eveimmunizations
        immunizations[_immunizationId] = Immunization({
            adminAddress: msg.sender,
            vaccineType: _vaccineType,
            vaccineCodeSystem: _vaccineCodeSystem,
            vaccineCodeCode: _vaccineCodeCode,
            createdAt: block.timestamp
        });
        // emit event
        emit ImmunizationCreated(
            _immunizationId,
            _depth,
            _zeroValue,
            msg.sender,
            _vaccineType,
            _vaccineCodeSystem,
            _vaccineCodeCode
        );
    }

    ///@dev see {IZKSmartHealthCards-addVerifier}
    function addVerifier(Verifier memory _verifier) public onlyOwner {
        verifiers[_verifier.merkleTreeDepth] = IVerifier(
            _verifier.contractAddress
        );
        emit VerifierAdded(_verifier);
    }

    ///@dev see {IZKSmartHealthCards-removeVerifier}
    function removeVerifier(Verifier memory _verifier) public onlyOwner {
        delete verifiers[_verifier.merkleTreeDepth];
        emit VerifierRemoved(_verifier);
    }

    ///@dev see {IZKSmartHealthCards-addRelayer}
    function addRelayer(address _relayer) public onlyOwner {
        if (relayers[_relayer]) {
            revert AlreadyRelayer(_relayer);
        }
        relayers[_relayer] = true;
        emit RelayerAdded(_relayer);
    }

    ///@dev see {IZKSmartHealthCards-removeRelayer}
    function removeRelayer(address _relayer) public onlyOwner {
        if (!relayers[_relayer]) {
            revert NotRelayer(_relayer);
        }
        relayers[_relayer] = false;
        emit RelayerRemoved(_relayer);
    }

    ///@dev see {IZKSmartHealthCards-addMember}
    function addMember(uint256 _immunizationId, uint256 _identityCommitment)
        public
        onlyRelayer
    {
        _addMember(_immunizationId, _identityCommitment);
    }

    ///@dev see {IZKSmartHealthCards-removeMember}
    function removeMember(
        uint256 _immunizationId,
        uint256 _identityCommitment,
        uint256[] calldata _proofSiblings,
        uint8[] calldata _proofPathIndices
    ) public onlyRelayer {
        _removeMember(
            _immunizationId,
            _identityCommitment,
            _proofSiblings,
            _proofPathIndices
        );
    }

    ///@dev see {IZKSmartHealthCards-withdraw}
    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "Not Enough Balance Of Contract");
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Transfer Failed");
        emit Withdraw(msg.sender);
    }
}
