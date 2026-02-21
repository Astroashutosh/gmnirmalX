// import React, { useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import Header from "../components/user/Header";
// import { ethers } from "ethers";
// import {
//   getMainContract,
//   getTokenContract,
//   getLockContract,
//   getUSDTContract,
//   getSigner
// } from "../utils/contract";
// import Cards from "./Cards";

// function Dashboard() {
//   // const { userId } = useParams();
//   // const { contracts ,userId } = useSelector((state) => state.wallet);
// const { userId: paramUserId } = useParams();
// const { contracts, userId: reduxUserId } = useSelector((state) => state.wallet);

// // Final userId
// const userId = paramUserId || reduxUserId;
//   useEffect(() => {
//     if (!userId) return;
//     loadDashboard();
//   }, [userId]);

//   /* ================= NRX PRICE ================= */

//   const getNRXPrice = async () => {
//     const main = await getMainContract(contracts.MAIN_CONTRACT);
//     const one = ethers.parseUnits("1", 18);
//     const price = await main.getTokenToUSDT(one);
//     return Number(ethers.formatUnits(price, 18));
//   };

//   /* ================= TEAM STAKING ================= */

  
//   const getTotalStakingByTeam = async (account) => {
//     const main = await getMainContract(contracts.MAIN_CONTRACT);

//     const isUserExists = await main.isUserExists(account);
//     if (!isUserExists) {
//       toast.error("User does not exist");
//       return 0n;
//     }

//     const partners = await main.partners(account);
//     let totalType2 = 0n;

//     for (let partner of partners) {
//       const stakingArray =
//         await main.getUserStakingTransactions(partner);

//       if (!Array.isArray(stakingArray)) continue;

//       for (let staking of stakingArray) {
//         const amount =
//           staking.tokenAmount ?? staking[3] ?? 0n;

//         const type =
//           staking.stakeType ?? staking[4] ?? 0;

//         if (Number(type) === 2) {
//           totalType2 += amount;
//         }
//       }
//     }

//     return totalType2;
//   };




// // const getTotalStakingByTeam = async (account) => {
// //   const main = await getMainContract(contracts.MAIN_CONTRACT);

// //   const allPartners = await getAllPartnersRecursive(account, main);

// //   let totalType2 = 0n;

// //   for (let partner of allPartners) {
// //     const stakingArray =
// //       await main.getUserStakingTransactions(partner);

// //     for (let staking of stakingArray) {
// //       const amount =
// //         staking.tokenAmount ?? staking[3] ?? 0n;

// //       const type =
// //         staking.stakeType ?? staking[4] ?? 0;

// //       if (Number(type) === 2) {
// //         totalType2 += amount;
// //       }
// //     }
// //   }

// //   return totalType2;
// // };







//   /* ================= LOAD DASHBOARD ================= */

//   const loadDashboard = async () => {
//     try {
//       const main = await getMainContract(contracts.MAIN_CONTRACT);
//       const token = await getTokenContract(contracts.TOKEN_CONTRACT);
//       const lock = await getLockContract(contracts.LOCK_CONTRACT);

//       const userAddress = await main.idToAddress(userId);

//       if (!userAddress || userAddress === ethers.ZeroAddress) {
//         toast.error("Invalid User");
//         return;
//       }

//       const user = await main.users(userAddress);
//       const userDetails = await main.user_details(userAddress);

//       const nrx_value = await getNRXPrice();


//       /* ===== AVAILABLE BALANCE ===== */
//       const available_balance =
//         Number(ethers.formatUnits(user.balance, 18));

//       const available_balance_nrx =
//         available_balance / nrx_value;

//       document.querySelector(".available_balance").innerText =
//         "$ " + available_balance.toFixed(4);

//       document.querySelector(".available_balance_nrx").innerText =
//         "( NRX " + available_balance_nrx.toFixed(4) + " )";

//       /* ===== TOTAL EARNING ===== */
//       const totalbalance =
//         Number(ethers.formatUnits(user.totalbalance, 18));

//       const totalbalance_nrx =
//         totalbalance / nrx_value;

//       document.querySelector(".totalbalance").innerText =
//         "$ " + totalbalance.toFixed(4);

//       document.querySelector(".totalbalance_nrx").innerText =
//         "( NRX " + totalbalance_nrx.toFixed(4) + " )";

//       /* ===== INCOME ===== */
//       const totalMiningLevelIncome =
//         Number(
//           ethers.formatUnits(
//             user.totalMiningLevelIncome,
//             18
//           )
//         );

//       document.querySelector(".totalMiningLevelIncome").innerText =
//         "$ " + totalMiningLevelIncome.toFixed(4);

//       const totalDirectIncome =
//         Number(
//           ethers.formatUnits(
//             user.totalDirectIncome,
//             18
//           )
//         );

//       document.querySelector(".totalDirectIncome").innerText =
//         "$ " + totalDirectIncome.toFixed(4);

//       const totalRankIncome =
//         Number(
//           ethers.formatUnits(
//             user.totalRankIncome,
//             18
//           )
//         );

//       document.querySelector(".totalRankIncome").innerText =
//         "$ " + totalRankIncome.toFixed(4);

//       /* ===== TEAM STAKING (IMPORTANT) ===== */
//       const teamStakingRaw =
//         await getTotalStakingByTeam(userAddress);

//       const stakingUSD =
//         Number(
//           ethers.formatUnits(teamStakingRaw, 18)
//         );

//       const stakingNRX =
//         stakingUSD / nrx_value;

//       document.querySelector(".staking_tokens").innerText =
//         "$ " + stakingUSD.toFixed(4);

//       document.querySelector(".staking_nrx").innerText =
//         "( NRX " + stakingNRX.toFixed(4) + " )";

//       /* ===== TEAM INFO ===== */
//       document.querySelector(".partnerCount").innerText =
//         user.partnercount.toString();

//       document.querySelector(".my_id").innerText =
//         user.referralCode;

//       document.querySelector(".DirectStaked").innerText =
//         "$ " +
//         Number(
//           ethers.formatUnits(
//             userDetails.DirectStaked,
//             18
//           )
//         ).toFixed(4);

//       document.querySelector(".myTeamCount").innerText =
//         userDetails.myTeamCount.toString();

