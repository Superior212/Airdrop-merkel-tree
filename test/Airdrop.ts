import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

describe("Airdrop Contract", function () {
  let airdrop: any;
  let token: any;
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addr3: any;

  let merkleTree: MerkleTree;
  let merkleRoot: string;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const airdropData = [
      { address: addr1.address, amount: 100 },
      { address: addr2.address, amount: 200 },
      { address: addr3.address, amount: 300 },
    ];

    const ERC = await ethers.getContractFactory("ERC");
    token = await ERC.deploy();

    const leafNodes = airdropData.map((item) =>
      keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address", "uint256"],
          [item.address, item.amount]
        )
      )
    );
    merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    merkleRoot = merkleTree.getHexRoot();

    const Airdrop = await ethers.getContractFactory("Airdrop");
    airdrop = await Airdrop.deploy(token, merkleRoot);
  });

  it("Should set the correct token address and Merkle root", async function () {
    expect(await airdrop.token()).to.equal(token);
    expect(await airdrop.merkleRoot()).to.equal(merkleRoot);
  });
});
