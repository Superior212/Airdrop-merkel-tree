import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

const AirdropModule = buildModule("AirdropModule", (m) => {
  const MerkleRoot =
    "0x38ddee5d92725959fe7e9602a48860753d08190f068c7dcaf457126bcb6ba9e7";

  // Define the parameters for the contract deployment
  const tokenAddress = m.getParameter(
    "tokenAddress",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );
  const merkleRoot = m.getParameter("merkleRoot", MerkleRoot);

  // Deploy the Airdrop contract with the provided parameters
  const airdrop = m.contract("Airdrop", [tokenAddress, merkleRoot]);

  // Return the deployed contract instance
  return { airdrop };
});

export default AirdropModule;