//       document.querySelector(".totalTeambuisness").innerText =
//         "$ " +
//         Number(
//           ethers.formatUnits(
//             userDetails.totalTeambuisness,
//             18
//           )
//         ).toFixed(4);

//       document.querySelector(".currentBusiness").innerText =
//         "$ " +
//         Number(
//           ethers.formatUnits(
//             userDetails.myTeambuisness,
//             18
//           )
//         ).toFixed(4);

//       /* ===== LEADER INCOME ===== */
//       document.querySelector(".totalLeaderIncome").innerText =
//         "$ " +
//         Number(
//           ethers.formatUnits(
//             userDetails.totalLeaderIncome,
//             18
//           )
//         ).toFixed(4);

//       document.querySelector(
//         ".totalLeaderRewardIncome"
//       ).innerText =
//         "$ " +
//         Number(
//           ethers.formatUnits(
//             userDetails.totalLeaderRewardIncome,
//             18
//           )
//         ).toFixed(4);

//       document.querySelector(".totalCapitalReturn").innerText =
//         "$ " +
//         Number(
//           ethers.formatUnits(
//             userDetails.totalCapitalReturn,
//             18
//           )
//         ).toFixed(4);

//       /* ===== LOCKED NRX ===== */
//       const locked =
//         await lock.totalLockedForToken(
//           contracts.TOKEN_CONTRACT
//         );

//       document.querySelector(".locked_nrx").innerText =
//         ethers.formatUnits(locked, 18) +
//         " NRX";

//       /* ===== ACCOUNT STATUS ===== */
//       const totalStaked =
//         Number(
//           ethers.formatUnits(
//             user.totalStaked,
//             18
//           )
//         );

//       document.getElementById("status").innerHTML =
//         totalStaked >= 125
//           ? 'Account Status: <span style="color:green">Active</span>'
//           : 'Account Status: <span style="color:red">Inactive</span>';





// // new code 

// /* ===== REFERRAL LINK ===== */

// const referralLink =
//   window.location.origin +
//   "/register?ref=" +
//   user.referralCode;

// const refInput =
//   document.querySelector(".referral-link");

// if (refInput) {
//   refInput.value = referralLink;
// }

// const copyBtn =
//   document.querySelector(".copy_ref");

// if (copyBtn) {
//   copyBtn.onclick = () => {
//     navigator.clipboard.writeText(referralLink);
//     toast.success("Copied Successfully");
//   };
// }
// /* ===== CONTRACT LINK ===== */

// const contractLink =
//   "https://bscscan.com/address/" +
//   contracts.LOCK_CONTRACT;

// const contractEl =
//   document.querySelector(".contract_link");

// if (contractEl) {
//   contractEl.href = contractLink;
//   contractEl.innerText =
//     contracts.LOCK_CONTRACT.slice(0, 6) +
//     "..." +
//     contracts.LOCK_CONTRACT.slice(-4);
// }


// // end 





//     } catch (err) {
//       console.error(err);
//       toast.error("Dashboard Load Failed");
//     }
//   };

//   return (
//     <>
//       <Header />
//        <div className="markets-capital pt20 pb40">
//         <div className="container">
            
//             <div className="wrapedStat gradient-border">
//                 <div className="row">
//                     <div className="col-md-6">
//                         <div className="grid-container">   
//                             <div className="grid-item">
//                                 <span>Current Balance</span>
//                                 <br/>
//                                 <b className="fs-20 available_balance">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 available_balance_nrx">Loading..</b>
//                             </div>                         
//                             <div className="grid-item">
//                                 <span>Total Earning</span>
//                                 <br/>
//                                 <b className="fs-20 totalbalance">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 totalbalance_nrx">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Level Income</span>
//                                 <br/>
//                                 <b className="fs-20 totalMiningLevelIncome">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 totalMiningLevelIncome_nrx">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Direct Income</span>
//                                 <br/>
//                                 <b className="fs-20 totalDirectIncome">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 totalDirectIncome_nrx">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Rank Income</span>
//                                 <br/>
//                                 <b className="fs-20 totalRankIncome">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 totalRankIncome_nrx">Loading..</b>
//                             </div>
//                             <div className="grid-item rankDetails">
//                                 <span>Current Rank</span>
//                                 <br/>
//                                 <b className="fs-20 myRank">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Leader Income</span>
//                                 <br/>
//                                 <b className="fs-20 totalLeaderIncome">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 totalLeaderIncome_nrx">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Leadership Rank</span>
//                                 <br/>
//                                 <b className="fs-20 myLeaderRank">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Leadership Reward Income</span>
//                                 <br/>
//                                 <b className="fs-20 totalLeaderRewardIncome">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 totalLeaderRewardIncome_nrx">Loading..</b>
//                             </div>
//                             <div className="grid-item">
//                                 <span>Leadership Reward Rank</span>
//                                 <br/>
//                                 <b className="fs-20 leaderRewardRank">Loading..</b>
//                             </div>
                       
//                             <div className="grid-item">
//                                 <span>Total Staking Tokens</span>
//                                 <br/>
//                                 <b className="fs-20 staking_tokens">Loading..</b>
//                                 <br/>
//                                 <b className="fs-10 staking_nrx">Loading..</b>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-md-6">
//                         <h3 className=" newFont">Earn Consistent Returns Every Day – Reliable Mining for Smarter Growth</h3>
//                         <div className="row">
//                          <div className="col-sm-6">
//                             <div className="spaceBetween">
//                                 <div className="attr_text">Total Direct Referral <Link to="/myPartners" className=" bg nonselect" style={{ color: "#ffffff", fontSize: "10px", width: "19%" }}>View</Link>:</div>
                                
//                                 <div className="attr_text partnerCount">-</div>
//                             </div>
//                             <div className="spaceBetween">
//                                 <div className="attr_text">Total Direct Business :</div>
//                                 <div className="attr_text DirectStaked">-
                                    
//                                 </div>
                                
                               
//                             </div>
                    
                            
//                          </div>

