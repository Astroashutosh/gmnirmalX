import { ethers } from "ethers";
import { setWallet } from "../redux/slice/walletSlice";

export const connectWallet = async (dispatch, requiredChainId) => {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const network = await provider.getNetwork();

  // Auto switch network
  if (Number(network.chainId) !== requiredChainId) {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }], // 56 in hex
    });
  }

  const signer = await provider.getSigner();
  // const address = await signer.getAddress();
      let address = "0x2c50670e45Fd9C6347630c733BF1B3d76cdFCd1d";

  dispatch(
    setWallet({
      address,
      chainId: requiredChainId,
    })
  );

  return address;
};
