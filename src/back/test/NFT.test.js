const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
  let owner, addr1, addr2, nft;
  let URI1 = "Sample URI 1";
  let URI2 = "Sample URI 2";

  beforeEach(async function() {
    const NFT = await ethers.getContractFactory("NFT");

    [owner, addr1, addr2] = await ethers.getSigners();
    nft = await NFT.deploy();

    await nft.deployed();
  });

  describe("Deployment", function() {
    it("Should track name and symbol of NFT collection", async function() {
      expect(await nft.name()).to.equal("MyNFT");
      expect(await nft.symbol()).to.equal("NFT");
    });
  });

  describe("Minting NFTs", function() {
    it("Should track all minted NFTs", async function() {
      await nft.connect(addr1).mint(URI1);
      expect(await nft.tokenCount()).to.equal(1);
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.balanceOf(addr2.address)).to.equal(0);
      expect(await nft.tokenURI(1)).to.equal(URI1);

      await nft.connect(addr2).mint(URI2);
      expect(await nft.tokenCount()).to.equal(2);
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
      expect(await nft.tokenURI(2)).to.equal(URI2);
    });
  });


});