//                          <div className="col-sm-6">
//                             <div className="spaceBetween">
//                                 <div className="attr_text">Total Team Size <Link to="/level" className=" bg nonselect" style={{ color: "#ffffff", fontSize: "10px", width: "19%" }}>View</Link>:</div>
//                                 <div className="attr_text myTeamCount">-</div>
//                             </div>
//                             <div className="spaceBetween">
//                                 <div className="attr_text">Total Team Business :</div>
//                                 <div className="attr_text totalTeambuisness">-</div>
//                             </div>
//                             <div className="spaceBetween">
//                                 <div className="attr_text">My ID :</div>
//                                 <div className="attr_text my_id">Loading..</div>
//                             </div>
                           
//                          </div>
//                          <div className="col-sm-7">
//                               <div className="spaceBetween">
//                                 <div className="attr_text" style={{fontSize: "12px"}}>Current Business :</div>
//                                 <div className="attr_text currentBusiness" style={{fontSize: "12px"}}>-</div>
//                               </div>
//                           </div>
//                         </div>
                        
                         

//                         <hr/>
//                         <div className="spaceBetween">
//                             <input className="baseInput referral-link refWidth" readOnly />
//                             <span className="base_btn copy_ref">Copy</span>
//                         </div>
                      
//                         <div className="row">
//                          <div className="col-sm-7">
//                             <div className="coin-desc">
                                
                        
//                             </div>
//                          </div>
//                         </div>

//                         <hr/>
//                         <div className="col-sm-12 d-flex justify-content-center">
//                             <div className="coin-desc">
//                                 <div className="grid-container">   
//                                     <div className="grid-item">
                                        

//                                         <span className="fw-bold fs-5">
//                                           <i className="fas fa-crown text-warning"></i> Leader's Reward
//                                         </span>
//                                         <br/>
//                                         <b className="fs-20" id="leaders_reward">Loading...</b>
//                                     </div>
//                                 </div>
                                
//                             </div>
//                         </div>
//                         <div className="col-sm-12 d-flex flex-column align-items-center justify-content-center grid-item">
//                             <h3 className=" newFont"><i className="fas fa-lock locker-icon"></i> NRX Locker</h3>
//                             <div className="d-flex align-items-center gap-4">
//                                 <h6 className="mb-0 p-2">Total NRX Locked :</h6>
//                                 <h6 className="mb-0 p-2 locked_nrx">Loading..</h6>
//                             </div>
//                             <div className="d-flex align-items-center gap-4">
//                                 <h6 className="mb-0 newFont">Contract Link:</h6>
//                                 <Link className="mb-0 contract_link" target="_blank">Loading..</Link>
//                             </div>
                            
//                             <div className="unlocks "  >
//                                 <Link className='connect_btn unlockWallet' to="/lockHistory" style={{ textAlign: "center" }}>View</Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
               
//             </div>
//         <Cards/>
//             </div>
//         </div>


//         {/* </div> */}
//     {/* </div> */}

//       <div id="Error" className="zoom-anim-dialog mfp-hide modal textBlack">
//         <button className="modal__close" type="button" >
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                 <path
//                     d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z">
//                 </path>
//             </svg>
//         </button>
//         <span className="modal__text" id="val_err"></span>
//     </div>



//     </>
//   );
// }

// export default Dashboard;

















// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import Header from "../components/user/Header";
// import { ethers } from "ethers";
// import {
//   getMainContract,
//   getTokenContract
// } from "../utils/contract";
// import Cards from "./Cards";

// function Dashboard() {

//   const { userId: paramUserId } = useParams();
//   const { contracts, userId: reduxUserId } =
//     useSelector((state) => state.wallet);

//   const userId = paramUserId || reduxUserId;

//   /* ================= STATE ================= */

//   const [nrxPrice, setNrxPrice] = useState(0);

//   const [available, setAvailable] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [totalEarn, setTotalEarn] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [levelIncome, setLevelIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [directIncome, setDirectIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [rankIncome, setRankIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [leaderIncome, setLeaderIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [leaderRewardIncome, setLeaderRewardIncome] = useState({ usd: "0.0000", nrx: "0.0000" });

//   const [flexible, setFlexible] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [staking, setStaking] = useState({ usd: "0.0000", nrx: "0.0000" });

//   const [partnerCount, setPartnerCount] = useState("0");
//   const [teamCount, setTeamCount] = useState("0");
//   const [myId, setMyId] = useState("");

//   const [directBusiness, setDirectBusiness] = useState({ usd: "0.00", nrx: "0.00" });
//   const [teamBusiness, setTeamBusiness] = useState({ usd: "0.00", nrx: "0.00" });
//   const [currentBusiness, setCurrentBusiness] = useState({ usd: "0.00", nrx: "0.00" });

//   const [capitalReturn, setCapitalReturn] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [lockedNRX, setLockedNRX] = useState("0");

//   const [rank, setRank] = useState("");
//   const [leaderRank, setLeaderRank] = useState("");
//   const [leaderRewardLeft, setLeaderRewardLeft] = useState("");

//   const [status, setStatus] = useState("Inactive");

//   /* ================= HELPERS ================= */

//   const f4 = (v) => Number(v).toFixed(4);
//   const f2 = (v) => Number(v).toFixed(2);

//   const getNRXPrice = async (main) => {
//     const one = ethers.parseUnits("1", 18);
//     const price = await main.getTokenToUSDT(one);
//     return Number(ethers.formatUnits(price, 18));
//   };

//   const getUserRank = (r) => [
//     "",
//     "NRX1","NRX2","NRX3","NRX4",
//     "NRX5","NRX6","NRX7","NRX8","NRX9"
//   ][Number(r)];

//   const getLeaderRank = (r) => [
//     "",
//     "Pearl",
//     "Sapphire",
//     "Emerald",
//     "Ruby",
//     "Diamond",
//     "Double Diamond"
//   ][Number(r)];

//   const getLeaderReward = (registrationTime) => {
//     if (!registrationTime) return "";
//     const start = new Date(registrationTime * 1000);
//     const future = new Date(start);
//     future.setDate(future.getDate() + 15);
//     const today = new Date();
//     const diff = future - today;
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     return days > 0 ? `${days} days left` : "";
//   };

//   /* ================= RECURSIVE TEAM ================= */

//   const getAllPartners = async (user, main) => {
//     const visited = new Set();
//     const queue = [user];
//     const all = [];

