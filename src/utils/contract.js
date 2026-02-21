import { ethers } from "ethers";
import {
  MAIN_ABI,
  TOKEN_ABI,
  USDT_ABI,
  LOCK_ABI
} from "../contracts/abi";

export const getProvider = () => {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

export const getMainContract = async (address) => {
  const signer = await getSigner();
  return new ethers.Contract(address, MAIN_ABI, signer);
};

export const getTokenContract = async (address) => {
  const signer = await getSigner();
  return new ethers.Contract(address, TOKEN_ABI, signer);
};

export const getUSDTContract = async (address) => {
  const signer = await getSigner();
  return new ethers.Contract(address, USDT_ABI, signer);
};

export const getLockContract = async (address) => {
  const signer = await getSigner();
  return new ethers.Contract(address, LOCK_ABI, signer);
};
