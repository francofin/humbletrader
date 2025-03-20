const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const { ethers } = require("hardhat");


const setTokenSupply = (n) => {
return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe("DEX", () => {
let tokenSupply = setTokenSupply(0.001);
let token;
let owner;
let feeAccount;
let addr1;
let addr2;
let addr3;
let dex;
let price=50;
const feePercent = 10;

before(async () => {
    [owner, feeAccount, addr1, addr2, addr3] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(tokenSupply, "BlackChain", "BLK");
    altToken = await Token.deploy(tokenSupply, "Mock Dai", "mDAI");

    const Dex = await ethers.getContractFactory("DEX");
    dex = await Dex.deploy( feeAccount.address, feePercent);

    let transferAction = await token.transfer(addr1.address, setTokenSupply(0.00003))
    await transferAction.wait()
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

    it("Tracks a fee account", async () => {
        const dexAccount = await dex.feeAccount();
        expect(dexAccount).to.equal(feeAccount.address);
    })

    it("Tracks a fee Percent", async () => {
        const fee = await dex.fee();
        expect(fee).to.equal(feePercent);
    })
});

describe("Depositing Tokens", () => {
    let tokenDeposited, result;
    let amount = 40000;
    
    describe("Success", () => {
        before(async() => {
            await token.connect(addr1).approve(dex.address, setTokenSupply(0.00001))
            tokenDeposited = await dex.connect(addr1).depositTokens(token.address, setTokenSupply(0.00001));
            result = await tokenDeposited.wait()
        })
        it("it should deposit tokens", async () => {  
            
            expect(tokenDeposited).to.changeTokenBalances(token, [addr1.address, dex.address], [setTokenSupply(-0.00001), setTokenSupply(0.00001)]);
        })
    })

    describe("Failure", () => {
        it("it should fail to deposit tokens", async () => {
            console.log("Owner Balance", await token.balanceOf(owner.address))
            console.log("Addr1 Balance", await token.balanceOf(addr1.address))
            console.log("Dex Balance", await token.balanceOf(dex.address))
            await expect(dex.connect(addr2).depositTokens(token.address, setTokenSupply(0.00003))).to.be.reverted;
        })
    })

});

describe("Withdrawing Tokens", () => {
    let tokenWithdraw, withdrawResult;
    
    describe("Success", () => {
        before(async() => {
            
            tokenWithdraw = await dex.connect(addr1).withdrawTokens(token.address, setTokenSupply(0.00001));
            withdrawResult = await tokenWithdraw.wait()
    
        })
        it("it should withdraw tokens", async () => {  
            console.log("Owner Balance", await token.balanceOf(owner.address))
            console.log("Addr1 Balance", await token.balanceOf(addr1.address))
            console.log("Dex Balance", await token.balanceOf(dex.address))
            expect(tokenWithdraw).to.changeTokenBalances(token, [addr1.address, dex.address], [setTokenSupply(0.00001), setTokenSupply(-0.00001)]);
        })
    })

    describe("Failure", () => {
        it("it should fail for insufficient balance tokens", async () => {
            await expect(dex.connect(addr1).depositTokens(token.address, setTokenSupply(133333))).to.be.reverted;
        })
    })

});

describe("Making Orders", () => {
    let tx, result, depositTx, depositResult, orderTx, orderResult;
    
    describe("Success", () => {
        before(async() => {
            tx = await token.connect(addr1).approve(dex.address, setTokenSupply(0.00001))
            result = await tx.wait()
            depositTx = await dex.connect(addr1).depositTokens(token.address, setTokenSupply(0.00001));
            depositResult = await depositTx.wait()
            orderTx = await dex.connect(addr1).makeOrder(altToken.address, token.address, setTokenSupply(0.00001), setTokenSupply(0.00001));
            orderResult = await orderTx.wait()

    
        })
        it("Tracks newly created orders", async () => { 
            console.log("Owner Balance", await token.balanceOf(owner.address))
            console.log("Addr1 Balance", await token.balanceOf(addr1.address))
            console.log("Dex Balance", await token.balanceOf(dex.address))
            expect(await dex.orderId()).to.equal(orderResult.events[0].args.id);
        });
    })

    describe("Failure", () => {
        it("SHould reject with no balance", async() => {
            await expect(dex.connect(addr1).makeOrder(token.address, altToken.address, setTokenSupply(0.00001), setTokenSupply(0.00001))).to.be.reverted;
        })
    })

});

describe("Order Actions", () => {
    let tx, result, dTx, dResult, user2tx, user2Result, orderTx, orderResult;
    before(async() => {

        console.log("---------------------------------------------------------------")

        // give tokens to user 2
        tx = await altToken.connect(owner).transfer(addr2.address, setTokenSupply(0.00003))
        result = await tx.wait(); 

        user2tx = await altToken.connect(addr2).approve(dex.address, setTokenSupply(0.00002))
        user2Result = await user2tx.wait();

        dTx = await dex.connect(addr2).depositTokens(altToken.address, setTokenSupply(0.00002));
        dResult = await dTx.wait()


        orderTx = await dex.connect(addr1).makeOrder(altToken.address, token.address, setTokenSupply(0.00001), setTokenSupply(0.00001));
        orderResult = await orderTx.wait()

        console.log("Owner Balance", await token.balanceOf(owner.address))
        console.log("Addr1 Balance", await token.balanceOf(addr1.address))
        console.log("Dex Balance", await token.balanceOf(dex.address))
        console.log("---------------------------------------------------------------")
        // console.log(orderResult.events[0].args.id) 
    })
    
    describe("Cancelling Orders", () => {
        describe("Sucess", () => {
            let cancelledOrder, cancelledResult;
            before(async() => {
                cancelledOrder  =await dex.connect(addr1).cancelToken(orderResult.events[0].args.id)
                cancelledResult = await cancelledOrder.wait();

            })

            it("update Cancelled Order", async () => { 
                console.log("Owner Balance", await token.balanceOf(owner.address))
                console.log("Addr1 Balance", await token.balanceOf(addr1.address))
                console.log("Dex Balance", await token.balanceOf(dex.address))
                console.log("---------------------------------------------------------------")
                // console.log(await dex.orders(approveOrder.events[0].args.id));
                // console.log(await dex.orderCancelled(2));
                expect(await dex.orderCancelled(orderResult.events[0].args.id)).to.equal(true);
            });


            it("Should reject cancel", async() => {
                await expect(dex.connect(addr2).cancelToken(orderResult.events[0].args.id)).to.be.reverted;
            })
        })

        // describe('Failure', async () => {
        //     beforeEach(async () => {
        //       // user1 deposits tokens
        //       tx = await token.connect(addr1).approve(dex.address, setTokenSupply("1"))
        //       result = await tx.wait()
        //       tx = await dex.connect(addr1).depositTokens(token.address, setTokenSupply("1"))
        //       result = await tx.wait()
        //       // Make an order
        //       tx = await dex.connect(addr1).makeOrder(altToken.address, token.address, setTokenSupply("1"), setTokenSupply("1"));
        //       result = await tx.wait()
        //     })
          
        //     it('rejects invalid order ids', async () => {
        //       const invalidOrderId = 99999
        //       await expect(dex.connect(addr1).cancelToken(invalidOrderId)).to.be.reverted
        //     })
          
        //     it('rejects unauthorized cancelations', async () => {
        //       await expect(dex.connect(addr2).cancelToken(1)).to.be.reverted
        //     })
          
        //   })
        
    });


    describe("Fill Order", () => {
        let tx, result, orderTx, orderResult;
        before(async() => {

            orderTx = await dex.connect(addr1).makeOrder(altToken.address, token.address, setTokenSupply(0.00001), setTokenSupply(0.00001));
            orderResult = await orderTx.wait()


            tx = await dex.connect(addr2).fillOrder(orderResult.events[0].args.id);
            result = await tx.wait();
        })


        describe("Success", () => {
            it("Executes the trade and charge fees", async() => {
           
                expect(await dex.balanceOf(token.address, addr1.address)).to.equal(setTokenSupply(0));
                expect(await dex.balanceOf(token.address, addr2.address)).to.equal(setTokenSupply(0.00001));
                expect(await dex.balanceOf(token.address, feeAccount.address)).to.equal(setTokenSupply(0));
    
                
                console.log("Addr1 Balance", await dex.balanceOf(altToken.address, addr1.address))
                console.log("DeFee Account Balance", await dex.balanceOf(altToken.address, feeAccount.address))
                console.log("Addr2 Balance", await dex.balanceOf(altToken.address, addr2.address))
                //Check Balances for token Give
                // //Token Get
                console.log("Token Get")
                expect(await dex.balanceOf(altToken.address, addr1.address)).to.equal(setTokenSupply(0.00001));
                expect(await dex.balanceOf(altToken.address, addr2.address)).to.equal(setTokenSupply(0.000009));
                expect(await dex.balanceOf(altToken.address, feeAccount.address)).to.equal(setTokenSupply(0.000001));
            })
    
            it('emits a Trade event', async () => {
                const event = result.events[0]
                expect(event.event).to.equal('Trade')
              
                const args = event.args
                
                expect(args.id).to.equal(3)
                expect(args.user).to.equal(addr2.address)
                expect(args.tokenGet).to.equal(altToken.address)
                expect(args.amountGet).to.equal(setTokenSupply(0.00001))
                expect(args.tokenGive).to.equal(token.address)
                expect(args.amountGive).to.equal(setTokenSupply(0.00001))
                expect(args.creator).to.equal(addr1.address)
                // expect(args.timestamp).to.at.least(1)
              });
    
            it('updates filled orders', async () => {
                console.log((await dex.orders(3)).orderFilled)
            expect((await dex.orders(3)).orderFilled).to.equal(true)
            })
        })

        

        describe('Failure', () => {
            it('rejects invalid order ids', async () => {
                const invalidOrderId = 99999
                await expect(dex.connect(addr2).fillOrder(invalidOrderId)).to.be.reverted
            })
            
            it('rejects already filled orders', async () => {
                // transaction = await dex.connect(addr2).fillOrder(3)
                // await transaction.wait()
            
                await expect(dex.connect(addr2).fillOrder(3)).to.be.reverted
            })
            
            it('Rejects canceled orders', async () => {
                transaction = await dex.connect(addr1).cancelToken(3)
                await transaction.wait()
            
                await expect(dex.connect(addr2).fillOrder(3)).to.be.reverted
            })
            
            })
    })



});

})