import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { connectWallet } from "../utils/connectWallet";
import { getMainContract } from "../utils/contract";

function Register() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { address, isConnected, contracts, network } =
    useSelector((state) => state.wallet);

  const [refId, setRefId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  /* ================= AUTO FILL REFERRAL ================= */

  useEffect(() => {
    const refFromURL = searchParams.get("ref");

    if (refFromURL) {
      setRefId(refFromURL);
      setIsReadOnly(true);
    }
  }, [searchParams]);

  /* ================= REGISTER ================= */

  const handleRegister = async () => {
    try {
      if (!refId.trim())
        return toast.error("Sponsor ID required");

      setLoading(true);

      let userAddress = address;

      // Auto connect
      if (!isConnected) {
        userAddress = await connectWallet(
          dispatch,
          network.CHAIN_ID
        );
        if (!userAddress) {
          setLoading(false);
          return;
        }
      }

      const contract = await getMainContract(
        contracts.MAIN_CONTRACT
      );

      // Validate Sponsor
      const refAddress = await contract.referralCodeToAddress(refId);
      const refeAddress = await contract.referralCodeToAddress('NRX662248');

console.log(refeAddress);
      if (
        !refAddress ||
        refAddress ===
          "0x0000000000000000000000000000000000000000"
      ) {
        setLoading(false);
        return toast.error("Invalid Sponsor ID");
      }

      // Check Already Registered
      const exists =
        await contract.isUserExists(userAddress);

      if (exists) {
        setLoading(false);
        return toast.warning(
          "Account already registered"
        );
      }

      if (
        !window.confirm(
          `Register with Sponsor ID ${refId}?`
        )
      ) {
        setLoading(false);
        return;
      }

      const gas =
        await contract.registerUser.estimateGas(
          refAddress
        );

      const tx = await contract.registerUser(
        refAddress,
        { gasLimit: gas }
      );

      toast.info("Transaction sent...");

      await tx.wait();

      toast.success("Registration Successful ✅");

      setRefId("");
    } catch (error) {
      console.error(error);

      if (error.code === 4001) {
        toast.error("Transaction rejected");
      } else if (error.reason) {
        toast.error(error.reason);
      } else {
        toast.error("Transaction Failed");
      }
    }

    setLoading(false);
  };

  return (
    <section className="e ca ci di">
      <div className="a">
        <div className="ja qb _d">
          <div className="jc ng">
            <div
              className="wow fadeInUp la cd pe re gf kf mg yk gl vm"
              style={{
                fontFamily: "math",
                letterSpacing: "1px",
                background:
                  "linear-gradient(45deg, #103514, #1a3216)",
              }}
            >
              <h3 className="va fi mi pi yi vl gn">
                Create your account
              </h3>

              <div className="xa">
                <input
                  type="text"
                  placeholder="Enter Sponsor ID"
                  value={refId}
                  readOnly={isReadOnly}
                  onChange={(e) =>
                    setRefId(e.target.value)
                  }
                  style={{
                    borderRadius: "9px",
                    backgroundColor: isReadOnly
                      ? "#cccccc55"
                      : "#00800033",
                  }}
                  className="br cr jc oe re af if zg sg ii _i ej lj pk rk el ql"
                />
              </div>

              <div className="ta">
                <button
                  className="zq qb jc be de oe of rg jh ii qi zi rj sj tj jk"
                  style={{
                    borderRadius: "9px",
                    backgroundColor: "#d0ab56",
                  }}
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : "SUBMIT"}
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
  );
}

export default Register;

















// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { connectWallet } from "../utils/connectWallet";
// // import { getMainContract } from "../utils/ether";
// import { getMainContract } from "../utils/contract";

// function Register() {
//   const dispatch = useDispatch();

//   const { address, isConnected, contracts, network } =
//     useSelector((state) => state.wallet);

//   const [refId, setRefId] = useState("");
//   const [loading, setLoading] = useState(false);

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
// console.log(contract.target); // address

//       // Validate Sponsor
//       const refAddress = await contract.referralCodeToAddress(refId);
//       // const sponaddress = await contract.referralCodeToAddress('NRX123456789');

//        console.log(refId);
//       if (
//         !refAddress ||
//         refAddress ===
//           "0x0000000000000000000000000000000000000000"
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
//           `Register with Sponsor ID ${refId} and Sponsor Address ${refAddress}?`
//         )
//       ) {
//         setLoading(false);
//         return;
//       }

//       // Gas Estimate
//       const gas =
//         await contract.registerUser.estimateGas(
//           refAddress
//         );

//       const tx = await contract.registerUser(
//         refAddress,
//         {
//           gasLimit: gas,
//         }
//       );

//       toast.info("Transaction sent...");

//       await tx.wait();

//       toast.success("Registration Successful ✅");

//       setRefId("");
//     } catch (error) {
//       console.error(error);

//       if (error.code === 4001) {
//         toast.error("Transaction rejected");
//       } else if (
//         error.reason
//       ) {
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
//                   placeholder="Enter Sponcer ID"
//                   value={refId}
//                   onChange={(e) =>
//                     setRefId(e.target.value)
//                   }
//                   style={{
//                     borderRadius: "9px",
//                     backgroundColor: "#00800033",
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
