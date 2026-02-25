// import React, { useState, useEffect } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { connectWallet } from "../utils/connectWallet";
// import { getMainContract } from "../utils/contract";

// function Register() {
//   const dispatch = useDispatch();
//   const [searchParams] = useSearchParams();

//   const { address, isConnected, contracts, network } =
//     useSelector((state) => state.wallet);

//   const [refId, setRefId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isReadOnly, setIsReadOnly] = useState(false);

//   /* ================= AUTO FILL REFERRAL ================= */

//   useEffect(() => {
//     const refFromURL = searchParams.get("ref");

//     if (refFromURL) {
//       setRefId(refFromURL);
//       setIsReadOnly(true);
//     }
//   }, [searchParams]);

//   /* ================= REGISTER ================= */

//   const handleRegister = async () => {
//     try {
//       if (!refId.trim())
//         return toast.error("Sponsor ID required");

//       setLoading(true);

//       let userAddress = address;

//       // Auto connect
//       if (!isConnected) {
//         userAddress = await connectWallet(
//           dispatch,
//           network.CHAIN_ID
//         );
//         if (!userAddress) {
//           setLoading(false);
//           return;
//         }
//       }

//       const contract = await getMainContract(
//         contracts.MAIN_CONTRACT
//       );

//       // Validate Sponsor
//       const refAddress = await contract.referralCodeToAddress(refId);

//       if (
//         !refAddress ||
//         refAddress ===
//         "0x0000000000000000000000000000000000000000"
//       ) {
//         setLoading(false);
//         return toast.error("Invalid Sponsor ID");
//       }

//       // Check Already Registered
//       const exists =
//         await contract.isUserExists(userAddress);

//       if (exists) {
//         setLoading(false);
//         return toast.warning(
//           "Account already registered"
//         );
//       }

//       if (
//         !window.confirm(
//           `Register with Sponsor ID ${refId} and Sponsor Address is ${refAddress}?`
//         )
//       ) {
//         setLoading(false);
//         return;
//       }

//       const gas =
//         await contract.registerUser.estimateGas(
//           refAddress
//         );

//       const tx = await contract.registerUser(
//         refAddress,
//         { gasLimit: gas }
//       );

//       toast.info("Transaction sent...");

//       await tx.wait();

//       toast.success("Registration Successful ✅");

//       setRefId("");
//     } catch (error) {
//       console.error(error);

//       if (error.code === 4001) {
//         toast.error("Transaction rejected");
//       } else if (error.reason) {
//         toast.error(error.reason);
//       } else {
//         toast.error("Transaction Failed");
//       }
//     }

//     setLoading(false);
//   };

//   return (
//     <section className="e ca ci di">
//       <div className="a">
//         <div className="ja qb _d">
//           <div className="jc ng">
//             <div
//               className="wow fadeInUp la cd pe re gf kf mg yk gl vm"
//               style={{
//                 fontFamily: "math",
//                 letterSpacing: "1px",
//                 background:
//                   "linear-gradient(45deg, #103514, #1a3216)",
//               }}
//             >
//               <h3 className="va fi mi pi yi vl gn">
//                 Create your account
//               </h3>

//               <div className="xa">
//                 <input
//                   type="text"
//                   placeholder="Enter Sponsor ID"
//                   value={refId}
//                   readOnly={isReadOnly}
//                   onChange={(e) =>
//                     setRefId(e.target.value)
//                   }
//                   style={{
//                     borderRadius: "9px",
//                     backgroundColor: isReadOnly
//                       ? "#cccccc55"
//                       : "#00800033",
//                   }}
//                   className="br cr jc oe re af if zg sg ii _i ej lj pk rk el ql"
//                 />
//               </div>

//               <div className="ta">
//                 <button
//                   className="zq qb jc be de oe of rg jh ii qi zi rj sj tj jk"
//                   style={{
//                     borderRadius: "9px",
//                     backgroundColor: "#d0ab56",
//                   }}
//                   onClick={handleRegister}
//                   disabled={loading}
//                 >
//                   {loading
//                     ? "Processing..."
//                     : "SUBMIT"}
//                 </button>
//               </div>

//               <p className="fi ii qi xi ul">
//                 Already Member?
//                 <Link to="/login" className="bj mk">
//                   Login Here
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Register;
















// import React, { useState, useEffect } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { ethers } from "ethers";
// import { connectWallet } from "../utils/connectWallet";
// import { getMainContract } from "../utils/contract";

// function Register() {
//   const dispatch = useDispatch();
//   const [searchParams] = useSearchParams();

//   const { address, isConnected, contracts, network } =
//     useSelector((state) => state.wallet);

//   const [refId, setRefId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isReadOnly, setIsReadOnly] = useState(false);

//   /* ================= AUTO REF FROM URL ================= */

//   useEffect(() => {
//     const refFromURL = searchParams.get("ref");
//     if (refFromURL) {
//       setRefId(refFromURL);
//       setIsReadOnly(true);
//     }
//   }, [searchParams]);

//   /* ================= SAFE ERROR PARSER ================= */

