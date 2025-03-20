const hre = require('hardhat');
const { ethers } = require("hardhat");
const fs = require("fs/promises");
const fsystem = require('fs');
const path = require('path')

const setTokenSupply = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

const wait = (second) => {
    const millisecs = second* 1000;
    return new Promise(resolve => setTimeout(resolve, millisecs));
}

async function main() {

    const {chainId} = await ethers.provider.getNetwork();
    console.log("using chain: ", chainId)
    const blkFilePath = path.join(process.cwd(), './', 'blk-token_deploy.json');
    const blkJsonData = fsystem.readFileSync(blkFilePath, 'utf-8');
    const blkData = JSON.parse(blkJsonData);
    console.log(blkData)

    const mEthFilePath = path.join(process.cwd(), './', 'mEth-token_deploy.json');
    const mEthJsonData = fsystem.readFileSync(mEthFilePath, 'utf-8');
    const mEthData = JSON.parse(mEthJsonData);

    const mDaiFilePath = path.join(process.cwd(), './', 'mDai-token_deploy.json');
    const mDaiJsonData = fsystem.readFileSync(mDaiFilePath, 'utf-8');
    const mDaiData = JSON.parse(mDaiJsonData);

    const  DexFilePath = path.join(process.cwd(), './', 'dex-deploy.json');
    const  DexJsonData = fsystem.readFileSync(DexFilePath, 'utf-8');
    const DexData = JSON.parse(DexJsonData);


    const accounts = await hre.ethers.getSigners();
    let user1 = accounts[0]
    let user2 = accounts[1]
    let user3 = accounts[2]
    let user4 = accounts[3]
    let user5 = accounts[4]
    let user6 = accounts[5]
    let user7 = accounts[6]
    let user8 = accounts[7]

    //Fetch Deployed Tokens

    const Blk = await hre.ethers.getContractAt("Token", blkData.contract.address);
    console.log("Token Fethced ", Blk.address);

    const mEth = await hre.ethers.getContractAt("Token", mEthData.contract.address);
    console.log("Token Fethced ", mEth.address);

    const mDai = await hre.ethers.getContractAt("Token", mDaiData.contract.address);
    console.log("Token Fethced ", mDai.address);

    const DEX = await hre.ethers.getContractAt("DEX", DexData.contract.address);
    console.log("DEX Fethced ", DEX.address);
    //Distribute Tokens
    let tx, result, approve, approveResult, deposit, depositResult, orderTx, orderResult;

    let amount = setTokenSupply(500)
    tx = await mEth.connect(user1).transfer(user2.address, amount);
    result = await tx.wait();
    console.log(result);

    tx = await mDai.connect(user1).transfer(user3.address, amount);
    result = await tx.wait();

    console.log(amount)
    console.log(await mEth.balanceOf(user2.address))

    //Deposit Token to Exchange

    approve = await Blk.connect(user1).approve(DEX.address, setTokenSupply(500))
    approveResult = await approve.wait();

    deposit = await DEX.connect(user1).depositTokens(Blk.address, setTokenSupply(500));
    depositResult = await deposit.wait()

    approve = await mEth.connect(user2).approve(DEX.address, setTokenSupply(500))
    approveResult = await approve.wait();

    deposit = await DEX.connect(user2).depositTokens(mEth.address, setTokenSupply(500));
    depositResult = await deposit.wait()

    approve = await mDai.connect(user3).approve(DEX.address, setTokenSupply(500))
    approveResult = await approve.wait();

    deposit = await DEX.connect(user3).depositTokens(mDai.address, setTokenSupply(500));
    depositResult = await deposit.wait()

    //Make Orders
    let orderId;
    orderTx = await DEX.connect(user1).makeOrder(mEth.address, Blk.address, setTokenSupply(0.00001), setTokenSupply(0.000005));
    orderResult = await orderTx.wait()

    console.log(`Made order from ${user1.address}`)

    //Cancel Orders
    orderId = orderResult.events[0].args.id;
    cancelledOrder  =await DEX.connect(user1).cancelToken(orderId)
    cancelledResult = await cancelledOrder.wait();
    console.log(`Filled order from ${user1.address}\n`)

    await wait(1)

    //Fill Orders

    orderTx = await DEX.connect(user1).makeOrder(mEth.address, Blk.address, setTokenSupply(10), setTokenSupply(20));
    orderResult = await orderTx.wait()
    console.log(`Made order from ${user1.address}`)

    orderId = orderResult.events[0].args.id;
    tx = await DEX.connect(user2).fillOrder(orderId);
    result = await tx.wait();
    console.log(`Filled order from ${user1.address}\n`)

    await wait(1)

    orderTx = await DEX.connect(user1).makeOrder(mDai.address, Blk.address, setTokenSupply(5), setTokenSupply(50));
    orderResult = await orderTx.wait()
    console.log(`Made order from ${user1.address}`)

    orderId = orderResult.events[0].args.id;
    tx = await DEX.connect(user3).fillOrder(orderId);
    result = await tx.wait();
    console.log(`Filled order from ${user1.address}\n`)

    await wait(1)

    orderTx = await DEX.connect(user1).makeOrder(mEth.address, Blk.address, setTokenSupply(20), setTokenSupply(40));
    orderResult = await orderTx.wait()
    console.log(`Made order from ${user1.address}`)

    orderId = orderResult.events[0].args.id;
    tx = await DEX.connect(user2).fillOrder(orderId);
    result = await tx.wait();
    console.log(`Filled order from ${user1.address}\n`)

    await wait(1)

    orderTx = await DEX.connect(user1).makeOrder(mDai.address, Blk.address, setTokenSupply(10), setTokenSupply(100));
    orderResult = await orderTx.wait()
    console.log(`Made order from ${user1.address}`)

    orderId = orderResult.events[0].args.id;
    tx = await DEX.connect(user3).fillOrder(orderId);
    result = await tx.wait();
    console.log(`Filled order from ${user1.address}\n`)

    await wait(1)

    //Seed Open Orders

    //User 1 makes orders
    for (let i=0; i<=10; i++){
        if(i%2 === 0){
            address = mEth.address;
        } else{
            address = mDai.address;
        }
        orderTx = await DEX.connect(user1).makeOrder(address, Blk.address, setTokenSupply(10*i), setTokenSupply(5*1));
        result = orderTx.wait();

        console.log(`Made order from ${user1.address}`)
        await wait(1)
    }

    //User 2 makes orders
    for (let i=0; i<=10; i++){
        if(i%2 === 0){
            address = Blk.address;
        } else{
            address = mDai.address;
        }
        orderTx = await DEX.connect(user2).makeOrder(address, mEth.address, setTokenSupply(5*i), setTokenSupply(2*i));
        result = orderTx.wait();

        console.log(`Made order from ${user2.address}`)
        await wait(1)
    }
    
    //User 3 makes orders
    for (let i=0; i<=10; i++){
        if(i%2 === 0){
            address = Blk.address;
        } else{
            address = mEth.address;
        }
        orderTx = await DEX.connect(user3).makeOrder(address, mDai.address, setTokenSupply(3*i), setTokenSupply(1*i));
        result = orderTx.wait();

        console.log(`Made order from ${user3.address}`)
        await wait(1)
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });