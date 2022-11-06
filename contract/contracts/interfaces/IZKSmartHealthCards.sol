//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/// @title ZKSmartHealthCards interface.
/// @dev Interface of a ZKSmartHealthCards contract.
interface IZKSmartHealthCards {
    struct Verifier {
        address contractAddress;
        uint8 merkleTreeDepth;
    }

    struct Immunization {
        address adminAddress;
        string vaccineType;
        string vaccineCodeSystem;
        string vaccineCodeCode;
        uint256 createdAt;
    }

    /// @dev Emitted when a new immunization is created.
    /// @param immunizationId: Id of the group.
    /// @param depth: Depth of the tree.
    /// @param zeroValue: Zero value of the tree.
    /// @param adminAddress: Admin of the group.
    /// @param vaccineType: Immunization vaccineType for the immunization.
    /// @param vaccineCodeSystem: Immunization vaccineType for the immunization.
    /// @param vaccineCodeCode: Immunization vaccineType for the immunization.
    event ImmunizationCreated(
        uint256 indexed immunizationId,
        uint8 depth,
        uint256 zeroValue,
        address indexed adminAddress,
        string vaccineType,
        string vaccineCodeSystem,
        string vaccineCodeCode
    );

    /// @dev Emmited when verifier added
    /// @param verifier: Added verifier.
    event VerifierAdded(Verifier verifier);

    /// @dev Emmited when verifier removed
    /// @param verifier: Removed verifier.
    event VerifierRemoved(Verifier verifier);

    /// @dev Emmited when relayer added
    /// @param relayerAddress: Added relayer address.
    event RelayerAdded(address indexed relayerAddress);

    /// @dev Emmited when relayer removed
    /// @param relayerAddress: Removed relayer address.
    event RelayerRemoved(address indexed relayerAddress);

    /// @dev Emitted when withdrawn
    event Withdraw(address indexed operator);

    /// @dev Check if the target address is eligible to join the immunization
    /// @param _immunizationId: Id of the immunization.
    /// @param _vaccineCodeSystem: System name of Vaccine Code to check the eligibility.
    /// @param _vaccineCodeCode: Code of Vaccine Code to check the eligibility.
    /// @return bool
    function isEligible(uint256 _immunizationId, string calldata _vaccineCodeSystem, string calldata _vaccineCodeCode)
        external
        view
        returns (bool);

    /// @dev Prove membership
    /// @param _immunizationId: Id of the immunization.
    /// @param _signal: Signal.
    /// @param _nullifierHash: NullifierHash.
    /// @param _externalNullifier: ExternalNullifier.
    /// @param _proof: Proof.
    /// @return bool
    function verifyMembership(
        uint256 _immunizationId,
        bytes32 _signal,
        uint256 _nullifierHash,
        uint256 _externalNullifier,
        uint256[8] calldata _proof
    ) external view returns (bool);

    /// @dev Create an immunization.
    /// @param _immunizationId: Id of the group.
    /// @param _depth: Depth of the tree.
    /// @param _zeroValue: Zero value of the tree.
    /// @param _vaccineType: Immunization vaccineType.
    /// @param _vaccineCodeSystem: Immunization vaccineType.
    /// @param _vaccineCodeCode: Immunization immunization.
    function createImmunization(
        uint256 _immunizationId,
        uint8 _depth,
        uint256 _zeroValue,
        string calldata _vaccineType,
        string calldata _vaccineCodeSystem,
        string calldata _vaccineCodeCode
    ) external payable;

    /// @dev Add member to the immunization by relayers.
    /// @param _immunizationId: Id of the immunization.
    /// @param _identityCommitment: Identity Commitment of participant.
    function addMember(uint256 _immunizationId, uint256 _identityCommitment) external;

    /// @dev Remove member to the immunization by relayers.
    /// @param _immunizationId: Id of the immunization.
    /// @param _identityCommitment: Identity Commitment of participant.
    /// @param _proofSiblings: Array of the sibling nodes of the proof of membership.
    /// @param _proofPathIndices: Path of the proof of membership.
    function removeMember(
        uint256 _immunizationId,
        uint256 _identityCommitment,
        uint256[] calldata _proofSiblings,
        uint8[] calldata _proofPathIndices
    ) external;

    /// @dev Add a relayer
    /// @param _relayer: Relayer address to be added.
    function addRelayer(address _relayer) external;

    /// @dev Remove a relayer
    /// @param _relayer: Relayer address to be removed.
    function removeRelayer(address _relayer) external;

    /// @dev Withdraw values in this contract.
    function withdraw() external;
}