//   const parseError = (error) => {
//     console.error("Blockchain Error:", error);

//     if (error?.code === 4001)
//       return "Transaction rejected by user";

//     if (error?.reason)
//       return error.reason;

//     if (error?.shortMessage)
//       return error.shortMessage;

//     if (error?.info?.error?.message)
//       return error.info.error.message;

//     return "Transaction failed from blockchain";
//   };

//   /* ================= REGISTER FUNCTION ================= */

//   const handleRegister = async () => {
//     try {
//       // if (!window.ethereum)
//       //   return toast.error("Please install MetaMask");

//       if (!refId.trim())
//         return toast.error("Referral Id cannot be blank");

//       setLoading(true);

//       let userAddress = address;

//       /* ===== AUTO CONNECT WALLET ===== */

//       if (!isConnected) {
//         userAddress = await connectWallet(
//           dispatch,
//           network?.CHAIN_ID
//         );
//         if (!userAddress) {
//           setLoading(false);
//           return;
//         }
//       }

//       const contract = await getMainContract(
//         contracts?.MAIN_CONTRACT
//       );

//       /* ===== VALIDATE SPONSOR ===== */

//       const referAddress =
//         await contract.referralCodeToAddress(refId);
// console.log("Refer Address:", referAddress);
//       if (
//         !referAddress ||
//         referAddress === ethers.ZeroAddress
//       ) {
//         setLoading(false);
//         return toast.error(
//           "Invalid sponsor id or sponsor does not exist"
//         );
//       }

//       /* ===== SELF REFERRAL BLOCK ===== */

//       if (
//         referAddress.toLowerCase() ===
//         userAddress.toLowerCase()
//       ) {
//         setLoading(false);
//         return toast.error(
//           "You cannot register with your own referral ID"
//         );
//       }

//       /* ===== CHECK USER EXISTS ===== */

//       const exists =
//         await contract.isUserExists(userAddress);
// console.log("User Exists:", exists);
//       if (exists) {
//         setLoading(false);
//         return toast.warning(
//           "Account already registered"
//         );
//       }

//       /* ===== CONFIRMATION ===== */

//       const confirmText =
//         `You are registering with Sponsor ID ${refId}\n\n` +
//         `Sponsor Address: ${referAddress}\n\n` +
//         `Press OK to continue`;

//       if (!window.confirm(confirmText)) {
//         setLoading(false);
//         return;
//       }

//       /* ===== GAS ESTIMATION (SAFE) ===== */

//       // const gasEstimate =
//       //   await contract.registerUser.estimateGas(
//       //     referAddress
//       //   );

//       // const tx = await contract.registerUser(
//       //   referAddress,
//       //   {
//       //     gasLimit: gasEstimate,
//       //   }
//       // );


// const tx = await contract.registerUser(
//  referAddress,
//  {
//   gasLimit: 300000
//  }
// );


//       toast.info("Transaction sent...");

//       await tx.wait();

//       toast.success("Registration successful ✅");

//       setRefId("");

//       setTimeout(() => {
//         window.location.href = "/login";
//       }, 2000);

//     } catch (error) {
//       toast.error(parseError(error));
//     }

//     setLoading(false);
//   };

//   /* ================= UI ================= */

//   return (
//     <>
//       {loading && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: "rgba(0,0,0,0.75)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 9999,
//             color: "#fff",
//             fontSize: "20px",
//             fontWeight: "bold",
//           }}
//         >
//           Please Wait...
//         </div>
//       )}

//       <section className="e ca ci di">
//         <div className="a">
//           <div className="ja qb _d">
//             <div className="jc ng">
//               <div
//                 className="la cd pe re gf kf mg yk gl vm"
//                 style={{
//                   fontFamily: "math",
//                   letterSpacing: "1px",
//                   background:
//                     "linear-gradient(45deg, #103514, #1a3216)",
//                 }}
//               >
//                 <h3 className="va fi mi pi yi vl gn">
//                   Create your account
//                 </h3>

//                 <div className="xa">
//                   <input
//                     type="text"
//                     placeholder="Enter Sponsor ID"
//                     value={refId}
//                     readOnly={isReadOnly}
//                     onChange={(e) =>
//                       setRefId(e.target.value)
//                     }
//                     style={{
//                       borderRadius: "9px",
//                       backgroundColor: isReadOnly
//                         ? "#cccccc55"
//                         : "#00800033",
//                     }}
//                     className="br cr jc oe re af if zg sg ii _i ej lj pk rk el ql"
//                   />
//                 </div>

//                 <div className="ta">
//                   <button
//                     className="zq qb jc be de oe of rg jh ii qi zi rj sj tj jk"
//                     style={{
//                       borderRadius: "9px",
//                       backgroundColor: "#d0ab56",
//                     }}
//                     onClick={handleRegister}
//                     disabled={loading}
//                   >
//                     {loading
//                       ? "Processing..."
//                       : "SUBMIT"}
//                   </button>
//                 </div>

