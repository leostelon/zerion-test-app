import "./App.css";
import {
	connectWalletToSite,
	getWalletAddress,
	switchChain,
} from "./utils/wallet";
import Execute from "./contracts/Execute.json";

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

	return (
		<div className="App">
			<p>working</p>
			<button onClick={init}>Transact</button>
		</div>
	);
}

export default App;
