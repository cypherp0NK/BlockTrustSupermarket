const { expect } = require('chai');
var chai = require('chai');
const BN = require('bn.js');
chai.use(require('chai-bn')(BN));

describe('Unit Tests', function () {
    before(async function () {
        const ContractFactory = await ethers.getContractFactory("BlockTrustSupermarket")
        BlockTrustSupermarket = await ContractFactory.deploy()
        await BlockTrustSupermarket.deployed()
        
    });

    it('Ensure the price for each items was mapped correctly', async function () {
        expect((await BlockTrustSupermarket.checkMerch("T-Shirt")).toString()).to.equal((1e17).toString())
        expect((await BlockTrustSupermarket.checkMerch("Hoodie")).toString()).to.equal((5e17).toString())
        expect((await BlockTrustSupermarket.checkMerch("Jacket")).toString()).to.equal((1e18).toString())
        expect((await BlockTrustSupermarket.checkMerch("Short")).toString()).to.equal((1e17).toString())
        expect((await BlockTrustSupermarket.checkMerch("Trouser")).toString()).to.equal((2e17).toString())
        expect((await BlockTrustSupermarket.checkMerch("KeyHolder")).toString()).to.equal((1e15).toString())
        expect((await BlockTrustSupermarket.checkMerch("Socks")).toString()).to.equal((3e15).toString())
        expect((await BlockTrustSupermarket.checkMerch("Trainers")).toString()).to.equal((2e17).toString())

        });

    it('Checkout #1: Should revert if items to checkout are less than 3', async function () {
        await expect (BlockTrustSupermarket.checkOut(["Short", "KeyHolder"], ["1","1"], "Blockchain street")).to.be.revertedWith(
            'You need to purchase at least 3 items'
          );
        });

    it('Checkout #2: Should not revert if items to checkout are 3 or more', async function () {
        await expect (BlockTrustSupermarket.checkOut(["Short", "KeyHolder", "Trainers"], ["1","1","1"], "Blockchain street")).not.to.be.reverted
        });

    it('Checkout #3: Get Total Price of items at point of checkout and ensure accuracy', async function () {
        const priceOfShort = 1e17;
        const priceOfKeyHolder = 1e15;
        const priceOfTrainers = 2e17;
        const expected = priceOfShort + priceOfKeyHolder + priceOfTrainers 

        const txn = await BlockTrustSupermarket.checkOut(["Short", "KeyHolder", "Trainers"], ["1","1","1"], "Blockchain steet")
        const tx_hash = await txn.wait()
        const actual = ethers.utils.formatEther(tx_hash.events[0].args[2]) * 1e18 // Times 1e18 to convert the bigNumber from Ether to Wei
        console.log(actual)
        expect(actual.toString()).to.equal(expected.toString())

        });

    it('Checkout #4: Buy 2 or more Jackets and get 1 at half the price', async function(){
        const priceOfTShirt = 1e17
        const priceOfHoodie = 5e17
        const priceOfJacket = 1e18 //Jacket is the item with a discount
        const expected = priceOfTShirt + priceOfHoodie + ((priceOfJacket * 2) - (priceOfJacket/2))

        const txn = await BlockTrustSupermarket.checkOut(["T-Shirt", "Hoodie", "Jacket"], ["1","1","2"], "Blockchain steet")
        const tx_hash = await txn.wait()
        const actual = ethers.utils.formatEther(tx_hash.events[0].args[2]) * 1e18 // Times 1e18 to convert the bigNumber from Ether to Wei
        const discount = tx_hash.events[0].args[4]
        console.log(actual, discount) //the second output of the console tells you if the checkout had a discount or not
        expect(actual.toString()).to.equal(expected.toString())
        expect(discount).to.equal(true)

    })

    it('Checkout #5: Buy only one Jacket', async function(){
        const priceOfTShirt = 1e17
        const priceOfHoodie = 5e17
        const priceOfJacket = 1e18
        const expected = priceOfTShirt + priceOfHoodie + priceOfJacket

        const txn = await BlockTrustSupermarket.checkOut(["T-Shirt", "Hoodie", "Jacket"], ["1","1","1"], "Blockchain steet")
        const tx_hash = await txn.wait()
        const actual = ethers.utils.formatEther(tx_hash.events[0].args[2]) * 1e18 // Times 1e18 to convert the bigNumber from Ether to Wei
        const discount = tx_hash.events[0].args[4]
        console.log(actual, discount) //the second output of the console tells you if the checkout had a discount or not
        expect(actual.toString()).to.equal(expected.toString())
        expect(discount).to.equal(false)

    })
    it('Checkout #6: Buy more than one of each item', async function(){
        const priceOfTShirt = 1e17
        const priceOfHoodie = 5e17
        const priceOfTrouser = 2e17
        const priceOfJacket = 1e18
        const expected = (priceOfTShirt * 4) + (priceOfHoodie * 3) + (priceOfTrouser * 11) + ((priceOfJacket * 5) - (priceOfJacket/2))

        const txn = await BlockTrustSupermarket.checkOut(["T-Shirt", "Hoodie", "Trouser", "Jacket"], ["4","3","11","5"], "Blockchain steet")
        const tx_hash = await txn.wait()
        const actual = ethers.utils.formatEther(tx_hash.events[0].args[2]) * 1e18
        const discount = tx_hash.events[0].args[4]
        console.log(actual, discount) 
        expect(actual.toString()).to.equal(expected.toString())
        expect(discount).to.equal(true)

    })

    

  });

