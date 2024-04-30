import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress, erc20Abi } from "./constants.js"

const connectButton = document.getElementById("connectButton")
connectButton.onclick = connect

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" })
    } catch (error) {
      console.log(error)
    }
    connectButton.innerHTML = "Connected"
    const accounts = await ethereum.request({ method: "eth_accounts" })
    console.log(accounts)
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}

const getUserInfoButton = document.getElementById("getUserInfo");
getUserInfoButton.onclick = getUserInfo;

const userAddressInput = document.getElementById('user-address');
const userInfoElement = document.getElementById('user-info');

async function getUserInfo() {
    const userAddress = userAddressInput.value;
    console.log('getting info for', userAddress)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(contractAddress, abi, provider)
    const results = await contract.getUserAccountData(userAddress);

    console.log(results);

    const result = `total collateral base: ${ethers.utils.formatUnits (results['totalCollateralBase'], 8)}\n`
        + `total debt base: ${ethers.utils.formatUnits (results['totalDebtBase'], 8)}\n`
        + `available borrow base: ${ethers.utils.formatUnits (results['availableBorrowsBase'], 8)}\n`
        + `currentLiquidationThreshold: ${ethers.utils.formatUnits (results['currentLiquidationThreshold'], 0)}\n`
        + `ltv: ${ethers.utils.formatUnits (results['ltv'], 0)}\n`
        + `health factor: ${ethers.utils.formatEther(results.healthFactor)}`


    userInfoElement.textContent = result;
}

const liquidateButton = document.getElementById('liquidate');
liquidateButton.onclick = liquidate

const debtToCoverInput = document.getElementById('debtToCover');
const collateralAssetInput = document.getElementById('collateralAsset');
const debtAssetInput = document.getElementById('debtAsset');


async function liquidate() {

    const userAddress = userAddressInput.value;
    const debtToCover = ethers.utils.parseUnits(debtToCoverInput.value, 0);
    const collateralAsset = collateralAssetInput.value;
    const debtAsset = debtAssetInput.value;

    console.log('getting info for', userAddress)

    if (typeof window.ethereum !== "undefined") {
        
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner()

    const address = await signer.getAddress();
    console.log(address);

    const contract = new ethers.Contract(contractAddress, abi, signer)
    const debtContract = new ethers.Contract(debtAsset, erc20Abi, signer);

    try {
        console.log('params', userAddress, ethers.utils.formatUnits(debtToCover, 0), collateralAsset, debtAsset);

        const balance = await debtContract.balanceOf(address);
        console.log(ethers.utils.formatUnits(balance, 0));

        const transactionResponse = await contract.liquidateUser(userAddress, debtToCover, collateralAsset, debtAsset);
        
        console.log('listening');
        
        await listenForTransactionMine(transactionResponse, provider)
        // await transactionResponse.wait(1)
      } catch (error) {
        console.log(error)
      }
      } else {
        withdrawButton.innerHTML = "Please install MetaMask"
      }
}

//0x21E53AF80B2b06F672BE5A4AC99900dCA079C80e

// collateral 0x26833eec144ef2d7b2394cafbd5cd5ceb1d3b3afs
// debt 0x017919985ae96abd773864006bc1bd802cdf741b

