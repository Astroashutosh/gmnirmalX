
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { ethers } from "ethers";
// import { toast } from "react-toastify";
// import logo from '/images/logo.png';

// import {
//   getMainContract,
//   getUSDTContract
// } from "../utils/contract";

// function Cards({totalWithdraw }) {

//   const { address, contracts } = useSelector((state) => state.wallet);

//   const [stakeAmount, setStakeAmount] = useState("");
//   const [withdrawAmount, setWithdrawAmount] = useState("");
//   const [nrxPrice, setNrxPrice] = useState(1);
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     if(address){
//       loadData();
//     }
//   }, [address]);

//   /* ================= LOAD DATA (Same PHP getAccount) ================= */

//   const loadData = async () => {
//     try {

//       const main = await getMainContract(contracts.MAIN_CONTRACT);

//       const user = await main.users(address);
//       const userDetails = await main.user_details(address);

//       const price = await main.getTokenToUSDT(
//         ethers.parseUnits("1", 18)
//       );

//       const nrx_value = Number(ethers.formatUnits(price,18));
//       setNrxPrice(nrx_value);

//       setUserData({
//         currentStake: Number(ethers.formatUnits(user.totalCurrentStaked,18)),
//         totalROI: Number(ethers.formatUnits(user.totalROI,18)),
//         totalCapitalReturn: Number(ethers.formatUnits(userDetails.totalCapitalReturn,18)),
//         withdrawable: Number(ethers.formatUnits(user.balance,18)),
//       });

//     } catch (err) {
//       console.log(err);
//       toast.error("Wallet not connected");
//     }
//   };

//   /* ================= STAKE (Same PHP stakenow) ================= */

//   const handleStake = async () => {
//     try {

//       if(!stakeAmount){
//         toast.error("Please enter amount.");
//         return;
//       }

//       const main = await getMainContract(contracts.MAIN_CONTRACT);
//       const usdt = await getUSDTContract(contracts.USDT_CONTRACT);

//       const min = Number(
//         ethers.formatUnits(
//           await main.minimumInvestment(),18
//         )
//       );

//       if(stakeAmount < min){
//         toast.error(`Minimum stake amount should be $ ${min}.`);
//         return;
//       }

//       const confirmBox = window.confirm(
//         `You are staking $ ${stakeAmount}. Press Ok to continue!`
//       );

//       if(!confirmBox) return;

//       const amount = ethers.parseUnits(stakeAmount,18);

//       await (await usdt.approve(
//         contracts.MAIN_CONTRACT,
//         amount
//       )).wait();

//       await (await main.stakeTokens(amount,1)).wait();

//       toast.success(`Successfully staked $ ${stakeAmount}`);

//       setStakeAmount("");
//       loadData();

//     } catch (err) {
//       console.log(err);
//       toast.error("Transaction failed or was rejected.");
//     }
//   };


// const handleROI = async () => {
//   try {

//     if (!address) {
//       toast.error("No dApp wallet connected");
//       return;
//     }

//     const main = await getMainContract(contracts.MAIN_CONTRACT);

//     const isUser = await main.isUserExists(address);

//     if (!isUser) {
//       toast.error("Account is not registered.");
//       return;
//     }

//     const confirmBox = window.confirm(
//       "Are you sure wants to execute ?  Press Ok to continue!"
//     );

//     if (!confirmBox) return;

//     document.getElementById("cover")?.style.setProperty("display", "block");

//     const tx = await main.calculateStakingBalance(address);
//     await tx.wait();

//     toast.success("Executed Successfully.");

//     setTimeout(() => {
//       window.location.reload(true);
//     }, 2000);

//   } catch (err) {
//     console.log(err);
//     toast.error("Something went wrong from blockchain end.");
//   } finally {
//     document.getElementById("cover")?.style.setProperty("display", "none");
//   }
// };
//   /* ================= WITHDRAW ================= */
// const handleWithdraw = async () => {
//   try {

//     /* ===== INVALID AMOUNT CHECK ===== */
//     const amountValue = parseFloat(withdrawAmount);

//     if (!amountValue || amountValue <= 0) {
//       toast.error("Invalid amount.");
//       return;
//     }

//     /* ===== WALLET CHECK ===== */
//     if (!address) {
//       toast.error("No dApp wallet connected.");
//       return;
//     }

//     const main = await getMainContract(contracts.MAIN_CONTRACT);

//     /* ===== USER EXISTS CHECK ===== */
//     const isUser = await main.isUserExists(address);

//     if (!isUser) {
//       toast.error("Account not registered.");
//       return;
//     }

//     const userDetail = await main.users(address);
//     const userBalance = Number(
//       ethers.formatUnits(userDetail.balance, 18)
//     );

//     /* ===== BALANCE CHECK ===== */
//     if (amountValue > userBalance) {
//       toast.error("Insufficient balance.");
//       return;
//     }

//     /* ===== DAILY LIMIT CHECK (API) ===== */
//     const checkResponse = await fetch(
//       "https://nirmalx.io/user/user_action.php",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//           action: "check_withdraw",
//           userid: userDetail.id,
//           amount: amountValue
//         })
//       }
//     );

//     const checkData = await checkResponse.json();

//     if (!checkData.success) {
//       toast.error(checkData.msg);
//       return;
//     }

//     /* ===== CONFIRM POPUP ===== */
//     if (!window.confirm(
//       `Are you sure want to withdraw ${amountValue} USDT?  Press Ok to continue!`
//     )) return;

//     /* ===== SHOW LOADER ===== */
//     document.getElementById("cover")?.style.setProperty("display", "block");

//     const withdrawAmountWei = ethers.parseUnits(
//       amountValue.toString(),
//       18
//     );

//     /* ===== CUSTOM GAS ===== */
//     const signer = await getSigner();
//     const feeData = await signer.provider.getFeeData();

//     /* ===== WITHDRAW TX ===== */
//     const tx = await main.withdraw(
//       withdrawAmountWei,
//       0,
//       { gasPrice: feeData.gasPrice }
//     );

//     const receipt = await tx.wait();

//     if (!receipt.status) throw "Transaction failed";

//     /* ===== STORE WITHDRAW (API) ===== */
//     const storeResponse = await fetch(
//       "https://nirmalx.io/user/user_action.php",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//           action: "store_withdraw",
//           userid: userDetail.id,
//           amount: amountValue,
//           txHash: receipt.hash,
//           wallet: address
//         })
//       }
//     );

//     const storeData = await storeResponse.json();

//     if (storeData.success) {
//       toast.success("Withdrawal successful");

//       setTimeout(() => {
//         window.location.href = "/";
//       }, 2000);
//     } else {
//       toast.error(storeData.msg);
//     }

//   } catch (error) {

//     console.log(error);
//     toast.error(error.toString());

//   } finally {

//     document.getElementById("cover")?.style.setProperty("display", "none");
//   }
// };
//   return (
//    <>
//      <div className="row" style={{ marginTop: "45px" }}>

//       {/* ================= STAKE ================= */}
//       <div className="col-lg-4 col-md-4">
//         <div className="farms-single-section gradient-border stakeBg">
//           <div className="coin-desc">
//             <div className="coin-desc-left">
//               <img src={logo} alt="NirmalX"/>
//             </div>
//             <div className="coin-desc-right newFont">
//               <h4><b>Stake Now</b></h4>
//               <ul>
//                 <li className="bg history0 nonSelect" style={{float:"right"}}>
//                   <Link to="/stakingHistory" style={{color:"#ffffff"}}>View History</Link>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="calculat">
//             <div className="calculat-left">
//               <h6>Minimum :</h6>
//               <h6>Maximum :</h6>
//               <h6>Current Stake :</h6>
//             </div>
//             <div className="calculat-right">
//               <h6>$ 10</h6>
//               <h6>Unlimted</h6>
//               <h6 className="currentStake">
//                 {userData
//                   ? `$ ${userData.currentStake.toFixed(4)} ( NRX ${(userData.currentStake/nrxPrice).toFixed(4)} )`
//                   : "Loading.."}
//               </h6>
//             </div>
//           </div>

//           <label style={{ marginTop: "0.5rem" }}>Select Package*</label>
//           <select className="form-control">
//             <option value="1">Staking Package</option>
//           </select>

//           <label style={{ marginTop: "0.5rem" }}>Amount*</label>
//           <input
//             type="text"
//             placeholder="Enter amount"
//             className="form-control"
//             value={stakeAmount}
//             onChange={(e)=>setStakeAmount(e.target.value)}
//           />

//           <div className="unlocks">
//             <a className="connect_btn unlockWallet" onClick={handleStake}>
//               Submit
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* ================= ROI ================= */}




