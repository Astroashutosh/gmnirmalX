

// export const autoReconnect = async (dispatch, requiredChainId) => {
//   try {
//     if (!window.ethereum) return;

//     const provider = new ethers.BrowserProvider(window.ethereum);

//     const accounts = await provider.send("eth_accounts", []);

//     if (!accounts.length) return;

//     const network = await provider.getNetwork();

//     if (Number(network.chainId) !== requiredChainId) return;

//     const userId = localStorage.getItem("userId");

//     dispatch(
//       setWallet({
//         address: accounts[0],
//         chainId: Number(network.chainId),
//         userId: userId,
//       })
//     );

//   } catch (error) {
//     console.log("Auto reconnect failed");
//   }
// };







// import { setWallet } from "../redux/slice/walletSlice";
// import { appKit } from "./reownWallet";
// import { ethers } from "ethers";
// import { setGlobalProvider } from "./contract";

// export const autoReconnect = async (
//  dispatch,
//  requiredChainId
// )=>{

// try{

// const account=
// appKit.getAccount();

// if(!account?.address)
// return;

// const provider=
// appKit.getProvider();

// setGlobalProvider(provider);

// const ethersProvider=
// new ethers.BrowserProvider(provider);

// const network=
// await ethersProvider.getNetwork();

// if(Number(network.chainId)!==
// requiredChainId)
// return;

// dispatch(

// setWallet({

//  address:account.address,

//  chainId:Number(network.chainId)

// })

// );

// }catch(err){

// console.log("Auto reconnect failed");

// }

// };



import { setWallet } from "../redux/slice/walletSlice";
import { appKit } from "./reownWallet";
import { ethers } from "ethers";
import { setGlobalProvider } from "./contract";

export const autoReconnect = async (
 dispatch,
 requiredChainId
)=>{

try{

 const account =
 appKit.getAccount();

 if(!account?.address)
 return;

 const provider =
 appKit.getWalletProvider();

 if(!provider)
 return;

/* IMPORTANT */

 setGlobalProvider(provider);

 const ethersProvider =
 new ethers.BrowserProvider(provider);

 const network =
 await ethersProvider.getNetwork();

 dispatch(

  setWallet({

   address:account.address,
   chainId:Number(network.chainId)

  })

 );

}catch(err){

 console.log(
 "Auto reconnect failed"
 );

}

};