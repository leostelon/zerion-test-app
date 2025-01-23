import "./App.css";
import { useEffect } from "react";
import {
	connectWalletToSite,
	getWalletAddress,
	switchChain,
} from "./utils/wallet";
import Execute from "./contracts/Execute.json";
import ERC20Contract from "./contracts/ERC20.json";
import AerodromeContract from "./contracts/Aerodrome.json";
import UniswapV2RouterContract from "./contracts/UniswapV2Router.json";
import { Contracts } from "./constants";
import Web3 from "web3";

function App() {
	async function init() {
		try {
			await connectWalletToSite();
			await switchChain();
			const addressList = await getWalletAddress();
			const walletAddress = addressList[0];
			const contractAddress = "0x9762E24d6DCb97075180cdB18e9064e836E562Ee";

			const contract = new window.web3.eth.Contract(
				Execute.abi,
				contractAddress
			);

			const transaction = await contract.methods
				.execute()
				.send({ from: walletAddress })
				.on("receipt", function (receipt) {
					console.log(receipt);
				});
			console.log(transaction);
		} catch (error) {
			console.log(error);
		}
	}

	// Add Liquidity
	async function addLiquidityETH() {
		try {
			await connectWalletToSite();
			await switchChain();
			const addressList = await getWalletAddress();
			const publicKey = addressList[0];

			// Get USDC balance
			const USDCContract = new window.web3.eth.Contract(
				ERC20Contract.abi,
				Contracts.BASE_USDC
			);
			// const balance = await USDCContract.methods.balanceOf(publicKey).call();
			const balance = 1000;
			console.log(balance);

			const pricePerEth = await getPricePerWeth();
			const finalDepositEth = Web3.utils.fromWei(balance, "mwei") / pricePerEth;
			const finalDepositEthInWei = Web3.utils.toWei(finalDepositEth, "ether");
			console.log("Total Deposit Value:" + finalDepositEth);

			const aerodromeContract = new window.web3.eth.Contract(
				AerodromeContract.abi,
				Contracts.AERODROME_ROUTER
			);
			// const amountTokenDesired = Web3.utils.toWei("0.02538", "mwei");
			const amountTokenMin = Web3.utils.toWei("0", "mwei");
			const deadline = Math.floor(Date.now() / 1000) + 600;
			const data = aerodromeContract.methods
				.addLiquidityETH(
					Contracts.BASE_USDC,
					false,
					balance,
					amountTokenMin,
					"0",
					publicKey,
					deadline
				)
				.encodeABI();
			console.log(`>>> Started Aerodrome Provide Liquidity Transaction <<<`);

			// Gas calculation
			const gasPrice = await window.web3.eth.getGasPrice();
			const gas = await window.web3.eth.estimateGas({
				to: Contracts.AERODROME_ROUTER,
				from: publicKey,
				data,
				value: finalDepositEthInWei,
			});
			console.log(gas);

			const addLiquidityTxObj = {
				to: Contracts.AERODROME_ROUTER,
				from: publicKey,
				data,
				gas,
				gasPrice,
				value: finalDepositEthInWei,
			};
			const response = await window.web3.eth.sendTransaction(addLiquidityTxObj);
			console.log(response);

			// const tx = new Transaction(
			// 	publicKey,
			// 	Contracts.AERODROME_ROUTER,
			// 	data,
			// 	finalDepositEthInWei,
			// 	"Aerodrome Provide Liquidity Transaction"
			// );

			// const txResponse = await tx.sendSignedTransaction();
			// return txResponse;
		} catch (error) {
			console.log(error);
		}
	}

	// Swap Tokens
	async function convertERC20ToEth(smartAccountAddress) {
		try {
			await connectWalletToSite();
			await switchChain();
			const addressList = await getWalletAddress();
			const PUBLIC_KEY = addressList[0];

			let txList = [];
			const uniswapV2Router = new window.web3.eth.Contract(
				UniswapV2RouterContract.abi,
				Contracts.BASE_UNISWAP_V2_ROUTER
			);
			const path = [Contracts.BASE_USDC, Contracts.BASE_WETH];
			var deadline = Math.floor(Date.now() / 1000) + 1200;
			const usdcContract = new window.web3.eth.Contract(
				ERC20Contract.abi,
				Contracts.BASE_USDC
			);
			const balance = await usdcContract.methods.balanceOf(PUBLIC_KEY).call();
			console.log(balance);
			// Approve Router
			const approveData = usdcContract.methods
				.approve(Contracts.BASE_UNISWAP_V2_ROUTER, balance)
				.encodeABI({ from: PUBLIC_KEY, to: Contracts.BASE_USDC });

			const gasPrice = await window.web3.eth.getGasPrice();
			// const gas = await window.web3.eth.estimateGas({
			// 	to: Contracts.BASE_USDC,
			// 	from: PUBLIC_KEY,
			// 	data: approveData,
			// });
			// const approveTxObj = {
			// 	to: Contracts.BASE_USDC,
			// 	data: approveData,
			// 	from: PUBLIC_KEY,
			// 	gas,
			// 	gasPrice,
			// };

			// const response = await window.web3.eth.sendTransaction(approveTxObj);
			const swapData = uniswapV2Router.methods
				.swapExactTokensForETHSupportingFeeOnTransferTokens(
					balance,
					"0",
					path,
					PUBLIC_KEY,
					deadline
				)
				.call({
					from: smartAccountAddress,
					to: Contracts.BASE_UNISWAP_V2_ROUTER,
				});
			// const gas = await window.web3.eth.estimateGas({
			// 	to: Contracts.BASE_UNISWAP_V2_ROUTER,
			// 	from: PUBLIC_KEY,
			// 	data: swapData,
			// });
			// const swapTxObj = {
			// 	to: Contracts.BASE_UNISWAP_V2_ROUTER,
			// 	from: PUBLIC_KEY,
			// 	data: swapData,
			// 	gas,
			// 	gasPrice,
			// };
		} catch (error) {
			console.log("ConvertERC20ToEth", error);
		}
	}

	// Get price per wETH
	async function getPricePerWeth() {
		try {
			const aerodromeContract = new window.web3.eth.Contract(
				AerodromeContract.abi,
				Contracts.AERODROME_ROUTER
			);
			const data = await aerodromeContract.methods
				.getReserves(
					Contracts.BASE_USDC,
					Contracts.BASE_WETH,
					false,
					Contracts.AERODROME_DEFAULT_FACTORY
				)
				.call();
			const reserveA = Web3.utils.fromWei(data.reserveA, "mwei");
			const reserveB = Web3.utils.fromWei(data.reserveB, "ether");
			const pricePerEth = Number(reserveA / reserveB);

			// console.log("Price per wETH: " + pricePerEth);
			return pricePerEth;
		} catch (error) {
			console.log("Approve: " + error);
		}
	}

  // Approve USDC


	useEffect(() => {
		// init();
		addLiquidityETH();
	}, []);

	return (
		<div className="App">
			<p>working</p>
			<button onClick={addLiquidityETH}>Transact</button>
		</div>
	);
}

export default App;
