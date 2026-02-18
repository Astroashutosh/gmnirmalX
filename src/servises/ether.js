import { ethers } from "ethers";
import mainABI from "../contracts/abi";

export const connectWallet = async () => {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
};

export const getMainContract = (signer, contractAddress) => {
  return new ethers.Contract(contractAddress, mainABI, signer);
};
