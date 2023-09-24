import { InfuraProvider } from "@ethersproject/providers";
import { ethers } from "ethers";

interface Props {
  chainId: string;
  providerUrl: string;
  privateKey?: string;
}

export const fetchTestnet = async ({
  chainId,
  providerUrl,
  privateKey,
}: Props): Promise<{ provider: InfuraProvider; address?: string }> => {
  const provider = new ethers.providers.InfuraProvider(chainId, providerUrl);

  if (privateKey) {
    const wallet = new ethers.Wallet(privateKey, provider);

    const address = await wallet.getAddress();

    return { provider, address };
  }

  return { provider };
};