//   <div className="col-lg-4 col-md-4">
//                     <div className="farms-single-section gradient-border stakeBg" >
//                         <div className="coin-desc">
//                             <div className="coin-desc-left">
//                                 <img src={logo} alt="NirmalX"/>
//                             </div>
//                             <div className="coin-desc-right newFont">
//                                 <h4><b id="duration0">ROI</b></h4>
//                                 <ul>
//                                     <li className="bg history0 nonSelect" style={{float: "right"}}><Link to="/miningHistory" style={{color:"#ffffff"}}>View History</Link></li>
//                                 </ul>
//                             </div>
//                         </div>
//                         <div className="calculat">
//                          <div className="calculat-left">
//                             <h6>Total ROI :</h6>
//                             <h6>Total Capital Return :</h6>
//                          </div>
//                          <div className="calculat-right">
//                             <h6 className="totalROI"> {userData
//                   ? `$ ${userData.totalROI.toFixed(4)} ( NRX ${(userData.totalROI/nrxPrice).toFixed(4)} )`
//                   : "Loading.."}</h6>
//                             <h6 className="totalCapitalReturn">  {userData
//                   ? `$ ${userData.totalCapitalReturn.toFixed(4)} ( NRX ${(userData.totalCapitalReturn/nrxPrice).toFixed(4)} )`
//                   : "Loading.."}</h6>
//                          </div>  


