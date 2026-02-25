// import { ethers } from "ethers";
// import {
//   MAIN_ABI,
//   TOKEN_ABI,
//   USDT_ABI,
//   LOCK_ABI
// } from "../contracts/abi";

// export const getProvider = () => {
//   if (!window.ethereum) throw new Error("MetaMask not installed");
//   return new ethers.BrowserProvider(window.ethereum);
// };

// export const getSigner = async () => {
//   const provider = getProvider();
//   return await provider.getSigner();
// };

// export const getMainContract = async (address) => {
//   const signer = await getSigner();
//   return new ethers.Contract(address, MAIN_ABI, signer);
// };

// export const getTokenContract = async (address) => {
//   const signer = await getSigner();
//   return new ethers.Contract(address, TOKEN_ABI, signer);
// };

// export const getUSDTContract = async (address) => {
//   const signer = await getSigner();
//   return new ethers.Contract(address, USDT_ABI, signer);
// };

// export const getLockContract = async (address) => {
//   const signer = await getSigner();
//   return new ethers.Contract(address, LOCK_ABI, signer);
// };









// import { ethers } from "ethers";

// import {
//  MAIN_ABI,
//  TOKEN_ABI,
//  USDT_ABI,
//  LOCK_ABI
// } from "../contracts/abi";

// let globalProvider=null;

// export const setGlobalProvider=(p)=>{

// globalProvider=p;

// };

// export const getProvider=()=>{

// if(globalProvider){

// return new ethers.BrowserProvider(
// globalProvider
// );

// }

// throw new Error("Wallet not connected");

// };

// export const getSigner=async()=>{

// const provider=
// getProvider();

// return await provider.getSigner();

// };

// export const getMainContract=async(address)=>{

// const signer=
// await getSigner();

// return new ethers.Contract(
// address,
// MAIN_ABI,
// signer
// );

// };

// export const getTokenContract=async(address)=>{

// const signer=
// await getSigner();

// return new ethers.Contract(
// address,
// TOKEN_ABI,
// signer
// );

// };

// export const getUSDTContract=async(address)=>{

// const signer=
// await getSigner();

// return new ethers.Contract(
// address,
// USDT_ABI,
// signer
// );

// };

// export const getLockContract=async(address)=>{

// const signer=
// await getSigner();

// return new ethers.Contract(
// address,
// LOCK_ABI,
// signer
// );

// };


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

/* GLOBAL PROVIDER */

let globalProvider = null;


/* SET PROVIDER */

export const setGlobalProvider = (provider)=>{

 globalProvider = provider;

};


/* GET PROVIDER */

export const getProvider = ()=>{

 /* Reown Provider */

 if(globalProvider){

  return new ethers.BrowserProvider(
   globalProvider
  );

 }

 /* Auto Restore */

 if(window.appKit){

  const provider =
  window.appKit.getWalletProvider();

  if(provider){

   globalProvider = provider;

   return new ethers.BrowserProvider(
    provider
   );

  }

 }

 /* Metamask fallback */

 if(window.ethereum){

  return new ethers.BrowserProvider(
   window.ethereum
  );

 }

 throw new Error("Wallet not connected");

};


/* SIGNER */

export const getSigner = async()=>{

 const provider =
 getProvider();

 return await provider.getSigner();

};


/* MAIN CONTRACT */

export const getMainContract = async(address)=>{

 const signer =
 await getSigner();

 return new ethers.Contract(
  address,
  MAIN_ABI,
  signer
 );

};


/* TOKEN */

export const getTokenContract = async(address)=>{

 const signer =
 await getSigner();

 return new ethers.Contract(
  address,
  TOKEN_ABI,
  signer
 );

};


/* USDT */

export const getUSDTContract = async(address)=>{

 const signer =
 await getSigner();

 return new ethers.Contract(
  address,
  USDT_ABI,
  signer
 );

};


/* LOCK */

export const getLockContract = async(address)=>{

 const signer =
 await getSigner();

 return new ethers.Contract(
  address,
  LOCK_ABI,
  signer
 );

};