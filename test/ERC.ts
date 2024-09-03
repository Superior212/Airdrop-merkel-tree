import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC } from "../typechain-types";

describe("ERC Token Contract", function () {
  let ercToken: ERC;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    const ERC = await ethers.getContractFactory("ERC");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    ercToken = (await ERC.deploy()) as ERC;

    // No need to call `await ercToken.deployed();`
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await ercToken.owner()).to.equal(owner.address);
    });

    it("Should assign the initial total supply to the owner", async function () {
      const ownerBalance = await ercToken.balanceOf(owner.address);
      expect(await ercToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Minting", function () {
    it("Should mint tokens only by the owner", async function () {
      const initialSupply = BigInt(100000) * BigInt(10 ** 18); // 100,000 tokens
      const mintAmount = BigInt(1000) * BigInt(10 ** 18); // 1,000 tokens
      const expectedBalance = initialSupply + mintAmount;

      // Ensure initial balance is correct
      const initialOwnerBalance = await ercToken.balanceOf(owner.address);
      console.log("Initial Owner Balance:", initialOwnerBalance.toString());
      expect(initialOwnerBalance.toString()).to.equal(initialSupply.toString());

      // Mint new tokens
      await ercToken.mint(mintAmount);

      // Check new balance
      const newOwnerBalance = await ercToken.balanceOf(owner.address);
      console.log("New Owner Balance:", newOwnerBalance.toString());
      console.log("Expected Balance:", expectedBalance.toString());
      expect(newOwnerBalance.toString()).to.equal(expectedBalance.toString());
    });

    it("Should revert if a non-owner tries to mint tokens", async function () {
      const mintAmount = BigInt(1000) * BigInt(10 ** 18); // 1,000 tokens
      await expect(ercToken.connect(addr1).mint(mintAmount)).to.be.revertedWith(
        "you are not owner"
      );
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = BigInt(50 * 10 ** 18); // 50 tokens with 18 decimals

      // Transfer 50 tokens from owner to addr1
      await ercToken.transfer(addr1.address, transferAmount);
      const addr1Balance = await ercToken.balanceOf(addr1.address);
      expect(addr1Balance.toString()).to.equal(transferAmount.toString());

      // Transfer 50 tokens from addr1 to addr2
      await ercToken.connect(addr1).transfer(addr2.address, transferAmount);
      const addr2Balance = await ercToken.balanceOf(addr2.address);
      expect(addr2Balance.toString()).to.equal(transferAmount.toString());
    });
  });
});