//     while (queue.length) {
//       const current = queue.shift();
//       const partners = await main.partners(current);
//       for (let p of partners) {
//         if (!visited.has(p)) {
//           visited.add(p);
//           all.push(p);
//           queue.push(p);
//         }
//       }
//     }
//     return all;
//   };

//   const calculateTeamStaking = async (account, main, price) => {
//     const partners = await getAllPartners(account, main);

//     let totalFlexible = 0n;
//     let totalStaking = 0n;

//     for (let p of partners) {
//       const arr = await main.getUserStakingTransactions(p);
//       for (let s of arr) {
//         const amount = s.tokenAmount ?? s[3] ?? 0n;
//         const type = s.stakeType ?? s[4] ?? 0;
//         if (Number(type) === 1) totalFlexible += amount;
//         if (Number(type) === 2) totalStaking += amount;
//       }
//     }

//     const flexUSD = Number(ethers.formatUnits(totalFlexible, 18));
//     const stakeUSD = Number(ethers.formatUnits(totalStaking, 18));

//     setFlexible({
//       usd: f4(flexUSD),
//       nrx: f4(flexUSD / price)
//     });

//     setStaking({
//       usd: f4(stakeUSD),
//       nrx: f4(stakeUSD / price)
//     });
//   };

//   /* ================= LOAD DASHBOARD ================= */

//   useEffect(() => {
//     if (userId) loadDashboard();
//   }, [userId]);

//   const loadDashboard = async () => {
//     try {
//       const main = await getMainContract(contracts.MAIN_CONTRACT);
//       const token = await getTokenContract(contracts.TOKEN_CONTRACT);

//       const userAddress = await main.idToAddress(userId);
//       if (!userAddress || userAddress === ethers.ZeroAddress) {
//         toast.error("Invalid User");
//         return;
//       }

//       const user = await main.users(userAddress);
//       const details = await main.user_details(userAddress);

//       const price = await getNRXPrice(main);
//       setNrxPrice(price);

//       /* BALANCES */
//       const availableUSD = Number(ethers.formatUnits(user.balance, 18));
//       setAvailable({ usd: f4(availableUSD), nrx: f4(availableUSD / price) });

//       const totalUSD = Number(ethers.formatUnits(user.totalbalance, 18));
//       setTotalEarn({ usd: f4(totalUSD), nrx: f4(totalUSD / price) });

//       const levelUSD = Number(ethers.formatUnits(user.totalMiningLevelIncome, 18));
//       setLevelIncome({ usd: f4(levelUSD), nrx: f4(levelUSD / price) });

//       const directUSD = Number(ethers.formatUnits(user.totalDirectIncome, 18));
//       setDirectIncome({ usd: f4(directUSD), nrx: f4(directUSD / price) });

//       const rankUSD = Number(ethers.formatUnits(user.totalRankIncome, 18));
//       setRankIncome({ usd: f4(rankUSD), nrx: f4(rankUSD / price) });

//       const leaderUSD = Number(ethers.formatUnits(details.totalLeaderIncome, 18));
//       setLeaderIncome({ usd: f4(leaderUSD), nrx: f4(leaderUSD / price) });

//       const leaderRewardUSD = Number(ethers.formatUnits(details.totalLeaderRewardIncome, 18));
//       setLeaderRewardIncome({ usd: f4(leaderRewardUSD), nrx: f4(leaderRewardUSD / price) });

//       /* BUSINESS (2 DECIMAL LIKE PHP) */
//       const directBiz = Number(ethers.formatUnits(details.DirectStaked, 18));
//       setDirectBusiness({ usd: f2(directBiz), nrx: f2(directBiz / price) });

//       const teamBiz = Number(ethers.formatUnits(details.totalTeambuisness, 18));
//       setTeamBusiness({ usd: f2(teamBiz), nrx: f2(teamBiz / price) });

//       const currentBiz = Number(ethers.formatUnits(details.myTeambuisness, 18));
//       setCurrentBusiness({ usd: f2(currentBiz), nrx: f2(currentBiz / price) });

//       /* CAPITAL */
//       const capital = Number(ethers.formatUnits(details.totalCapitalReturn, 18));
//       setCapitalReturn({ usd: f4(capital), nrx: f4(capital / price) });

//       /* TEAM STAKING */
//       await calculateTeamStaking(userAddress, main, price);

//       /* OTHER */
//       setPartnerCount(user.partnercount.toString());
//       setTeamCount(details.myTeamCount.toString());
//       setMyId(user.referralCode);

//       setRank(getUserRank(user.rank));
//       setLeaderRank(getLeaderRank(details.leaderRank));
//       setLeaderRewardLeft(getLeaderReward(user.registrationTime));

//       const totalStaked = Number(ethers.formatUnits(user.totalStaked, 18));
//       setStatus(totalStaked >= 125 ? "Active" : "Inactive");

//       const locked = await token.balanceOf(contracts.LOCK_CONTRACT);
//       setLockedNRX(Number(ethers.formatUnits(locked, 18)).toLocaleString());

//     } catch (err) {
//       console.error(err);
//       toast.error("Dashboard Load Failed");
//     }
//   };

//   /* ================= JSX (KEEP YOUR DESIGN SAME) ================= */

//   return (
//     <>
//       <Header />

// <div className="markets-capital pt20 pb40">
//   <div className="container">
//     <div className="wrapedStat gradient-border">
//       <div className="row">
//         <div className="col-md-6">
//           <div className="grid-container">

//             <div className="grid-item">
//               <span>Current Balance</span><br/>
//               <b className="fs-20 available_balance">
//                 $ {available.usd}
//               </b><br/>
//               <b className="fs-10 available_balance_nrx">
//                 ( NRX {available.nrx} )
//               </b>
//             </div>

//             <div className="grid-item">
//               <span>Total Earning</span><br/>
//               <b className="fs-20 totalbalance">
//                 $ {totalEarn.usd}
//               </b><br/>
//               <b className="fs-10 totalbalance_nrx">
//                 ( NRX {totalEarn.nrx} )
//               </b>
//             </div>

