

// import { ethers } from "ethers";

// import {
//  MAIN_ABI,
//  TOKEN_ABI,
//  USDT_ABI,
//  LOCK_ABI
// } from "../contracts/abi";

// /* GLOBAL PROVIDER */

// let globalProvider = null;


// /* SET PROVIDER (Reown se aayega) */

// export const setGlobalProvider = (provider) => {

//  globalProvider = provider;

// };


// /* GET PROVIDER */

// export const getProvider = () => {

//  /* PRIORITY 1 - REOWN PROVIDER */

//  if(globalProvider){

//   return new ethers.BrowserProvider(
//    globalProvider
//   );

//  }


//  /* PRIORITY 2 - REOWN AUTO RECONNECT */

//  try{

//   const provider =
//   window.appKit?.getWalletProvider?.();

//   if(provider){

//    globalProvider = provider;

//    return new ethers.BrowserProvider(
//     provider
//    );

//   }

//  }catch(e){}


//  /* PRIORITY 3 - METAMASK */

//  if(window.ethereum){

//   return new ethers.BrowserProvider(
//    window.ethereum
//   );

//  }


//  throw new Error("Wallet not connected");

// };

// /* GET SIGNER */

// export const getSigner = async () => {

//  const provider =
//  getProvider();

//  return await provider.getSigner();

// };


// /* MAIN CONTRACT */

// export const getMainContract = async (address) => {

//  const signer =
//  await getSigner();

//  return new ethers.Contract(
//   address,
//   MAIN_ABI,
//   signer
//  );

// };


// /* TOKEN CONTRACT */

// export const getTokenContract = async (address) => {

//  const signer =
//  await getSigner();

//  return new ethers.Contract(
//   address,
//   TOKEN_ABI,
//   signer
//  );

// };


// /* USDT CONTRACT */

// export const getUSDTContract = async (address) => {

//  const signer =
//  await getSigner();

//  return new ethers.Contract(
//   address,
//   USDT_ABI,
//   signer
//  );

// };


// /* LOCK CONTRACT */

// export const getLockContract = async (address) => {

//  const signer =
//  await getSigner();

//  return new ethers.Contract(
//   address,
//   LOCK_ABI,
//   signer
//  );

// };






import { ethers } from "ethers";
import {
    MAIN_ABI,
    TOKEN_ABI,
    USDT_ABI,
    LOCK_ABI
} from "../contracts/abi";

/* ============================================
   CONFIG
============================================ */

// const BSC_RPC = "https://rpc.ankr.com/bsc";
const BSC_RPC = "https://bsc-dataseed.binance.org/";
let globalWalletProvider = null;

export const setGlobalProvider = (provider) => {
    globalWalletProvider = provider;
};

/* ============================================
   PROVIDERS
============================================ */

// 🔥 Direct RPC (for READ)
const readProvider = new ethers.JsonRpcProvider(BSC_RPC);

// 🔥 Wallet Provider (for WRITE)
const getWriteProvider = () => {
    if (!globalWalletProvider) {
        throw new Error("Wallet not connected");
    }
    return new ethers.BrowserProvider(globalWalletProvider);
};

const getSigner = async () => {
    const provider = getWriteProvider();
    return await provider.getSigner();
};

/* ============================================
   AUTO SMART CONTRACT WRAPPER
============================================ */

const createAutoContract = async (address, abi) => {
    const readContract = new ethers.Contract(
        address,
        abi,
        readProvider
    );

    const signer = globalWalletProvider
        ? await getSigner()
        : null;

    const writeContract = signer
        ? new ethers.Contract(address, abi, signer)
        : null;

    return new Proxy(readContract, {
        get(target, prop) {
            const fragment = target.interface.getFunction?.(prop);

            if (!fragment) {
                return target[prop];
            }

            // 🔥 If function is view/pure → READ
            if (
                fragment.stateMutability === "view" ||
                fragment.stateMutability === "pure"
            ) {
                return target[prop];
            }

            // 🔥 Otherwise → WRITE
            if (!writeContract) {
                throw new Error("Wallet not connected");
            }

            return writeContract[prop];
        }
    });
};

/* ============================================
   EXPORT CONTRACTS (NO PROJECT CHANGE NEEDED)
============================================ */

export const getMainContract = async (address) =>
    createAutoContract(address, MAIN_ABI);

export const getTokenContract = async (address) =>
    createAutoContract(address, TOKEN_ABI);

export const getUSDTContract = async (address) =>
    createAutoContract(address, USDT_ABI);

export const getLockContract = async (address) =>
    createAutoContract(address, LOCK_ABI);