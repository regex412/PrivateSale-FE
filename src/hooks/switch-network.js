// eslint-disable-next-line import/prefer-default-export
export const switchNetwork = async () => {
  const provider = window.ethereum;
  const binanceTestChainId = "0x61";

  if (!provider) {
    // eslint-disable-next-line no-console
    console.log("Metamask is not installed, please install!");
  } else {
    const chainId = await provider.request({ method: "eth_chainId" });

    if (chainId === binanceTestChainId) {
      // eslint-disable-next-line no-console
      console.log("Bravo!, you are on the correct network");
    } else {
      // eslint-disable-next-line no-console
      console.log("oulalal, switch to the correct network");
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: binanceTestChainId }],
        });
        // eslint-disable-next-line no-console
        console.log("You have succefully switched to Binance Test network");
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          // eslint-disable-next-line no-console
          console.log("This network is not available in your metamask, please add it");
          try {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x61",
                  chainName: "Smart Chain - Testnet",
                  rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
                  blockExplorerUrls: ["https://testnet.bscscan.com"],
                  nativeCurrency: {
                    symbol: "BNB", // 2-6 characters long
                    decimals: 18,
                  },
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
            // eslint-disable-next-line no-console
            console.log(addError);
          }
        }
      }
    }
  }
};
