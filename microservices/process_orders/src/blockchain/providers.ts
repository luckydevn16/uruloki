import { ethers } from 'ethers';

const CHAINID = process.env.CHAINID;

const supportChainId = Number(CHAINID || 11155111);

export const RPCS = {
    1: "https://ethereum.blockpi.network/v1/rpc/public",
    5: "https://rpc.ankr.com/eth_goerli",
    11155111: 'https://rpc2.sepolia.org',
};

const providers: any = {
    1: new ethers.providers.JsonRpcProvider(RPCS[1]),
    5: new ethers.providers.JsonRpcProvider(RPCS[5]),
    11155111: new ethers.providers.JsonRpcProvider(RPCS[11155111]),
};

const networkNames = {
    1: "Ethereum",
    5: "Ethereum Goerli",
    11155111: "Ethereum Sepolia",
}

const network = networkNames[supportChainId]

const provider = providers[supportChainId];

export { supportChainId, provider, network };