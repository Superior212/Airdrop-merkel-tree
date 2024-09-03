import { expect } from "chai";
import { ethers } from "hardhat";
import { Airdrop, ERC } from "../typechain-types";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

describe("Airdrop Contract", function () {
  let airdrop: Airdrop;
  let token: ERC;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addr3: any;
  let merkleTree: StandardMerkleTree<string[]>;
  let rootHash: string;

  const airdropAmount = ethers.parseUnits("100", 18);

  before(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy the ERC token contract
    const ERC = await ethers.getContractFactory("ERC");
    token = (await ERC.deploy()) as ERC;

    // Ensure the token is deployed correctly
    if (!token.address) {
      throw new Error("Token contract failed to deploy or address is null");
    }
    console.log("ERC Token Address:", token.address);

    // Create Merkle Tree for the airdrop using StandardMerkleTree
    const elements = [
      [addr1.address, airdropAmount.toString()],
      [addr2.address, airdropAmount.toString()],
    ];
    merkleTree = StandardMerkleTree.of(elements, ["address", "uint256"]);
    rootHash = merkleTree.root;

    // Ensure the Merkle root is valid
    if (!rootHash) {
      throw new Error("Failed to generate a valid Merkle root");
    }
    console.log("Merkle Root:", rootHash);

    // Deploy Airdrop contract using the token address
    const Airdrop = await ethers.getContractFactory("Airdrop");
    airdrop = (await Airdrop.deploy(token.address, rootHash)) as Airdrop;

    // Ensure the airdrop contract is deployed correctly
    if (!airdrop.address) {
      throw new Error("Airdrop contract failed to deploy or address is null");
    }
    console.log("Airdrop Contract Address:", airdrop.address);

    // Transfer tokens to the airdrop contract
    await token.transfer(airdrop.address, ethers.parseUnits("500", 18));
  });

  describe("Deployment", function () {
    it("Should set the right token and merkle root", async function () {
      expect(await airdrop.token()).to.equal(token.address);
      expect(await airdrop.merkleRoot()).to.equal(rootHash);
    });
  });

  // Additional test cases...
});
