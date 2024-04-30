
const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log(deployer.address);

    console.log((await deployer.provider.getNetwork()).chainId);

    const chainId = Number((await deployer.provider.getNetwork()).chainId.toString())

    if (chainId !== 245022926) {
        throw "can be deployed only on neon devnet"
    }

    const {
        poolAddress,
        usdcAddress,
        wethAddress
    } = getAddresses(chainId);

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    const Liquidator = await ethers.getContractFactory("Liquidator");

    // console.log(Liquidator);
    const contract = await Liquidator.deploy(poolAddress);

    console.log("Contract deploying at:", await contract.getAddress());
    
    const tx = contract.deploymentTransaction();
    const receipt = await tx.wait();
    console.log("Contract deployed at:", receipt.hash);

    // const saySomething = await contract.speak();

    // console.log("saySomething value:", saySomething);
}

const getAddresses = (chainid) => {
    //   if (chainid === 11155111) {
    //     return {
    //       poolAddress: '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951',
    //       usdcAddress: '0xf08A50178dfcDe18524640EA6618a1f965821715',
    //       wethAddress: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9'
    //     }
    //   } 

    return {
        poolAddress: '0x64916311cf63F208069E5Ef6CA4b2a4Dc1987e8a',
        usdcAddress: '0x26833EeC144EF2d7b2394CAFbd5CD5ceB1d3B3Af',
        wethAddress: '0x9720f3c6186111C0dc9f47c79B8C19fc8bAC5cfB'
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
