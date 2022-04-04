const { expect } = require('chai')
const { ethers } = require('hardhat')

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe('Marketplace', function () {
  let owner, addr1, addr2, marketplace, nft
  let feePercent = 1
  let URI1 = 'Sample URI 1'

  beforeEach(async function () {
    const Marketplace = await ethers.getContractFactory('Marketplace')
    const NFT = await ethers.getContractFactory('NFT')

    ;[owner, addr1, addr2] = await ethers.getSigners()
    marketplace = await Marketplace.deploy(feePercent)
    nft = await NFT.deploy()

    await marketplace.deployed()
    await nft.deployed()
  })

  describe('Deployment', function () {
    it('Should initialize feeAccount to deployer', async function () {
      expect(await marketplace.feeAccount()).to.equal(owner.address)
    })
    it('Should initialize feePercent to parameter', async function () {
      expect(await marketplace.feePercent()).to.equal(feePercent)
    })
  })

  describe('Put up NFT for sale', function () {
    let price = toWei(1)

    beforeEach(async function () {
      await nft.connect(addr1).mint(URI1)
      await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
    })

    async function addr1PutUpForSale(_price = null) {
      await marketplace
        .connect(addr1)
        .putUpForSale(nft.address, 1, _price ? _price : price)
    }

    it('Should fail if negative price', async function () {
      await expect(addr1PutUpForSale(-1)).to.be.reverted
    })

    it('Should increment itemCount', async function () {
      const oldItemCount = await marketplace.itemCount()
      await addr1PutUpForSale()
      expect(await marketplace.itemCount()).to.equal(oldItemCount + 1)
    })

    it('Should NFT be owned by marketplace', async function () {
      await addr1PutUpForSale()
      expect(await nft.ownerOf(1)).to.equal(marketplace.address)
    })

    it('Created item should be added to mapping', async function () {
      await addr1PutUpForSale()
      const newItem = await marketplace.items(1)
      expect(newItem.itemId).to.equal(1)
      expect(newItem.nft).to.equal(nft.address)
      expect(newItem.tokenId).to.equal(1)
      expect(newItem.price).to.equal(price)
      expect(newItem.seller).to.equal(addr1.address)
      expect(newItem.sold).to.equal(false)
    })

    it('Should emit ForSale event', async function () {
      expect(await addr1PutUpForSale())
        .to.emit(marketplace, 'ForSale')
        .withArgs(1, nft.address, 1, price, addr1.address)
    })
  })
})
