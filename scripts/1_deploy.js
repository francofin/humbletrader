const hre = require('hardhat');
const { ethers } = require("hardhat");
const fs = require("fs/promises");
const fsystem = require('fs');
const path = require('path')

const setTokenSupply = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

//put smart contract on the blockchain
async function main() {
    const Token = await hre.ethers.getContractFactory("Token");
    const Dex = await hre.ethers.getContractFactory("DEX")

    const accounts = await hre.ethers.getSigners();
    let tokenSupply = setTokenSupply(1000);
    let user1 = accounts[0]
    let user2 = accounts[1]
    let user3 = accounts[2]
    let user4 = accounts[3]
    let user5 = accounts[4]
    let user6 = accounts[5]
    let user7 = accounts[6]
    let user8 = accounts[7]
    let feeAccount = accounts[8]
    const feePercent = 10;
    

    console.log(`Accounts fetched:\n${accounts[0].address} \n${accounts[1].address}`)

    const blk = await Token.deploy(tokenSupply, "BlackChain", "BLK");
    await blk.deployed();
    console.log(`BLK Token deployed to , ${blk.address}`);
    console.log(await blk.balanceOf(accounts[0].address))
    await writeDeploymentInfor(blk, "blk-token_deploy");

    const mEth = await Token.deploy(tokenSupply, "EtherM", "mETH");
    await mEth.deployed();
    console.log(`mEth deployed to , ${mEth.address}`);
    console.log(await mEth.balanceOf(accounts[0].address))
    await writeDeploymentInfor(mEth, "mEth-token_deploy");


    const mDai = await Token.deploy(tokenSupply, "DAIM", "mDAI");
    await mDai.deployed();
    console.log(`mDai deployed to , ${mDai.address}`);
    await writeDeploymentInfor(mDai, "mDai-token_deploy");

    const dex = await Dex.deploy( feeAccount.address, feePercent);
    await dex.deployed();
    console.log(`Dex deployed to , ${dex.address}`);
    await writeDeploymentInfor(dex, "dex-deploy");
    
}

async function writeDeploymentInfor(contract, fileName) {
    const data = {
        contract: {
            address: contract.address,
            signerAddress: contract.signer.address,
            abi: contract.interface.format()
        }
    }

    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(`${fileName}.json`, content, {encoding: "utf-8"});
} 


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });