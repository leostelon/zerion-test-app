import "./App.css";
import { useEffect } from "react";
import { connectWalletToSite, getWalletAddress } from "./utils/wallet";

function App() {
	async function init() {
		try {
			await connectWalletToSite();
			const address = await getWalletAddress();
			console.log(address);
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		init();
	}, []);

	return (
		<div className="App">
			<p>working</p>
		</div>
	);
}

export default App;
