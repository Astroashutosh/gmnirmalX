import { ethers } from "ethers";
import { setWallet } from "../redux/slice/walletSlice";

export const autoReconnect = async (
  dispatch,
  requiredChainId
) => {
  try {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(
      window.ethereum
    );

    const accounts =
      await provider.send("eth_accounts", []);

    if (!accounts || accounts.length === 0)
      return;

    const network =
      await provider.getNetwork();

    if (
      Number(network.chainId) !== requiredChainId
    )
      return;

    dispatch(
      setWallet({
        // address: accounts[0],
        address: '0x2c50670e45Fd9C6347630c733BF1B3d76cdFCd1d',

        chainId: Number(network.chainId),
      })
    );
  } catch (error) {
    console.log("Auto reconnect failed");
  }
};
