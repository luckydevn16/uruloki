import axios from 'axios';

// Cache object to store address data
const cache = new Map();

// Helper function to check if a cache entry is expired
function isCacheEntryExpired(timestamp: number): boolean {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  return now - timestamp > fiveMinutes;
}

export async function checkIfTokenIsErc20(address: string): Promise<boolean> {
  try {
    // Check if the address is already in the cache and if the cache entry is still valid
    if (cache.has(address) && !isCacheEntryExpired(cache.get(address).timestamp)) {
      // Return cached result
      return cache.get(address).isErc20;
    }

    // Fetch data from the API if not in cache or cache entry is expired
    const response = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`);
    const contractABI = JSON.parse(response.data.result);
    const erc20Functions = ['totalSupply', 'balanceOf', 'transfer', 'transferFrom', 'approve', 'allowance'];

    const isErc20 = erc20Functions.every((funcName) =>
      contractABI.some((func: any) => func.type === 'function' && func.name === funcName)
    );

    // Update the cache with the new result and current timestamp
    cache.set(address, { isErc20, timestamp: Date.now() });

    return isErc20;
  } catch (error) {
    console.error(`Error checking if token is ERC20: ${error}`);
    return false;
  }
}
