const hre = require('hardhat')

async function main() {
    const Greet = await hre.ethers.getContractFactory("Greeter");
    const greet = await Greet.deploy("Hello Hardhat");

    console.log("Greeter deployed to ", greet.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });