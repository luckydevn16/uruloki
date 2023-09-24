import Web3Modal from "web3modal";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
export const getWeb3Modal = async () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: '053b5c8b416b4e73b29954bbbd30bac9'
        }
      }
    };

    const web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
    });
  
    return web3Modal;
  };

  export const getConnectedAddress = async () => {
    // Get wallet address connected
    try {
      if (typeof window !== 'undefined') {
        const accounts = window.ethereum?._state?.accounts
        // const {isConnected, address} = useAccount();
        // console.log('-----------------------------------', isConnected, address);
        if(accounts && accounts.length>0){
          return accounts[0];
        } else {
          console.log("Error getting users wallet")
          console.log(accounts)
          return '';
        }
      }
      return "";
    } catch(err) {
      return ''
    }
  };

