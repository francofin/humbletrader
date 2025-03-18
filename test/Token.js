const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const { ethers } = require("hardhat");

  const setTokenSupply = (n) => {
    return ethers.utils.parseUnits(n, 'ether');
  }

  describe("Token", () => {
    let tokenSupply = setTokenSupply('1000000');
    let token;
    let owner;
    let addr1;
    let addr2;
    let addr3;

    before(async () => {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy(tokenSupply, "BlackChain", "BLK");
    });

    describe("Deployment", () => {
        it("Should return the name blackchain", async () => {
            const tokenName = await token.name();
            expect(tokenName).to.equal("BlackChain");
        })

        it("Should return the symbol BLK", async () => {
            const tokenName = await token.symbol();
            expect(tokenName).to.equal("BLK");
        })
    });

    describe("Transactions", () => {

        // beforeEach(async() => {

        // })

        it("Should assign total supply to owner of tokens", async () => {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        });

        it("Should transfer tokens between accounts", async () => {
            //connect account to contract, for functions that return a transaction, we can wait() the transaction to write to the blockchain.
            await token.connect(owner).transfer(addr1.address, setTokenSupply('100'));
            const addr1balance = await token.balanceOf(addr1.address);
            const ownerBalance = await token.balanceOf(owner.address);
            console.log(ownerBalance)
            expect(addr1balance).to.equal(setTokenSupply('100'));
        });

        it("Emits a transfer event", async() => {
            let transaction = await token.connect(owner).transfer(addr1.address, setTokenSupply('100'));
            let result = await transaction.wait();
            expect(result.events[0].event).to.equal('Transfer');
        })

        it("Should not transfer higher balances", async () => {
            await expect(token.connect(addr1).transfer(addr2.address, setTokenSupply('350'))).to.be.reverted;
        });
    })

    describe("Approving Tokens", () => {
        let amount, transaction, result;
        beforeEach(async() => {
            amount = setTokenSupply('100')
            transaction = await token.connect(owner).approve(addr3.address, amount);
            result = await transaction.wait(); //event and logs
            console.log(await token.balanceOf(owner.address));
        })
        describe("Success", () => {
            it("Allocates allowance for token spending", async() => {
                // console.log(result);
                let remaining = await token.allowance(owner.address, addr3.address)
                // console.log(remaining)
                
                expect(remaining).to.equal(setTokenSupply('100'))
            })
            
        })

        describe("Failure", () => {
            it("Should not Allocate allowance for token spending", async() => {
                // console.log(result);
                //reverts as addr2 is not approved for spending
                let remaining = await token.allowance(owner.address, addr2.address)
                // console.log(remaining)
                expect(remaining).to.be.reverted;
            })
            
        })
    })

    describe("Transferring From Approved Account", () => {
        let amount, transaction, result;
        beforeEach(async() => {
            amount = setTokenSupply('1000')
            transaction = await token.connect(owner).approve(addr3.address, amount);
            result = await transaction.wait(); //event and logs
        })

        describe("Success", () => {
            beforeEach(async() => {
                transferTransaction = await token.connect(addr3).transferFrom(owner.address, addr2.address, setTokenSupply('100'));
                transferResult = await transferTransaction.wait(); //event and logs
                
            })
            it("Should delegate addr3 to transfer tokens", async() => {
                let remaining = await token.allowance(owner.address, addr3.address)
                console.log("Exchange balance", (remaining))
                console.log(transferResult);
                expect(await token.balanceOf(owner.address)).to.equal(setTokenSupply('999700'));
                expect(await token.balanceOf(addr2.address)).to.equal(setTokenSupply('100'));

            })
        })

        describe("Failure", () => {
            it("Should Fail to transfer tokens", async() => {
                let remaining = await token.allowance(owner.address, addr3.address)
                let tx = await token.connect(addr3).transferFrom(owner.address, addr2.address, setTokenSupply('100'));
                console.log("Exchange balance", (remaining))
                console.log(transferResult);
                expect(tx).to.be.reverted;

            })
        })
    })
  })