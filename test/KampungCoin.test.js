const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KampungCoin", function () {
  let kampungCoin;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  const INITIAL_SUPPLY = 10_000_000; // 10 million tokens
  const MAX_SUPPLY = ethers.parseEther("100000000"); // 100 million tokens

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
    const KampungCoin = await ethers.getContractFactory("KampungCoin");
    kampungCoin = await KampungCoin.deploy(INITIAL_SUPPLY);
    await kampungCoin.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right token name and symbol", async function () {
      expect(await kampungCoin.name()).to.equal("Kampung Coin");
      expect(await kampungCoin.symbol()).to.equal("KPNG");
    });

    it("Should assign the total supply to the owner", async function () {
      const ownerBalance = await kampungCoin.balanceOf(owner.address);
      expect(await kampungCoin.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the correct initial supply", async function () {
      const totalSupply = await kampungCoin.totalSupply();
      expect(totalSupply).to.equal(ethers.parseEther(INITIAL_SUPPLY.toString()));
    });

    it("Should set the correct owner", async function () {
      expect(await kampungCoin.owner()).to.equal(owner.address);
    });

    it("Should have the correct max supply", async function () {
      expect(await kampungCoin.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
    });

    it("Should fail if initial supply exceeds max supply", async function () {
      const KampungCoin = await ethers.getContractFactory("KampungCoin");
      await expect(
        KampungCoin.deploy(100_000_001) // 100 million + 1
      ).to.be.revertedWith("Initial supply exceeds maximum supply");
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseEther("50");
      
      await kampungCoin.transfer(addr1.address, transferAmount);
      const addr1Balance = await kampungCoin.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);

      await kampungCoin.connect(addr1).transfer(addr2.address, transferAmount);
      const addr2Balance = await kampungCoin.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await kampungCoin.balanceOf(owner.address);
      
      await expect(
        kampungCoin.connect(addr1).transfer(owner.address, ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(kampungCoin, "ERC20InsufficientBalance");

      expect(await kampungCoin.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await kampungCoin.balanceOf(owner.address);
      const transferAmount1 = ethers.parseEther("100");
      const transferAmount2 = ethers.parseEther("50");

      await kampungCoin.transfer(addr1.address, transferAmount1);
      await kampungCoin.transfer(addr2.address, transferAmount2);

      const finalOwnerBalance = await kampungCoin.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - transferAmount1 - transferAmount2);

      const addr1Balance = await kampungCoin.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount1);

      const addr2Balance = await kampungCoin.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount2);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = 1000;
      await kampungCoin.mint(addr1.address, mintAmount);
      
      const addr1Balance = await kampungCoin.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.parseEther(mintAmount.toString()));
    });

    it("Should prevent non-owner from minting tokens", async function () {
      await expect(
        kampungCoin.connect(addr1).mint(addr2.address, 100)
      ).to.be.revertedWithCustomError(kampungCoin, "OwnableUnauthorizedAccount");
    });

    it("Should not allow minting beyond max supply", async function () {
      const currentSupply = await kampungCoin.totalSupply();
      const maxSupply = await kampungCoin.MAX_SUPPLY();
      const remainingSupply = maxSupply - currentSupply;
      const tokensToMint = remainingSupply / ethers.parseEther("1") + BigInt(1);
      
      await expect(
        kampungCoin.mint(addr1.address, tokensToMint)
      ).to.be.revertedWith("Minting would exceed maximum supply");
    });

    it("Should allow minting up to max supply", async function () {
      const currentSupply = await kampungCoin.totalSupply();
      const maxSupply = await kampungCoin.MAX_SUPPLY();
      const remainingSupply = maxSupply - currentSupply;
      const tokensToMint = remainingSupply / ethers.parseEther("1");
      
      await kampungCoin.mint(addr1.address, tokensToMint);
      expect(await kampungCoin.totalSupply()).to.equal(maxSupply);
    });
  });

  describe("Burning", function () {
    it("Should allow token holders to burn their tokens", async function () {
      const burnAmount = ethers.parseEther("1000");
      const initialBalance = await kampungCoin.balanceOf(owner.address);
      
      await kampungCoin.burn(burnAmount);
      
      const finalBalance = await kampungCoin.balanceOf(owner.address);
      expect(finalBalance).to.equal(initialBalance - burnAmount);
    });

    it("Should decrease total supply when tokens are burned", async function () {
      const burnAmount = ethers.parseEther("1000");
      const initialSupply = await kampungCoin.totalSupply();
      
      await kampungCoin.burn(burnAmount);
      
      const finalSupply = await kampungCoin.totalSupply();
      expect(finalSupply).to.equal(initialSupply - burnAmount);
    });

    it("Should fail if trying to burn more than balance", async function () {
      const balance = await kampungCoin.balanceOf(addr1.address);
      
      await expect(
        kampungCoin.connect(addr1).burn(balance + ethers.parseEther("1"))
      ).to.be.revertedWithCustomError(kampungCoin, "ERC20InsufficientBalance");
    });

    it("Should allow burning from allowance", async function () {
      const allowanceAmount = ethers.parseEther("1000");
      const burnAmount = ethers.parseEther("500");
      
      await kampungCoin.approve(addr1.address, allowanceAmount);
      await kampungCoin.connect(addr1).burnFrom(owner.address, burnAmount);
      
      const ownerBalance = await kampungCoin.balanceOf(owner.address);
      const initialSupply = ethers.parseEther(INITIAL_SUPPLY.toString());
      expect(ownerBalance).to.equal(initialSupply - burnAmount);
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership", async function () {
      await kampungCoin.transferOwnership(addr1.address);
      expect(await kampungCoin.owner()).to.equal(addr1.address);
    });

    it("Should prevent non-owner from transferring ownership", async function () {
      await expect(
        kampungCoin.connect(addr1).transferOwnership(addr2.address)
      ).to.be.revertedWithCustomError(kampungCoin, "OwnableUnauthorizedAccount");
    });

    it("Should allow new owner to mint after ownership transfer", async function () {
      await kampungCoin.transferOwnership(addr1.address);
      await kampungCoin.connect(addr1).mint(addr2.address, 100);
      
      const addr2Balance = await kampungCoin.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.parseEther("100"));
    });
  });

  describe("ERC20 Standard Functions", function () {
    it("Should approve and check allowance", async function () {
      const allowanceAmount = ethers.parseEther("100");
      
      await kampungCoin.approve(addr1.address, allowanceAmount);
      expect(await kampungCoin.allowance(owner.address, addr1.address)).to.equal(allowanceAmount);
    });

    it("Should transfer from approved address", async function () {
      const allowanceAmount = ethers.parseEther("100");
      const transferAmount = ethers.parseEther("50");
      
      await kampungCoin.approve(addr1.address, allowanceAmount);
      await kampungCoin.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);
      
      expect(await kampungCoin.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await kampungCoin.allowance(owner.address, addr1.address)).to.equal(allowanceAmount - transferAmount);
    });

    it("Should have 18 decimals", async function () {
      expect(await kampungCoin.decimals()).to.equal(18);
    });
  });
});