//                         </div>

//                         <div className="form-control stakeAmount" style={{ background: "none", border: "none" }}></div>

//                         <div className="unlocks "  style={{ marginTop: "9.9rem" }} id="mine_now">
//                             <a className='connect_btn unlockWallet' id="calculate_roi_btn" onClick={handleROI} style={{textAalign: "center"}}>Calculate ROI</a>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-lg-4 col-md-4">
//                     <div className="farms-single-section gradient-border stakeBg" >
//                         <div className="coin-desc">
//                             <div className="coin-desc-left">
//                                 <img src={logo} alt="NirmalX"/>
//                             </div>
//                             <div className="coin-desc-right newFont">
//                                 <h4><b id="duration0">Withdraw</b></h4>
//                                 <ul>
//                                     <li className="bg history0 nonSelect" style={{float: "right"}}><Link to="/withdrawHistory" style={{color:"#ffffff"}}>View History</Link></li>
//                                 </ul>
//                             </div>
//                         </div>

//                         <div className="calculat">
//                          <div className="calculat-left">

//                             <h6>Withdrawable Amount:</h6>
//                             <h6>Total Withdraw :</h6>

//                          </div>
//                          <div className="calculat-right">

//                             <h6 className="withdrawable_amount"> {userData
//                   ? `$ ${userData.withdrawable.toFixed(4)} ( NRX ${(userData.withdrawable/nrxPrice).toFixed(4)} )`
//                   : "Loading.."}</h6>
//                       <h6 className="total_withdraw">
//   {userData
//     ? `$ ${totalWithdraw.usd} ( NRX ${totalWithdraw.nrx} )`
//     : "Loading.."}
// </h6>
//                          </div>
//                         </div>

