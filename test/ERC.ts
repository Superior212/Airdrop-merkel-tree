import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC20 Token", function () {
  let erc20Token: any;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners(); // Use ethers from Hardhat

    const ERC20Token = await ethers.getContractFactory("ERC");
    erc20Token = await ERC20Token.deploy(); // Deploy the contract
  });

  it("Should deploy and assign initial balance to the owner", async function () {
    const ownerBalance = await erc20Token.balanceOf(owner.address);
    expect(await erc20Token.totalSupply()).to.equal(ownerBalance);
  });

  it("Should allow the owner to mint new tokens", async function () {
    const initialOwnerBalance = await erc20Token.balanceOf(owner.address);
    console.log("Initial Owner Balance (before minting):", initialOwnerBalance.toString());

    const mintAmount = ethers.parseUnits("1000", 18); // Mint 1000 tokens in wei (18 decimals)
    await erc20Token.mint(mintAmount);

    const ownerBalanceAfterMint = await erc20Token.balanceOf(owner.address);
    console.log("Owner Balance (after minting):", ownerBalanceAfterMint.toString());

    const expectedBalance = ethers.parseUnits("101000", 18); // Expected balance after minting

    // Log for comparison
    console.log("Owner Balance (actual):", ownerBalanceAfterMint.toString());
    console.log("Expected Balance:", expectedBalance.toString());

    // Compare directly without BigNumber.from since we're already using BigInt in ethers v6
    expect(ownerBalanceAfterMint).to.equal(expectedBalance);
  });

  it("Should prevent non-owner from minting tokens", async function () {
    const mintAmount = ethers.parseUnits("1000", 18);
    await expect(erc20Token.connect(addr1).mint(mintAmount)).to.be.revertedWith(
      "you are not owner"
    );
  });
});