//             <div className="grid-item">
//               <span>Level Income</span><br/>
//               <b className="fs-20 totalMiningLevelIncome">
//                 $ {levelIncome.usd}
//               </b><br/>
//               <b className="fs-10 totalMiningLevelIncome_nrx">
//                 ( NRX {levelIncome.nrx} )
//               </b>
//             </div>

//             <div className="grid-item">
//               <span>Direct Income</span><br/>
//               <b className="fs-20 totalDirectIncome">
//                 $ {directIncome.usd}
//               </b><br/>
//               <b className="fs-10 totalDirectIncome_nrx">
//                 ( NRX {directIncome.nrx} )
//               </b>
//             </div>

//             <div className="grid-item">
//               <span>Rank Income</span><br/>
//               <b className="fs-20 totalRankIncome">
//                 $ {rankIncome.usd}
//               </b><br/>
//               <b className="fs-10 totalRankIncome_nrx">
//                 ( NRX {rankIncome.nrx} )
//               </b>
//             </div>

//             <div className="grid-item rankDetails">
//               <span>Current Rank</span><br/>
//               <b className="fs-20 myRank">{rank}</b>
//             </div>

//             <div className="grid-item">
//               <span>Leader Income</span><br/>
//               <b className="fs-20 totalLeaderIncome">
//                 $ {leaderIncome.usd}
//               </b><br/>
//               <b className="fs-10 totalLeaderIncome_nrx">
//                 ( NRX {leaderIncome.nrx} )
//               </b>
//             </div>

//             <div className="grid-item">
//               <span>Leadership Rank</span><br/>
//               <b className="fs-20 myLeaderRank">
//                 {leaderRank}
//               </b>
//             </div>

//             <div className="grid-item">
//               <span>Leadership Reward Income</span><br/>
//               <b className="fs-20 totalLeaderRewardIncome">
//                 $ {leaderRewardIncome.usd}
//               </b><br/>
//               <b className="fs-10 totalLeaderRewardIncome_nrx">
//                 ( NRX {leaderRewardIncome.nrx} )
//               </b>
//             </div>

//             <div className="grid-item">
//               <span>Leadership Reward Rank</span><br/>
//               <b className="fs-20 leaderRewardRank">
//                 {leaderRewardLeft}
//               </b>
//             </div>

//             <div className="grid-item">
//               <span>Total Staking Tokens</span><br/>
//               <b className="fs-20 staking_tokens">
//                 $ {staking.usd}
//               </b><br/>
//               <b className="fs-10 staking_nrx">
//                 ( NRX {staking.nrx} )
//               </b>
//             </div>

//           </div>
//         </div>

//         {/* RIGHT SIDE */}

//         <div className="col-md-6">

//           <h3 className="newFont">
//             Earn Consistent Returns Every Day – Reliable Mining for Smarter Growth
//           </h3>

//           <div className="row">
//             <div className="col-sm-6">
//               <div className="spaceBetween">
//                 <div className="attr_text">
//                   Total Direct Referral
//                   <Link to="/myPartners" className="bg nonselect" style={{color:"#fff",fontSize:"10px",width:"19%"}}>
//                     View
//                   </Link> :
//                 </div>
//                 <div className="attr_text partnerCount">
//                   {partnerCount}
//                 </div>
//               </div>

//               <div className="spaceBetween">
//                 <div className="attr_text">Total Direct Business :</div>
//                 <div className="attr_text DirectStaked">
//                   $ {directBusiness.usd} ( NRX {directBusiness.nrx} )
//                 </div>
//               </div>
//             </div>

//             <div className="col-sm-6">
//               <div className="spaceBetween">
//                 <div className="attr_text">
//                   Total Team Size
//                   <Link to="/level" className="bg nonselect" style={{color:"#fff",fontSize:"10px",width:"19%"}}>
//                     View
//                   </Link> :
//                 </div>
//                 <div className="attr_text myTeamCount">
//                   {teamCount}
//                 </div>
//               </div>

//               <div className="spaceBetween">
//                 <div className="attr_text">Total Team Business :</div>
//                 <div className="attr_text totalTeambuisness">
//                   $ {teamBusiness.usd} ( NRX {teamBusiness.nrx} )
//                 </div>
//               </div>

//               <div className="spaceBetween">
//                 <div className="attr_text">My ID :</div>
//                 <div className="attr_text my_id">
//                   {myId}
//                 </div>
//               </div>
//             </div>

//             <div className="col-sm-7">
//               <div className="spaceBetween">
//                 <div className="attr_text" style={{fontSize:"12px"}}>
//                   Current Business :
//                 </div>
//                 <div className="attr_text currentBusiness" style={{fontSize:"12px"}}>
//                   $ {currentBusiness.usd} ( NRX {currentBusiness.nrx} )
//                 </div>
//               </div>
//             </div>
//           </div>

//           <hr/>

//           <div className="col-sm-12 d-flex justify-content-center">
//             <div className="grid-item">
//               <span className="fw-bold fs-5">
//                 <i className="fas fa-crown text-warning"></i> Leader's Reward
//               </span><br/>
//               <b className="fs-20" id="leaders_reward">
//                 {leaderRewardLeft}
//               </b>
//             </div>
//           </div>

//           <div className="col-sm-12 d-flex flex-column align-items-center justify-content-center grid-item">
//             <h3 className="newFont">
//               <i className="fas fa-lock locker-icon"></i> NRX Locker
//             </h3>

//             <div className="d-flex align-items-center gap-4">
//               <h6>Total NRX Locked :</h6>
//               <h6 className="locked_nrx">
//                 {lockedNRX}
//               </h6>
//             </div>

//             <div className="d-flex align-items-center gap-4">
//               <h6>Contract Link:</h6>
//               <Link
//                 className="contract_link"
//                 target="_blank"
//                 to={`https://bscscan.com/address/${contracts?.LOCK_CONTRACT}`}
//               >
//                 View Contract
//               </Link>
//             </div>

//             <div className="unlocks">
//               <Link className="connect_btn unlockWallet" to="/lockHistory">
//                 View
//               </Link>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>

//     <Cards/>
//   </div>
// </div>

//       {/* <Cards /> */}
//     </>
//   );
// }

// export default Dashboard;






















