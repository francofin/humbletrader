const {ethers} = require('ethers');

const rpcUrl = "https://mainnet.infura.io/v3/12504af88912438ebb73308a5fb34f32"

const provider = new ethers.JsonRpcProvider(rpcUrl)

const address = '0xC94eBB328aC25b95DB0E0AA968371885Fa516215'


const main = async() => {
    const balance = await provider.getBalance(address)
    console.log("Balance: ", ethers.formatEther(balance));
}


main();


