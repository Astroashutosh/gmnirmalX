
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