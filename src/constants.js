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

export const Contracts = {
	BASE_WETH: "0x4200000000000000000000000000000000000006",
	BASE_USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
	BASE_UNISWAP_V2_ROUTER: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    
	AERODROME_ROUTER: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
	AERODROME_DEFAULT_FACTORY: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
};

export const CHAIN = ChainsConfig.BASE;