import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/user/Header";
import { ethers } from "ethers";
import { getMainContract, getTokenContract } from "../utils/contract";
import Cards from "./Cards";

function Dashboard() {

  const { userId: paramUserId } = useParams();
  const { contracts, userId: reduxUserId } =
    useSelector((state) => state.wallet);

  const userId = paramUserId || reduxUserId;

  /* ================= STATE ================= */

  const [nrxPrice, setNrxPrice] = useState(0);

  const [available, setAvailable] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [totalEarn, setTotalEarn] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [levelIncome, setLevelIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [directIncome, setDirectIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [rankIncome, setRankIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [leaderIncome, setLeaderIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [leaderRewardIncome, setLeaderRewardIncome] = useState({ usd: "0.0000", nrx: "0.0000" });

  const [staking, setStaking] = useState({ usd: "0.0000", nrx: "0.0000" });

  const [partnerCount, setPartnerCount] = useState("0");
  const [teamCount, setTeamCount] = useState("0");
  const [myId, setMyId] = useState("");

  const [directBusiness, setDirectBusiness] = useState({ usd: "0.00", nrx: "0.00" });
  const [teamBusiness, setTeamBusiness] = useState({ usd: "0.00", nrx: "0.00" });
  const [currentBusiness, setCurrentBusiness] = useState({ usd: "0.00", nrx: "0.00" });

  const [capitalReturn, setCapitalReturn] = useState({ usd: "0.0000", nrx: "0.0000" });
  const [lockedNRX, setLockedNRX] = useState("0");

  const [rank, setRank] = useState("");
  const [leaderRank, setLeaderRank] = useState("");
  const [leaderRewardLeft, setLeaderRewardLeft] = useState("");

  const [status, setStatus] = useState("Inactive");

  /* ================= HELPERS ================= */

  const f4 = (v) => Number(v).toFixed(4);
  const f2 = (v) => Number(v).toFixed(2);

  const shortenAddress = (addr) =>
    addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";

  const getNRXPrice = async (main) => {
    const one = ethers.parseUnits("1", 18);
    const price = await main.getTokenToUSDT(one);
    return Number(ethers.formatUnits(price, 18));
  };

  const getUserRank = (r) => [
    "", "NRX1","NRX2","NRX3","NRX4",
    "NRX5","NRX6","NRX7","NRX8","NRX9"
  ][Number(r)];

  const getLeaderRank = (r) => [
    "", "Pearl","Sapphire","Emerald",
    "Ruby","Diamond","Double Diamond"
  ][Number(r)];

  const getLeaderReward = (registrationTime) => {
    if (!registrationTime) return "";
    const start = new Date(Number(registrationTime) * 1000);
    const future = new Date(start);
    future.setDate(future.getDate() + 15);
    const diff = future - new Date();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} Days Left` : "Completed";
  };

  /* ================= LOAD ================= */

  useEffect(() => {
    if (userId) loadDashboard();
  }, [userId]);

  // const loadDashboard = async () => {
  //   try {

  //     const main = await getMainContract(contracts.MAIN_CONTRACT);
  //     const token = await getTokenContract(contracts.TOKEN_CONTRACT);

  //     const userAddress = await main.idToAddress(userId);
  //     if (!userAddress || userAddress === ethers.ZeroAddress) {
  //       toast.error("Invalid User");
  //       return;
  //     }

  //     const user = await main.users(userAddress);
  //     const details = await main.user_details(userAddress);

  //     const price = await getNRXPrice(main);
  //     setNrxPrice(price);

  //     /* BALANCES */
  //     const availableUSD = Number(ethers.formatUnits(user.balance, 18));
  //     setAvailable({ usd: f4(availableUSD), nrx: f4(availableUSD / price) });

  //     const totalUSD = Number(ethers.formatUnits(user.totalbalance, 18));
  //     setTotalEarn({ usd: f4(totalUSD), nrx: f4(totalUSD / price) });

  //     const levelUSD = Number(ethers.formatUnits(user.totalMiningLevelIncome, 18));
  //     setLevelIncome({ usd: f4(levelUSD), nrx: f4(levelUSD / price) });

  //     const directUSD = Number(ethers.formatUnits(user.totalDirectIncome, 18));
  //     setDirectIncome({ usd: f4(directUSD), nrx: f4(directUSD / price) });

  //     const rankUSD = Number(ethers.formatUnits(user.totalRankIncome, 18));
  //     setRankIncome({ usd: f4(rankUSD), nrx: f4(rankUSD / price) });

  //     const leaderUSD = Number(ethers.formatUnits(details.totalLeaderIncome, 18));
  //     setLeaderIncome({ usd: f4(leaderUSD), nrx: f4(leaderUSD / price) });

  //     const leaderRewardUSD = Number(ethers.formatUnits(details.totalLeaderRewardIncome, 18));
  //     setLeaderRewardIncome({ usd: f4(leaderRewardUSD), nrx: f4(leaderRewardUSD / price) });

  //     /* BUSINESS */
  //     const directBiz = Number(ethers.formatUnits(details.DirectStaked, 18));
  //     setDirectBusiness({ usd: f2(directBiz), nrx: f2(directBiz / price) });

  //     const teamBiz = Number(ethers.formatUnits(details.totalTeambuisness, 18));
  //     setTeamBusiness({ usd: f2(teamBiz), nrx: f2(teamBiz / price) });

  //     const currentBiz = Number(ethers.formatUnits(details.myTeambuisness, 18));
  //     setCurrentBusiness({ usd: f2(currentBiz), nrx: f2(currentBiz / price) });

  //     const capital = Number(ethers.formatUnits(details.totalCapitalReturn, 18));
  //     setCapitalReturn({ usd: f4(capital), nrx: f4(capital / price) });

  //     /* STAKING */
  //     const totalStaked = Number(ethers.formatUnits(user.totalStaked, 18));
  //     setStaking({ usd: f4(totalStaked), nrx: f4(totalStaked / price) });

  //     /* OTHER */
  //     setPartnerCount(user.partnercount.toString());
  //     setTeamCount(details.myTeamCount.toString());
  //     setMyId(user.referralCode);

  //     setRank(getUserRank(user.rank));
  //     setLeaderRank(getLeaderRank(details.leaderRank));
  //     setLeaderRewardLeft(getLeaderReward(user.registrationTime));

  //     setStatus(totalStaked >= 125 ? "Active" : "Inactive");

  //     const locked = await token.balanceOf(contracts.LOCK_CONTRACT);
  //     setLockedNRX(Number(ethers.formatUnits(locked, 18)).toLocaleString());

  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Dashboard Load Failed");
  //   }
  // };





const loadDashboard = async () => {
  try {

    const main = await getMainContract(contracts.MAIN_CONTRACT);
    const token = await getTokenContract(contracts.TOKEN_CONTRACT);

    const userAddress = await main.idToAddress(userId);
    if (!userAddress || userAddress === ethers.ZeroAddress) {
      toast.error("Invalid User");
      return;
    }

    const user = await main.users(userAddress);
    const details = await main.user_details(userAddress);

    /* ===== NRX PRICE ===== */
    const one = ethers.parseUnits("1", 18);
    const priceRaw = await main.getTokenToUSDT(one);
    const price = Number(ethers.formatUnits(priceRaw, 18));
    setNrxPrice(price);

    const f4 = (v) => Number(v).toFixed(4);
    const f2 = (v) => Number(v).toFixed(2);

    /* ===== BALANCES ===== */
    const availableUSD = Number(ethers.formatUnits(user.balance, 18));
    setAvailable({
      usd: f4(availableUSD),
      nrx: f4(availableUSD * price)
    });

    const totalUSD = Number(ethers.formatUnits(user.totalbalance, 18));
    setTotalEarn({
      usd: f4(totalUSD),
      nrx: f4(totalUSD * price)
    });

    const levelUSD = Number(ethers.formatUnits(user.totalMiningLevelIncome, 18));
    setLevelIncome({
      usd: f4(levelUSD),
      nrx: f4(levelUSD * price)
    });

    const directUSD = Number(ethers.formatUnits(user.totalDirectIncome, 18));
    setDirectIncome({
      usd: f4(directUSD),
      nrx: f4(directUSD * price)
    });

    const rankUSD = Number(ethers.formatUnits(user.totalRankIncome, 18));
    setRankIncome({
      usd: f4(rankUSD),
      nrx: f4(rankUSD * price)
    });

    /* ===== LEADER INCOME ===== */
    const leaderUSD = Number(ethers.formatUnits(details.totalLeaderIncome, 18));
    setLeaderIncome({
      usd: f4(leaderUSD),
      nrx: f4(leaderUSD * price)
    });

    const leaderRewardUSD = Number(ethers.formatUnits(details.totalLeaderRewardIncome, 18));
    setLeaderRewardIncome({
      usd: f4(leaderRewardUSD),
      nrx: f4(leaderRewardUSD * price)
    });

    /* ===== BUSINESS (2 DECIMAL PHP STYLE) ===== */
    const directBiz = Number(ethers.formatUnits(details.DirectStaked, 18));
    setDirectBusiness({
      usd: f2(directBiz),
      nrx: f2(directBiz * price)
    });

    const teamBiz = Number(ethers.formatUnits(details.totalTeambuisness, 18));
    setTeamBusiness({
      usd: f2(teamBiz),
      nrx: f2(teamBiz * price)
    });

    const currentBiz = Number(ethers.formatUnits(details.myTeambuisness, 18));
    setCurrentBusiness({
      usd: f2(currentBiz),
      nrx: f2(currentBiz * price)
    });

    /* ===== CAPITAL ===== */
    const capital = Number(ethers.formatUnits(details.totalCapitalReturn, 18));
    setCapitalReturn({
      usd: f4(capital),
      nrx: f4(capital * price)
    });

    /* ===== STAKING ===== */
    const totalStaked = Number(ethers.formatUnits(user.totalStaked, 18));
    setStaking({
      usd: f4(totalStaked),
      nrx: f4(totalStaked * price)
    });

    /* ===== RANK FIX ===== */
    const userRankValue = Number(user.rank);
    const rankArray = [
      "", "NRX1","NRX2","NRX3","NRX4",
      "NRX5","NRX6","NRX7","NRX8","NRX9"
    ];
    setRank(rankArray[userRankValue] || "-");

    /* ===== LEADER RANK FIX ===== */
    const leaderRankValue = Number(details.leaderRank);
    const leaderRankArray = [
      "", "Pearl","Sapphire","Emerald",
      "Ruby","Diamond","Double Diamond"
    ];
    setLeaderRank(leaderRankArray[leaderRankValue] || "-");

    /* ===== LEADER REWARD RANK (PERCENT) ===== */
    const leaderRewardRankValue = Number(details.leaderRewardRank);
    setLeaderRewardLeft(
      leaderRewardRankValue > 0
        ? `${leaderRewardRankValue} %`
        : "-"
    );

    /* ===== OTHER ===== */
    setPartnerCount(user.partnercount.toString());
    setTeamCount(details.myTeamCount.toString());
    setMyId(user.referralCode);

    setStatus(totalStaked >= 125 ? "Active" : "Inactive");

    const locked = await token.balanceOf(contracts.LOCK_CONTRACT);
    setLockedNRX(
      Number(ethers.formatUnits(locked, 18)).toLocaleString()
    );

  } catch (err) {
    console.error(err);
    toast.error("Dashboard Load Failed");
  }
};





  const referralLink = `https://nirmalx.io/signup.php?ref=${myId}`;

  return (
    <>
      <Header />
<div className="markets-capital pt20 pb40">
  <div className="container">
    <div className="wrapedStat gradient-border">
      <div className="row">
        <div className="col-md-6">
          <div className="grid-container">

            <div className="grid-item">
              <span>Current Balance</span><br/>
              <b className="fs-20 available_balance">
                $ {available.usd}
              </b><br/>
              <b className="fs-10 available_balance_nrx">
                ( NRX {available.nrx} )
              </b>
            </div>

            <div className="grid-item">
              <span>Total Earning</span><br/>
              <b className="fs-20 totalbalance">
                $ {totalEarn.usd}
              </b><br/>
              <b className="fs-10 totalbalance_nrx">
                ( NRX {totalEarn.nrx} )
              </b>
            </div>

            <div className="grid-item">
              <span>Level Income</span><br/>
              <b className="fs-20 totalMiningLevelIncome">
                $ {levelIncome.usd}
              </b><br/>
              <b className="fs-10 totalMiningLevelIncome_nrx">
                ( NRX {levelIncome.nrx} )
              </b>
            </div>

            <div className="grid-item">
              <span>Direct Income</span><br/>
              <b className="fs-20 totalDirectIncome">
                $ {directIncome.usd}
              </b><br/>
              <b className="fs-10 totalDirectIncome_nrx">
                ( NRX {directIncome.nrx} )
              </b>
            </div>

            <div className="grid-item">
              <span>Rank Income</span><br/>
              <b className="fs-20 totalRankIncome">
                $ {rankIncome.usd}
              </b><br/>
              <b className="fs-10 totalRankIncome_nrx">
                ( NRX {rankIncome.nrx} )
              </b>
            </div>

            <div className="grid-item rankDetails">
              <span>Current Rank</span><br/>
              <b className="fs-20 myRank">{rank}</b>
            </div>

            <div className="grid-item">
              <span>Leader Income</span><br/>
              <b className="fs-20 totalLeaderIncome">
                $ {leaderIncome.usd}
              </b><br/>
              <b className="fs-10 totalLeaderIncome_nrx">
                ( NRX {leaderIncome.nrx} )
              </b>
            </div>

            <div className="grid-item">
              <span>Leadership Rank</span><br/>
              <b className="fs-20 myLeaderRank">
                {leaderRank}
              </b>
            </div>

            <div className="grid-item">
              <span>Leadership Reward Income</span><br/>
              <b className="fs-20 totalLeaderRewardIncome">
                $ {leaderRewardIncome.usd}
              </b><br/>
              <b className="fs-10 totalLeaderRewardIncome_nrx">
                ( NRX {leaderRewardIncome.nrx} )
              </b>
            </div>

            <div className="grid-item">
              <span>Leadership Reward Rank</span><br/>
              <b className="fs-20 leaderRewardRank">
                {leaderRewardLeft}
              </b>
            </div>

            <div className="grid-item">
              <span>Total Staking Tokens</span><br/>
              <b className="fs-20 staking_tokens">
                $ {staking.usd}
              </b><br/>
              <b className="fs-10 staking_nrx">
                ( NRX {staking.nrx} )
              </b>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="col-md-6">

          <h3 className="newFont">
            Earn Consistent Returns Every Day – Reliable Mining for Smarter Growth
          </h3>

          <div className="row">
            <div className="col-sm-6">
              <div className="spaceBetween">
                <div className="attr_text">
                  Total Direct Referral
                  <Link to="/myPartners" className="bg nonselect" style={{color:"#fff",fontSize:"10px",width:"19%"}}>
                    View
                  </Link> :
                </div>
                <div className="attr_text partnerCount">
                  {partnerCount}
                </div>
              </div>

              <div className="spaceBetween">
                <div className="attr_text">Total Direct Business :</div>
                <div className="attr_text DirectStaked">
                  $ {directBusiness.usd} ( NRX {directBusiness.nrx} )
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="spaceBetween">
                <div className="attr_text">
                  Total Team Size
                  <Link to="/level" className="bg nonselect" style={{color:"#fff",fontSize:"10px",width:"19%"}}>
                    View
                  </Link> :
                </div>
                <div className="attr_text myTeamCount">
                  {teamCount}
                </div>
              </div>

              <div className="spaceBetween">
                <div className="attr_text">Total Team Business :</div>
                <div className="attr_text totalTeambuisness">
                  $ {teamBusiness.usd} ( NRX {teamBusiness.nrx} )
                </div>
              </div>

              <div className="spaceBetween">
                <div className="attr_text">My ID :</div>
                <div className="attr_text my_id">
                  {myId}
                </div>
              </div>
            </div>

            <div className="col-sm-7">
              <div className="spaceBetween">
                <div className="attr_text" style={{fontSize:"12px"}}>
                  Current Business :
                </div>
                <div className="attr_text currentBusiness" style={{fontSize:"12px"}}>
                  $ {currentBusiness.usd} ( NRX {currentBusiness.nrx} )
                </div>
              </div>
            </div>
          </div>

          <hr/>

          {/* ===== REFERRAL LINK (PHP SAME) ===== */}

          <div className="spaceBetween">
            <input
              className="baseInput referral-link refWidth"
              readOnly
              value={`https://nirmalx.io/signup.php?ref=${myId}`}
            />
            <span
              className="base_btn copy_ref"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://nirmalx.io/signup.php?ref=${myId}`
                );
                toast.success("Copied!");
              }}
            >
              Copy
            </span>
          </div>

          <hr/>

          {/* ===== LEADER REWARD ===== */}

          <div className="col-sm-12 d-flex justify-content-center">
            <div className="grid-item">
              <span className="fw-bold fs-5">
                <i className="fas fa-crown text-warning"></i> Leader's Reward
              </span><br/>
              <b className="fs-20" id="leaders_reward">
                {leaderRewardLeft}
              </b>
            </div>
          </div>

          {/* ===== NRX LOCKER ===== */}

          <div className="col-sm-12 d-flex flex-column align-items-center justify-content-center grid-item">
            <h3 className="newFont">
              <i className="fas fa-lock locker-icon"></i> NRX Locker
            </h3>

            <div className="d-flex align-items-center gap-4">
              <h6>Total NRX Locked :</h6>
              <h6 className="locked_nrx">
                {lockedNRX} NRX
              </h6>
            </div>

            <div className="d-flex align-items-center gap-4">
              <h6>Contract Link:</h6>
              <Link
                className="contract_link"
                target="_blank"
                to={`https://bscscan.com/address/${contracts?.LOCK_CONTRACT}`}
              >
                {contracts?.LOCK_CONTRACT
                  ? contracts.LOCK_CONTRACT.slice(0,6) +
                    "..." +
                    contracts.LOCK_CONTRACT.slice(-4)
                  : ""}
              </Link>
            </div>

            <div className="unlocks">
              <Link className="connect_btn unlockWallet" to="/lockHistory">
                View
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>

    <Cards/>
  </div>
</div>
    </>
  );
}

export default Dashboard;