//                         <label for="amount" style={{marginTop:"7rem"}}>Amount*</label>
//                         <input
//             type="text"
//             placeholder="Enter amount"
//             className="form-control"
//             value={withdrawAmount}
//             onChange={(e)=>setWithdrawAmount(e.target.value)}
//           />
//                         <h6 id="total_bbt" className="text mt-3"></h6>

//                         <div className="unlocks " >
//                             <a className='connect_btn unlockWallet' id="withdraw_btn" onClick={handleWithdraw}  style={{ textAlign: "center" }}> Withdraw </a>
//                         </div>
//                     </div>
//                 </div>
















//      </div>
//    </>
//   )
// }

// export default Cards;


























import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import logo from "/images/logo.png";
import { getMainContract, getUSDTContract } from "../utils/contract";
import { useNavigate } from "react-router-dom";

function Cards({ totalWithdraw }) {

  const { address, contracts, baseUrl } = useSelector((state) => state.wallet);
  const navigate = useNavigate();

  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [nrxPrice, setNrxPrice] = useState(1);
  const [userData, setUserData] = useState(null);

  const safeFormat = (value) => {
    try {
      if (!value) return 0;
      return Number(ethers.formatUnits(value, 18));
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    if (address) loadData();
  }, [address]);

  const loadData = async () => {
    try {
      const main = await getMainContract(contracts?.MAIN_CONTRACT);

      const user = await main.users(address);
      const details = await main.user_details(address);

      const priceRaw = await main.getTokenToUSDT(
        ethers.parseUnits("1", 18)
      );

      const price = safeFormat(priceRaw);
      setNrxPrice(price || 1);

      setUserData({
        currentStake: safeFormat(user?.totalCurrentStaked),
        totalROI: safeFormat(user?.totalROI),
        totalCapitalReturn: safeFormat(details?.totalCapitalReturn),
        withdrawable: safeFormat(user?.balance)
      });

    } catch (err) {
      console.log(err);
      toast.error("Wallet not connected");
    }
  };


  const handleStake = async () => {
    try {

      if (!stakeAmount) {
        toast.error("Please enter amount.");
        return;
      }

      const main = await getMainContract(contracts.MAIN_CONTRACT);
      const usdt = await getUSDTContract(contracts.USDT_CONTRACT);

      const min = Number(
        ethers.formatUnits(
          await main.minimumInvestment(), 18
        )
      );

      if (stakeAmount < min) {
        toast.error(`Minimum stake amount should be $ ${min}.`);
        return;
      }

      const confirmBox = window.confirm(
        `You are staking $ ${stakeAmount}. Press Ok to continue!`
      );

      if (!confirmBox) return;

      const amount = ethers.parseUnits(stakeAmount, 18);

      await (await usdt.approve(
        contracts.MAIN_CONTRACT,
        amount
      )).wait();

      await (await main.stakeTokens(amount, 1)).wait();

      toast.success(`Successfully staked $ ${stakeAmount}`);

      setStakeAmount("");
      loadData();

    } catch (err) {
      console.log(err);
      toast.error("Transaction failed or was rejected.");
    }
  };


  const handleROI = async () => {
    try {

      if (!address) {
        toast.error("No dApp wallet connected");
        return;
      }

      const main = await getMainContract(contracts.MAIN_CONTRACT);

      const isUser = await main.isUserExists(address);

      if (!isUser) {
        toast.error("Account is not registered.");
        return;
      }

      const confirmBox = window.confirm(
        "Are you sure wants to execute ?  Press Ok to continue!"
      );

      if (!confirmBox) return;

      document.getElementById("cover")?.style.setProperty("display", "block");

      const tx = await main.calculateStakingBalance(address);
      await tx.wait();

      toast.success("Executed Successfully.");

      setTimeout(() => {
        window.location.reload(true);
      }, 2000);

    } catch (err) {
      console.log(err);
      toast.error("Something went wrong from blockchain end.");
    } finally {
      document.getElementById("cover")?.style.setProperty("display", "none");
    }
  };
  /* ================= WITHDRAW ================= */
  // const handleWithdraw = async () => {
  //   try {

  //     /* ===== INVALID AMOUNT CHECK ===== */
  //     const amountValue = parseFloat(withdrawAmount);

  //     if (!amountValue || amountValue <= 0) {
  //       toast.error("Invalid amount.");
  //       return;
  //     }

  //     /* ===== WALLET CHECK ===== */
  //     if (!address) {
  //       toast.error("No dApp wallet connected.");
  //       return;
  //     }

  //     const main = await getMainContract(contracts.MAIN_CONTRACT);

  //     /* ===== USER EXISTS CHECK ===== */
  //     const isUser = await main.isUserExists(address);

  //     if (!isUser) {
  //       toast.error("Account not registered.");
  //       return;
  //     }

  //     const userDetail = await main.users(address);
  //     const userBalance = Number(
  //       ethers.formatUnits(userDetail.balance, 18)
  //     );

  //     /* ===== BALANCE CHECK ===== */
  //     if (amountValue > userBalance) {
  //       toast.error("Insufficient balance.");
  //       return;
  //     }

  //     /* ===== DAILY LIMIT CHECK (API) ===== */
  //     const checkResponse = await fetch(
  //       `${baseUrl}user/user_action.php`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({
  //           action: "check_withdraw",
  //           userid: userDetail.id,
  //           amount: amountValue
  //         })
  //       }
  //     );

  //     const checkData = await checkResponse.json();

  //     if (!checkData.success) {
  //       toast.error(checkData.msg);
  //       return;
  //     }

  //     /* ===== CONFIRM POPUP ===== */
  //     if (!window.confirm(
  //       `Are you sure want to withdraw ${amountValue} USDT?  Press Ok to continue!`
  //     )) return;

  //     /* ===== SHOW LOADER ===== */
  //     document.getElementById("cover")?.style.setProperty("display", "block");

  //     const withdrawAmountWei = ethers.parseUnits(
  //       amountValue.toString(),
  //       18
  //     );

  //     /* ===== CUSTOM GAS ===== */
  //     // const signer = await getSigner();
  //     // const feeData = await signer.provider.getFeeData();

  //     /* ===== WITHDRAW TX ===== */
  //     // const tx = await main.withdraw(
  //     //   withdrawAmountWei,
  //     //   0,
  //     //   { gasPrice: feeData.gasPrice }
  //     // );
  //     const tx = await main.withdraw(
  //       withdrawAmountWei,
  //       0
  //     );
  //     const receipt = await tx.wait();

  //     if (!receipt.status) throw "Transaction failed";

  //     /* ===== STORE WITHDRAW (API) ===== */
  //     const storeResponse = await fetch(
  //       `${baseUrl}user/user_action.php`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //         body: new URLSearchParams({
  //           action: "store_withdraw",
  //           userid: userDetail.id,
  //           amount: amountValue,
  //           txHash: receipt.hash,
  //           wallet: address
  //         })
  //       }
  //     );

  //     const storeData = await storeResponse.json();

  //     if (storeData.success) {
  //       toast.success("Withdrawal successful");

  //       setTimeout(() => {
  //         window.location.href = "/";
  //       }, 2000);
  //     } else {
  //       toast.error(storeData.msg);
  //     }

  //   } catch (error) {

  //     console.log(error);
  //     toast.error(error.toString());

  //   } finally {

  //     document.getElementById("cover")?.style.setProperty("display", "none");
  //   }
  // };



  const handleWithdraw = async () => {
    try {

      const amountValue = Number(withdrawAmount);

      if (!amountValue || amountValue <= 0) {
        toast.error("Invalid amount.");
        return;
      }

      if (amountValue < 25) {
        toast.error("Minimum withdraw amount is $25.");
        return;
      }

      if (!address) {
        toast.error("No dApp wallet connected.");
        return;
      }

      const main = await getMainContract(contracts.MAIN_CONTRACT);

      /* ===== USER EXISTS ===== */

      const isUser = await main.isUserExists(address);

      if (!isUser) {
        toast.error("Account not registered.");
        return;
      }

      /* ===== USER DETAILS ===== */

      const userDetail = await main.users(address);

      const userBalance = Number(
        ethers.formatUnits(userDetail.balance, 18)
      );

      if (amountValue > userBalance) {
        toast.error("Insufficient balance.");
        return;
      }

      /* ===== DAILY LIMIT CHECK (API) ===== */

      const checkResponse = await fetch(
        `${baseUrl}user/user_action.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            action: "check_withdraw",
            userid: userDetail.id,
            amount: amountValue
          })
        }
      );

      const checkData = await checkResponse.json();

      if (!checkData.success) {
        toast.error(checkData.msg);
        return;
      }

      /* ===== CONFIRM ===== */

      if (!window.confirm(
        `Are you sure want to withdraw ${amountValue} USDT? Press Ok to continue!`
      )) return;

      document.getElementById("cover")?.style.setProperty("display", "block");

      /* ===== AMOUNT CONVERT (Same as BigNumber * 1e18) ===== */

      const withdrawAmountWei = ethers.parseUnits(
        amountValue.toString(),
        18
      );

      /* ===== WITHDRAW ===== */

      const tx = await main.withdraw(
        withdrawAmountWei,
        0
      );

      const receipt = await tx.wait();

      if (!receipt.status) throw new Error("Transaction failed");

      /* ===== STORE WITHDRAW ===== */

      const storeResponse = await fetch(
        `${baseUrl}user/user_action.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            action: "store_withdraw",
            userid: userDetail.id,
            amount: amountValue,
            txHash: receipt.hash,
            wallet: address
          })
        }
      );

      const storeData = await storeResponse.json();

      if (storeData.success) {

        toast.success("Withdrawal successful");


        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);

      } else {

        toast.error(storeData.msg);

      }

    } catch (error) {

      console.log(error);
      toast.error(error.reason || error.message || "Withdraw failed");

    } finally {

      document.getElementById("cover")?.style.setProperty("display", "none");

    }
  };

  return (
    <>

      <div className="row" style={{ marginTop: "45px" }}>

        {/* ================= STAKE ================= */}
        <div className="col-lg-4 col-md-4">
          <div className="farms-single-section gradient-border stakeBg">
            <div className="coin-desc">
              <div className="coin-desc-left">
                <img src={logo} alt="NirmalX" />
              </div>
              <div className="coin-desc-right newFont">
                <h4><b>Stake Now</b></h4>
                <ul>
                  <li className="bg history0 nonSelect" style={{ float: "right" }}>
                    <Link to="/stakingHistory" style={{ color: "#ffffff" }}>View History</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="calculat">
              <div className="calculat-left">
                <h6>Minimum :</h6>
                {/*   <h6>Maximum :</h6>
            <h6>Current Stake :</h6> */}
              </div>
              <div className="calculat-right">
                <h6>$ 10</h6>
                {/* <h6>Unlimted</h6>
              <h6 className="currentStake">
                 {userData
              ? `$ ${userData.currentStake.toFixed(4)} ( NRX ${(userData.currentStake / nrxPrice).toFixed(4)} )`
              : "Loading..."}
              </h6> */}
              </div>
            </div>

            {/* <label style={{ marginTop: "0.5rem" }}>Select Package*</label>
          <select className="form-control">
            <option value="1">Staking Package</option>
          </select> */}

            <label style={{ marginTop: "9.5rem" }}>Amount*</label>
            <input
              type="text"
              placeholder="Enter amount"
              className="form-control"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
            />

            <div className="unlocks">
              <a className="connect_btn unlockWallet" onClick={handleStake}>
                Submit
              </a>
            </div>
          </div>
        </div>

        {/* ================= ROI ================= */}




        <div className="col-lg-4 col-md-4">
          <div className="farms-single-section gradient-border stakeBg" >
            <div className="coin-desc">
              <div className="coin-desc-left">
                <img src={logo} alt="NirmalX" />
              </div>
              <div className="coin-desc-right newFont">
                <h4><b id="duration0">ROI</b></h4>
                <ul>
                  <li className="bg history0 nonSelect" style={{ float: "right" }}><Link to="/miningHistory" style={{ color: "#ffffff" }}>View History</Link></li>
                </ul>
              </div>
            </div>
            <div className="calculat">
              <div className="calculat-left">
                <h6>Total ROI :</h6>
                {/* <h6>Total Capital Return :</h6> */}
              </div>
              <div className="calculat-right">
                <h6 className="totalROI">
                  {userData
                    ? `NRX ${userData.totalROI.toFixed(4)} 
       ( $ ${(userData.totalROI * nrxPrice).toFixed(4)} )`
                    : "Loading..."}
                </h6>
                {/* <h6 className="totalCapitalReturn">  {userData
                  ? `$ ${userData.totalCapitalReturn.toFixed(4)} ( NRX ${(userData.totalCapitalReturn/nrxPrice).toFixed(4)} )`
                  : "Loading.."}</h6> */}
              </div>


            </div>

            <div className="form-control stakeAmount" style={{ background: "none", border: "none" }}></div>

            <div className="unlocks " style={{ marginTop: "12rem" }} id="mine_now">
              <a className='connect_btn unlockWallet' id="calculate_roi_btn" onClick={handleROI} style={{ textAalign: "center" }}>Calculate ROI</a>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-4">
          <div className="farms-single-section gradient-border stakeBg" >
            <div className="coin-desc">
              <div className="coin-desc-left">
                <img src={logo} alt="NirmalX" />
              </div>
              <div className="coin-desc-right newFont">
                <h4><b id="duration0">Withdraw</b></h4>
                <ul>
                  <li className="bg history0 nonSelect" style={{ float: "right" }}><Link to="/withdrawHistory" style={{ color: "#ffffff" }}>View History</Link></li>
                </ul>
              </div>
            </div>

            <div className="calculat">
              <div className="calculat-left">

                <h6>Withdrawable Amount:</h6>
                <h6>Total Withdraw :</h6>

              </div>
              <div className="calculat-right">

                {/* <h6 className="withdrawable_amount"> {userData
                  ? `NRX ${userData.withdrawable.toFixed(4)}
                   ( $ ${(userData.withdrawable/nrxPrice).toFixed(4)} )`
                  : "Loading.."}</h6> */}

                <h6 className="withdrawable_amount">
                  {userData
                    ? `NRX ${userData.withdrawable.toFixed(4)} 
       ( $ ${(userData.withdrawable * nrxPrice).toFixed(4)} )`
                    : "Loading.."}
                </h6>

                <h6 className="total_withdraw">
                  {userData
                    ? ` NRX ${totalWithdraw.nrx}  ($ ${totalWithdraw.usd})`
                    : "Loading.."}
                </h6>
              </div>
            </div>

            <label for="amount" style={{ marginTop: "5rem" }}>Amount*</label>
            <input
              type="text"
              placeholder="Enter amount"
              className="form-control"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <h6 id="total_bbt" className="text mt-3"></h6>

            <div className="unlocks " >
              <a className='connect_btn unlockWallet' id="withdraw_btn" onClick={handleWithdraw} style={{ textAlign: "center" }}> Withdraw </a>
            </div>
          </div>
        </div>



      </div>

    </>

  );
}

export default Cards;