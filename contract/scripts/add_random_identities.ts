// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { ZKTokenProof__factory } from "../typechain";
import { Identity } from "@semaphore-protocol/identity";

const ZKTP_ADDRESS = "0x09635F643e140090A9A8Dcd712eD6285858ceBef";

async function main() {
  const [signer] = await ethers.getSigners();
  const contract = ZKTokenProof__factory.connect(ZKTP_ADDRESS, signer);

  const groupId =
    "11074470828234691953879838215937349281813412903507876925037650068034332627351";

  for (let i = 0; i < 10; i++) {
    const identityCommitment = new Identity();
    const tx = await contract.addMember(
      groupId,
      identityCommitment.generateCommitment()
    );
    console.log(tx.hash);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
