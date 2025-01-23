export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const WEB_API_BASE_URL = `${BASE_URL}/website/v1`;
export const V2_WEB_API_BASE_URL = `${BASE_URL}/website/v2`;
export const DOTSHM_ADDRESS = "0x560dde815414953Acc097d9d29c10B46644bce02";
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ChainsConfig = {
	ETH_SEPOLIA: {
		chainId: 11155111,
		chainName: "Ethereum Sepolia",
		nativeCurrency: { name: "sETH", symbol: "ETH", decimals: 18 },
		rpcUrls: ["https://eth-sepolia.public.blastapi.io"],
		blockExplorerUrls: ["https://sepolia.etherscan.io/"],
	},
	BASE: {
		chainId: 8453,
		chainName: "Base",
		nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
		rpcUrls: ["https://base-rpc.publicnode.com"],
		blockExplorerUrls: ["https://basescan.org/"],
	},
};

export const CHAIN = ChainsConfig.ETH_SEPOLIA;