//                 <p className="fi ii qi xi ul">
//                   Already Member?
//                   <Link to="/login" className="bj mk">
//                     Login Here
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// export default Register;




import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { connectWallet } from "../utils/connectWallet";
import { getMainContract } from "../utils/contract";
import { useNavigate } from "react-router-dom";
function Register() {

 const dispatch = useDispatch();
 const [searchParams] = useSearchParams();
const navigate = useNavigate();
 const { address, isConnected, contracts, network } =
  useSelector((state) => state.wallet);

 const [refId,setRefId]=useState("");
 const [loading,setLoading]=useState(false);
 const [isReadOnly,setIsReadOnly]=useState(false);


 /* AUTO REF */

 useEffect(()=>{

  const refFromURL =
  searchParams.get("ref");

  if(refFromURL){

   setRefId(refFromURL);
   setIsReadOnly(true);

  }

 },[searchParams]);



 /* ERROR PARSER */

 const parseError=(error)=>{

  console.log("Blockchain Error:",error);

  if(error?.code===4001)
   return "Transaction rejected";

  if(error?.reason)
   return error.reason;

  if(error?.shortMessage)
   return error.shortMessage;

  if(error?.info?.error?.message)
   return error.info.error.message;

  return "Transaction Failed";

 };



 /* REGISTER */

 const handleRegister = async ()=>{

 try{

 if(!refId.trim())
 return toast.error("Enter Sponsor ID");

 setLoading(true);


 let userAddress=address;


 /* CONNECT WALLET */

 if(!isConnected){

 userAddress =
 await connectWallet(
 dispatch,
 network.CHAIN_ID
 );

 if(!userAddress){

 setLoading(false);
 return;

 }

 }


 /* CONTRACT */

 const contract =
 await getMainContract(
 contracts.MAIN_CONTRACT
 );


 /* SPONSOR CHECK */

 const referAddress =
 await contract.referralCodeToAddress(refId);


 console.log("Refer Address:",referAddress);


 if(
 !referAddress ||
 referAddress===ethers.ZeroAddress
 ){

 setLoading(false);

 return toast.error(
 "Invalid Sponsor ID"
 );

 }


 /* SELF REF */

 if(
 referAddress.toLowerCase()===
 userAddress.toLowerCase()
 ){

 setLoading(false);

 return toast.error(
 "Self referral not allowed"
 );

 }


 /* USER EXISTS */

 const exists =
 await contract.isUserExists(
 userAddress
 );


 console.log("User Exists:",exists);


 if(exists){

 setLoading(false);

 return toast.warning(
 "Already Registered"
 );

 }


 /* STATIC TEST (IMPORTANT) */

 console.log("Testing register...");


 await contract.registerUser.staticCall(
 referAddress
 );


 console.log("Register Possible");


 /* REAL TX */

//  const tx =
//  await contract.registerUser(
//  referAddress,
//  {
//  gasLimit:300000
//  }
//  );
const tx =
 await contract.registerUser(
 referAddress,
 {
 gasLimit:600000,
 maxPriorityFeePerGas: ethers.parseUnits("2","gwei"),
 maxFeePerGas: ethers.parseUnits("5","gwei")
 }
 );

 toast.info(
 "Transaction sent..."
 );


 await tx.wait(1);


 toast.success(
 "Registration Successful ✅"
 );


 setTimeout(()=>{

 navigate("/login");

 },2000);


 }catch(error){

 console.log(error);

 toast.error(
 parseError(error)
 );

 }


 setLoading(false);

 };



 return(

<>

{loading &&(

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.7)",
display:"flex",
alignItems:"center",
justifyContent:"center",
color:"#fff",
fontSize:"20px",
zIndex:9999
}}>

Please Wait...

</div>

)}


<section className="e ca ci di">

<div className="a">

<div className="ja qb _d">

<div className="jc ng">

<div
className="la cd pe re gf kf mg yk gl vm"
style={{
fontFamily:"math",
letterSpacing:"1px",
background:
"linear-gradient(45deg,#103514,#1a3216)"
}}>

<h3 className="va fi mi pi yi vl gn">

Create your account

</h3>


<div className="xa">

<input
type="text"
placeholder="Enter Sponsor ID"
value={refId}
readOnly={isReadOnly}
onChange={(e)=>
setRefId(e.target.value)
}
style={{
borderRadius:"9px",
backgroundColor:
isReadOnly
?"#cccccc55"
:"#00800033"
}}
className="br cr jc oe re af if zg sg ii _i ej lj pk rk el ql"
/>

</div>


<div className="ta">

<button
className="zq qb jc be de oe of rg jh ii qi zi rj sj tj jk"
style={{
borderRadius:"9px",
backgroundColor:"#d0ab56"
}}
onClick={handleRegister}
disabled={loading}
>

{loading?
"Processing..."
:"SUBMIT"}

</button>

</div>


<p className="fi ii qi xi ul">

Already Member?

<Link to="/login" className="bj mk">

Login Here

</Link>

</p>


</div>

</div>

</div>

</div>

</section>

</>

);

}

export default Register;