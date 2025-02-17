const { ethers } = require("ethers");

const rpcUrl = "https://mainnet.infura.io/v3/12504af88912438ebb73308a5fb34f32"
// const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`)
const provider = new ethers.JsonRpcProvider(rpcUrl)

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() public view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",
];

// const address = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract
const address = '0x514910771AF9Ca656af840dff83E8264EcF986CA' // DAI Contract
const contract = new ethers.BaseContract(address, ERC20_ABI, provider)

const main = async () => {
    const name = await contract.name()
    const symbol = await contract.symbol()
    const decimals = await contract.decimals()
    const totalSupply = await contract.totalSupply()

    console.log(`\nReading from ${address}\n`)
    console.log(`Name: ${name}`)
    console.log(`Decimals: ${decimals}`)
    console.log(`Symbol: ${symbol}`)
    console.log(`Total Supply: ${totalSupply}\n`)

    const balance = await contract.balanceOf('0x88a1493366D48225fc3cEFbdae9eBb23E323Ade3')

    console.log(`Balance Returned: ${balance}`)
    console.log(`Balance Formatted: ${ethers.formatEther(balance)}\n`)
}

main()