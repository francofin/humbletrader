const hre = require('hardhat');
const { ethers } = require("ethers");
const fs = require("fs/promises");

//put smart contract on the blockchain
async function main() {
    const Token = await hre.ethers.getContractFactory("Token");
    const token = await Token.deploy(1000000000000000, "BlackChain", "BLK");
    await token.deployed();
    console.log(`Token deployed to , ${token.address}`);
    await writeDeploymentInfor(token);
    
}

async function writeDeploymentInfor(contract) {
    const data = {
        contract: {
            address: contract.address,
            signerAddress: contract.signer.address,
            abi: contract.interface.format()
        }
    }

    const content = JSON.stringify(data, null, 2);
    await fs.writeFile("token-deployment.json", content, {encoding: "utf-8"});
} 


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });