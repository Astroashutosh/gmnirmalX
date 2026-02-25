// import { ethers } from "ethers";
// import { setWallet } from "../redux/slice/walletSlice";

// export const connectWallet = async (dispatch, requiredChainId) => {
//   if (!window.ethereum) {
//     alert("Install MetaMask");
//     return null;
//   }

//   const provider = new ethers.BrowserProvider(window.ethereum);

//   await window.ethereum.request({
//     method: "eth_requestAccounts",
//   });

//   const network = await provider.getNetwork();

//   // Auto switch network
//   if (Number(network.chainId) !== requiredChainId) {
//     await window.ethereum.request({
//       method: "wallet_switchEthereumChain",
//       params: [{ chainId: "0x38" }], // 56 in hex
//     });
//   }

//   const signer = await provider.getSigner();
//   const address = await signer.getAddress();
//       // let address = "0x2c50670e45Fd9C6347630c733BF1B3d76cdFCd1d";

//   dispatch(
//     setWallet({
//       address,
//       chainId: requiredChainId,
//     })
//   );

//   return address;
// };










// import { setWallet } from "../redux/slice/walletSlice";
// import { appKit } from "./reownWallet";
// import { ethers } from "ethers";
// import { setGlobalProvider } from "./contract";

// export const connectWallet = async (
//  dispatch,
//  requiredChainId
// )=>{

// try{

// /* OPEN WALLET MODAL */

// await appKit.open();

// /* ACCOUNT */

// const account=
// appKit.getAccount();

// if(!account?.address)
// return;

// /* PROVIDER */

// const provider=
// appKit.getProvider();

// setGlobalProvider(provider);

// /* NETWORK */

// const ethersProvider=
// new ethers.BrowserProvider(provider);

// const network=
// await ethersProvider.getNetwork();


// dispatch(

// setWallet({

//  address:account.address,

//  chainId:Number(network.chainId)

// })

// );

// return account.address;

// }catch(err){

// console.log(err);

// }

// };




// import { setWallet } from "../redux/slice/walletSlice";
// import { appKit } from "./reownWallet";
// import { ethers } from "ethers";
// import { setGlobalProvider } from "./contract";

// export const connectWallet = async (
//  dispatch,
//  requiredChainId
// )=>{

// try{

// /* OPEN WALLET MODAL */

// await appKit.open();

// /* GET ACCOUNT */

// const account =
// appKit.getAccount();

// if(!account?.address)
// return null;


// /* PROVIDER */

// const provider =
// appKit.getProvider();

// setGlobalProvider(provider);


// /* NETWORK CHECK */

// const ethersProvider =
// new ethers.BrowserProvider(provider);

// const network =
// await ethersProvider.getNetwork();


// if(Number(network.chainId) !== requiredChainId){

//  alert("Please switch to BSC Network");

//  return null;

// }


// /* SAVE REDUX */

// dispatch(

// setWallet({

//  address:account.address,
//  chainId:Number(network.chainId)

// })

// );

// return account.address;

// }catch(err){

// console.log(err);

// return null;

// }

// };
import { setWallet } from "../redux/slice/walletSlice";
import { appKit } from "./reownWallet";
import { ethers } from "ethers";
import { setGlobalProvider } from "./contract";

export const connectWallet = async (
 dispatch,
 requiredChainId
) => {

try{

/* OPEN WALLET MODAL */

await appKit.open();

/* WAIT UNTIL CONNECTED */

let account=null;

for(let i=0;i<20;i++){

 account=appKit.getAccount();

 if(account?.address)
 break;

 await new Promise(r=>setTimeout(r,400));

}

if(!account?.address){

console.log("Wallet not connected");

return null;

}


/* GET PROVIDER (IMPORTANT FIX) */

const provider =
appKit.getWalletProvider();


if(!provider){

console.log("Provider not found");

return null;

}


/* SAVE PROVIDER */

setGlobalProvider(provider);


/* ETHERS */

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


return account.address;

}catch(err){

console.log(err);

return null;

}

};