

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import Header from "../components/user/Header";
// import { ethers } from "ethers";
// import { getMainContract, getTokenContract } from "../utils/contract";
// import Cards from "./Cards";

// function Dashboard() {

//   const { contracts, address } =
//     useSelector((state) => state.wallet);
// const [totalCapping, setTotalCapping] =
//   useState({ usd: "0.0000", nrx: "0.0000" });
//   const [nrxPrice, setNrxPrice] = useState(0);
//   const [totalWithdraw, setTotalWithdraw] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [available, setAvailable] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [totalEarn, setTotalEarn] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [levelIncome, setLevelIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [directIncome, setDirectIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [rankIncome, setRankIncome] = useState({ usd: "0.0000", nrx: "0.0000" });
//   const [staking, setStaking] = useState({ usd: "0.0000", nrx: "0.0000" });

//   const [directBusiness, setDirectBusiness] = useState({ usd: "0.00", nrx: "0.00" });
//   const [teamBusiness, setTeamBusiness] = useState({ usd: "0.00", nrx: "0.00" });
//   const [currentBusiness, setCurrentBusiness] = useState({ usd: "0.00", nrx: "0.00" });

//   const [partnerCount, setPartnerCount] = useState("0");
//   const [teamCount, setTeamCount] = useState("0");
//   const [myId, setMyId] = useState("");
//   const [rank, setRank] = useState("No Rank");
//   const [leaderRewardLeft, setLeaderRewardLeft] = useState("");
//   const [lockedNRX, setLockedNRX] = useState("0");

//   /* ===== SAFE FORMAT ===== */

//   const safeFormat = (value) => {
//     try {
//       if (!value) return 0;
//       return Number(ethers.formatUnits(value, 18));
//     } catch {
//       return 0;
//     }
//   };

//   const f4 = (v) => Number(v || 0).toFixed(4);
//   const f2 = (v) => Number(v || 0).toFixed(2);

//   useEffect(() => {
//     if (address && contracts?.MAIN_CONTRACT) {
//       loadDashboard();
//     }
//   }, [address, contracts]);

//   // const loadDashboard = async () => {
//   //   try {

//   //     const main = await getMainContract(contracts.MAIN_CONTRACT);
//   //     const token = await getTokenContract(contracts.TOKEN_CONTRACT);

//   //     const one = ethers.parseUnits("1", 18);

//   //     const [
//   //       exists,
//   //       user,
//   //       details,
//   //       priceRaw,
//   //       lockedRaw,
//   //       withdrawnRaw,
//   //       registrationTimeRaw
//   //     ] = await Promise.all([
//   //       main.isUserExists(address),
//   //       main.users(address),
//   //       main.user_details(address),
//   //       main.getTokenToUSDT(one),
//   //       token.balanceOf(contracts.LOCK_CONTRACT),
//   //       main._amountWithdrawn(address),
//   //       main.registrationTime(address)
//   //     ]);

//   //     if (!exists) {
//   //       toast.error("Invalid User");
//   //       return;
//   //     }

//   //     const price = safeFormat(priceRaw);
//   //     setNrxPrice(price);

//   //     const toUSD = (nrx) => nrx * price;

//   //     /* ===== NRX VALUES ===== */

//   //     const availableNRX = safeFormat(user?.balance);
//   //     const totalNRX = safeFormat(user?.totalbalance);
//   //     const levelNRX = safeFormat(user?.totalMiningLevelIncome);
//   //     const directNRX = safeFormat(user?.totalDirectIncome);
//   //     const rankNRX = safeFormat(user?.totalRankIncome);
//   //     const stakingNRX = safeFormat(user?.totalStaked);
//   //     const withdrawnNRX = safeFormat(withdrawnRaw);

//   //     const directBizNRX = safeFormat(details?.DirectStaked);
//   //     const teamBizNRX = safeFormat(details?.totalTeambuisness);
//   //     const currentBizNRX = safeFormat(details?.myTeambuisness);

//   //     /* ===== STATE SET ===== */

//   //     setAvailable({ usd: f4(toUSD(availableNRX)), nrx: f4(availableNRX) });
//   //     setTotalEarn({ usd: f4(toUSD(totalNRX)), nrx: f4(totalNRX) });
//   //     setLevelIncome({ usd: f4(toUSD(levelNRX)), nrx: f4(levelNRX) });
//   //     setDirectIncome({ usd: f4(toUSD(directNRX)), nrx: f4(directNRX) });
//   //     setRankIncome({ usd: f4(toUSD(rankNRX)), nrx: f4(rankNRX) });
//   //     setStaking({ usd: f4(toUSD(stakingNRX)), nrx: f4(stakingNRX) });
//   //     setTotalWithdraw({ usd: f4(toUSD(withdrawnNRX)), nrx: f4(withdrawnNRX) });

//   //     setDirectBusiness({ usd: f2(toUSD(directBizNRX)), nrx: f2(directBizNRX) });
//   //     setTeamBusiness({ usd: f2(toUSD(teamBizNRX)), nrx: f2(teamBizNRX) });
//   //     setCurrentBusiness({ usd: f2(toUSD(currentBizNRX)), nrx: f2(currentBizNRX) });

//   //     setPartnerCount(user?.partnercount?.toString() || "0");
//   //     setTeamCount(details?.myTeamCount?.toString() || "0");
//   //     setMyId(user?.referralCode || "");

//   //     const rankValue = Number(details?.rank || 0);
//   //     // const ranks = ["", "NRX1", "NRX2", "NRX3", "NRX4", "NRX5", "NRX6", "NRX7", "NRX8", "NRX9"];
//   //     const ranks = ['', 'Pearl', 'Sapphire', 'Emerald', 'Ruby', 'Diamond', 'Double Diamond'];

//   //     setRank(rankValue > 0 ? ranks[rankValue] : "No Rank");

//   //     if (registrationTimeRaw && Number(registrationTimeRaw) > 0) {
//   //       const start = new Date(Number(registrationTimeRaw) * 1000);
//   //       const future = new Date(start);
//   //       future.setDate(future.getDate() + 15);
//   //       const diff = future - new Date();
//   //       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//   //       setLeaderRewardLeft(days > 0 ? `${days} Days Left` : "");
//   //     }

//   //     setLockedNRX(safeFormat(lockedRaw).toLocaleString());

//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("Dashboard Load Failed");
//   //   }
//   // };

// const loadDashboard = async () => {
//   try {

//     const main = await getMainContract(contracts.MAIN_CONTRACT);

//     const one = ethers.parseUnits("1", 18);

//     const [
//       exists,
//       user,
//       details,
//       priceRaw,
//       withdrawnRaw
//     ] = await Promise.all([
//       main.isUserExists(address),
//       main.users(address),
//       main.user_details(address),
//       main.getTokenToUSDT(one),
//       main._amountWithdrawn(address)
//     ]);

//     if (!exists) {
//       toast.error("Invalid User");
//       return;
//     }

//     /* ===== EXACT PHP PRICE LOGIC ===== */

//     const price =
//       Number(priceRaw.toString()) / 1e18;

//     const toNRX = (v) =>
//       Number(v.toString()) / 1e18;

//     const toUSD = (nrx) =>
//       nrx * price;

//     /* ===== CORE NRX VALUES ===== */

//     const availableNRX = toNRX(user.balance);
//     const totalNRX = toNRX(user.totalbalance);
//     const levelNRX = toNRX(user.totalMiningLevelIncome);
//     const directNRX = toNRX(user.totalDirectIncome);
//     const rankNRX = toNRX(user.totalRankIncome);
//     const stakingNRX = toNRX(user.totalStaked);
//     const withdrawnNRX = toNRX(withdrawnRaw);
//     const totalCappingNRX = toNRX(user.toalCappingInNRX);

//     const directBizNRX = toNRX(details.DirectStaked);
//     const teamBizNRX = toNRX(details.totalTeambuisness);

//     /* ===== STATE SET (PHP FORMAT) ===== */

//     setAvailable({
//       usd: toUSD(availableNRX).toFixed(4),
//       nrx: availableNRX.toFixed(4)
//     });

//     setTotalEarn({
//       usd: toUSD(totalNRX).toFixed(4),
//       nrx: totalNRX.toFixed(4)
//     });

//     setLevelIncome({
//       usd: toUSD(levelNRX).toFixed(4),
//       nrx: levelNRX.toFixed(4)
//     });

//     setDirectIncome({
//       usd: toUSD(directNRX).toFixed(4),
//       nrx: directNRX.toFixed(4)
//     });

//     setRankIncome({
//       usd: toUSD(rankNRX).toFixed(4),
//       nrx: rankNRX.toFixed(4)
//     });

//     setStaking({
//       usd: toUSD(stakingNRX).toFixed(4),
//       nrx: stakingNRX.toFixed(4)
//     });

//     setTotalWithdraw({
//       usd: toUSD(withdrawnNRX).toFixed(4),
//       nrx: withdrawnNRX.toFixed(4)
//     });

//     setDirectBusiness({
//       usd: toUSD(directBizNRX).toFixed(2),
//       nrx: directBizNRX.toFixed(2)
//     });

//     setTeamBusiness({
//       usd: toUSD(teamBizNRX).toFixed(2),
//       nrx: teamBizNRX.toFixed(2)
//     });

//     /* ===== TOTAL CAPPING (NEW ADD) ===== */

//     setTotalCapping({
//       usd: toUSD(totalCappingNRX).toFixed(4),
//       nrx: totalCappingNRX.toFixed(4)
//     });

//     /* ===== COUNTS ===== */

//     setPartnerCount(user.partnercount.toString());
//     setTeamCount(details.myTeamCount.toString());
//     setMyId(user.referralCode);

//     /* ===== RANK (PHP ARRAY) ===== */

//     const ranks = [
//       "",
//       "Pearl",
//       "Sapphire",
//       "Emerald",
//       "Ruby",
//       "Diamond",
//       "Double Diamond"
//     ];

//     const rankValue = Number(details.rank);

//     setRank(rankValue > 0 ? ranks[rankValue] : "No Rank");

//   } catch (err) {
//     console.error(err);
//     toast.error("Dashboard Load Failed");
//   }
// };

//   return (
//     <>
//       <Header />
//       <div className="markets-capital pt20 pb40">
//         <div className="container">
//           <div className="wrapedStat gradient-border">
//             {/* YOUR COMPLETE UI SAME — NO CHANGE */}

// <div className="row">
//               <div className="col-md-6">
//                 <div className="grid-container">

//                   <div className="grid-item">
//                     <span>Current Balance</span><br />
//                     <b className="fs-20 available_balance">
//                       $ {available.usd}
//                     </b><br />
//                     <b className="fs-10 available_balance_nrx">
//                       ( NRX {available.nrx} )
//                     </b>
//                   </div>

//                   <div className="grid-item">
//                     <span>Total Earning</span><br />
//                     <b className="fs-20 totalbalance">
//                       $ {totalEarn.usd}
//                     </b><br />
//                     <b className="fs-10 totalbalance_nrx">
//                       ( NRX {totalEarn.nrx} )
//                     </b>
//                   </div>

//                   <div className="grid-item">
//                     <span>Level Income</span><br />
//                     <b className="fs-20 totalMiningLevelIncome">
//                       $ {levelIncome.usd}
//                     </b><br />
//                     <b className="fs-10 totalMiningLevelIncome_nrx">
//                       ( NRX {levelIncome.nrx} )
//                     </b>
//                   </div>

//                   <div className="grid-item">
//                     <span>Direct Income</span><br />
//                     <b className="fs-20 totalDirectIncome">
//                       $ {directIncome.usd}
//                     </b><br />
//                     <b className="fs-10 totalDirectIncome_nrx">
//                       ( NRX {directIncome.nrx} )
//                     </b>
//                   </div>

//                   <div className="grid-item">
//                     <span>Rank Income</span><br />
//                     <b className="fs-20 totalRankIncome">
//                       $ {rankIncome.usd}
//                     </b><br />
//                     <b className="fs-10 totalRankIncome_nrx">
//                       ( NRX {rankIncome.nrx} )
//                     </b>
//                   </div>

//                   <div className="grid-item rankDetails">
//                     <span>Current Rank</span><br />
//                     <b className="fs-20 myRank">{rank}</b>
//                   </div>

//                   {/* <div className="grid-item">
//                     <span>Leader Income</span><br />
//                     <b className="fs-20 totalLeaderIncome">
//                       $ {leaderIncome.usd}
//                     </b><br />
//                     <b className="fs-10 totalLeaderIncome_nrx">
//                       ( NRX {leaderIncome.nrx} )
//                     </b>
//                   </div>

//                   <div className="grid-item">
//                     <span>Leadership Rank</span><br />
//                     <b className="fs-20 myLeaderRank">
//                       {leaderRank}
//                     </b>
//                   </div>

//                   <div className="grid-item">
//                     <span>Leadership Reward Income</span><br />
//                     <b className="fs-20 totalLeaderRewardIncome">
//                       $ {leaderRewardIncome.usd}
//                     </b><br />
//                     <b className="fs-10 totalLeaderRewardIncome_nrx">
//                       ( NRX {leaderRewardIncome.nrx} )
//                     </b>
//                   </div>

//                   <div className="grid-item">
//                     <span>Leadership Reward Rank</span><br />
//                     <b className="fs-20 leaderRewardRank">
//                       {leaderRewardRankPercent}
//                     </b>
//                   </div> */}

//                   <div className="grid-item">
//                     <span>Total Staking Tokens</span><br />
//                     <b className="fs-20 staking_tokens">
//                       $ {staking.usd}
//                     </b><br />
//                     <b className="fs-10 staking_nrx">
//                       ( NRX {staking.nrx} )
//                     </b>
//                   </div>

//                 </div>
//               </div>

//               {/* RIGHT SIDE */}

//               <div className="col-md-6">

//                 <h3 className="newFont">
//                   Earn Consistent Returns Every Day – Reliable Mining for Smarter Growth
//                 </h3>

//                 <div className="row">
// <div className="col-sm-6">
//   <div className="spaceBetween">
//     <div className="attr_text">
//       Total Direct Referral
//       <Link to="/myPartners" className="bg nonselect" style={{ color: "#fff", fontSize: "10px", width: "19%" }}>
//         View
//       </Link> :
//     </div>
//     <div className="attr_text partnerCount">
//       {partnerCount}
//     </div>
//   </div>

//   <div className="spaceBetween">
//     <div className="attr_text">Total Direct Business :</div>
//     <div className="attr_text DirectStaked">
//       $ {directBusiness.usd} ( NRX {directBusiness.nrx} )
//     </div>
//   </div>
// </div>

// <div className="col-sm-6">
//   <div className="spaceBetween">
//     <div className="attr_text">
//       Total Team Size
//       <Link to="/level" className="bg nonselect" style={{ color: "#fff", fontSize: "10px", width: "19%" }}>
//         View
//       </Link> :
//     </div>
//     <div className="attr_text myTeamCount">
//       {teamCount}
//     </div>
//   </div>

//   <div className="spaceBetween">
//     <div className="attr_text">Total Team Business :</div>
//     <div className="attr_text totalTeambuisness">
//       $ {teamBusiness.usd} ( NRX {teamBusiness.nrx} )
//     </div>
//   </div>

//   <div className="spaceBetween">
//     <div className="attr_text">My ID :</div>
//     <div className="attr_text my_id">
//       {myId}
//     </div>
//   </div>
// </div>

//                   <div className="col-sm-7">
//                     <div className="spaceBetween">
//                       <div className="attr_text" style={{ fontSize: "12px" }}>
//                         Total Earning :
//                       </div>
//                       <div className="attr_text currentBusiness" style={{ fontSize: "12px" }}>
//                         {/* $ {currentBusiness.usd} ( NRX {currentBusiness.nrx} ) */}
//                         $ {totalEarn.usd} ( NRX {totalEarn.nrx} )
//                       </div>
//                     </div>
//                   </div>

// <div className="col-sm-7">
//                     <div className="spaceBetween">
//                       <div className="attr_text" style={{ fontSize: "12px" }}>
//                         Total Capping :
//                       </div>
//                       <div className="attr_text currentBusiness" style={{ fontSize: "12px" }}>
//                         {/* $ {currentBusiness.usd} ( NRX {currentBusiness.nrx} ) */}
//                         $ {totalCapping.usd}   ( NRX {totalCapping.nrx} )
//                       </div>
//                     </div>
//                   </div>



//                 </div>

//                 <hr />

//                 {/* ===== REFERRAL LINK (PHP SAME) ===== */}

//                 <div className="spaceBetween">
//                   {/* <input
//               className="baseInput referral-link refWidth"
//               readOnly
//               value={`https://nirmalx.io/signup.php?ref=${myId}`}
//             /> */}

//                   <input
//                     className="baseInput referral-link refWidth"
//                     readOnly
//                     value={`https://nirmalx.io/nirmalX_react_demo/register?ref=${myId}`}
//                     style={{
//                       color: "#000",
//                       backgroundColor: "#fff",
//                       opacity: 1,
//                       WebkitTextFillColor: "#000"
//                     }}
//                   />

//                   <span
//                     className="base_btn copy_ref"
//                     onClick={() => {
//                       navigator.clipboard.writeText(
//                         `https://nirmalx.io/nirmalX_react_demo/register?ref=${myId}`
//                       );
//                       toast.success("Copied!");
//                     }}
//                   >
//                     Copy
//                   </span>
//                 </div>

//                 <hr />

//                 {/* ===== LEADER REWARD ===== */}

//                 <div className="col-sm-12 d-flex justify-content-center">
//                   <div className="grid-item">
//                     <span className="fw-bold fs-5">
//                       <i className="fas fa-crown text-warning"></i> Leader's Reward
//                     </span><br />
//                     <b className="fs-20" id="leaders_reward">
//                       {leaderRewardLeft}
//                     </b>
//                   </div>
//                 </div>

//                 {/* ===== NRX LOCKER ===== */}

//                 <div className="col-sm-12 d-flex flex-column align-items-center justify-content-center grid-item">
//                   {/* <h3 className="newFont">
//                     <i className="fas fa-lock locker-icon"></i> NRX Locker
//                   </h3>

//                   <div className="d-flex align-items-center gap-4">
//                     <h6>Total NRX Locked :</h6>
//                     <h6 className="locked_nrx">
//                       {lockedNRX} NRX
//                     </h6>
//                   </div>

//                   <div className="d-flex align-items-center gap-4">
//                     <h6>Contract Link:</h6>
//                     <Link
//                       className="contract_link"
//                       target="_blank"
//                       to={`https://bscscan.com/address/${contracts?.LOCK_CONTRACT}`}
//                     >
//                       {contracts?.LOCK_CONTRACT
//                         ? contracts.LOCK_CONTRACT.slice(0, 6) +
//                         "..." +
//                         contracts.LOCK_CONTRACT.slice(-4)
//                         : ""}
//                     </Link>
//                   </div>

//                   <div className="unlocks">
//                     <Link className="connect_btn unlockWallet" to="/lockHistory">
//                       View
//                     </Link>
//                   </div> */}

//                 </div>
//               </div>
//             </div>

//           </div>
//           <Cards totalWithdraw={totalWithdraw} />
//         </div>
//       </div>
//     </>
//   );
// }

// export default Dashboard;









import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Header from "../components/user/Header";
import { ethers } from "ethers";
import { getMainContract } from "../utils/contract";
import Cards from "./Cards";

function Dashboard() {

  const { contracts, address } = useSelector((state) => state.wallet);

  const [available, setAvailable] = useState({ nrx: "0.0000", usd: "0.0000" });
  const [totalEarn, setTotalEarn] = useState({ nrx: "0.0000", usd: "0.0000" });
  const [levelIncome, setLevelIncome] = useState({ nrx: "0.0000", usd: "0.0000" });
  const [directIncome, setDirectIncome] = useState({ nrx: "0.0000", usd: "0.0000" });
  const [rankIncome, setRankIncome] = useState({ nrx: "0.0000", usd: "0.0000" });
  const [staking, setStaking] = useState({ nrx: "0.0000", usd: "0.0000" });
  const [totalWithdraw, setTotalWithdraw] = useState({ nrx: "0.0000", usd: "0.0000" });
  const [directBusiness, setDirectBusiness] = useState({ nrx: "0.00", usd: "0.00" });
  const [teamBusiness, setTeamBusiness] = useState({ nrx: "0.00", usd: "0.00" });
  const [totalCapping, setTotalCapping] = useState({ nrx: "0.0000", usd: "0.0000" });

  const [partnerCount, setPartnerCount] = useState("0");
  const [teamCount, setTeamCount] = useState("0");
  const [myId, setMyId] = useState("");
  const [rank, setRank] = useState("No Rank");
  const [offerTime, setOfferTime] = useState("Loading..");

  const priceRef = useRef(0);
  const deployRef = useRef(null);

  /* ================= LOAD FAST (ONE BATCH CALL) ================= */

  useEffect(() => {
    if (address && contracts?.MAIN_CONTRACT) {
      loadDashboard();
    }
  }, [address]);

  const loadDashboard = async () => {
    try {

      const main = await getMainContract(contracts.MAIN_CONTRACT);
      const one = ethers.parseUnits("1", 18);

      const [
        exists,
        user,
        details,
        priceRaw,
        withdrawnRaw,
        deployTime
      ] = await Promise.all([
        main.isUserExists(address),
        main.users(address),
        main.user_details(address),
        main.getTokenToUSDT(one),
        main._amountWithdrawn(address),
        main.deployTime()
      ]);

      if (!exists) {
        toast.error("Invalid User");
        return;
      }

      /* ===== EXACT PHP DIVISION ===== */

      const price = Number(priceRaw.toString()) / 1e18;
      priceRef.current = price;

      const toNRX = (v) => Number(v.toString()) / 1e18;
      const toUSD = (nrx) => nrx * price;

      /* ===== CORE VALUES ===== */

      const availableNRX = toNRX(user.balance);
      const totalNRX = toNRX(user.totalbalance);
      const levelNRX = toNRX(user.totalMiningLevelIncome);
      const directNRX = toNRX(user.totalDirectIncome);
      const rankNRX = toNRX(user.totalRankIncome);
      // const stakingNRX = toNRX(user.totalStaked);
      const withdrawnNRX = toNRX(withdrawnRaw);
      const totalCappingNRX = toNRX(user.toalCappingInNRX);

      // const directBizNRX = toNRX(details.DirectStaked);
      // const teamBizNRX = toNRX(details.totalTeambuisness);

      /* ===== STATE SET (PHP FORMAT) ===== */

      setAvailable({ nrx: availableNRX.toFixed(4), usd: toUSD(availableNRX).toFixed(4) });
      setTotalEarn({ nrx: totalNRX.toFixed(4), usd: toUSD(totalNRX).toFixed(4) });
      setLevelIncome({ nrx: levelNRX.toFixed(4), usd: toUSD(levelNRX).toFixed(4) });
      setDirectIncome({ nrx: directNRX.toFixed(4), usd: toUSD(directNRX).toFixed(4) });
      setRankIncome({ nrx: rankNRX.toFixed(4), usd: toUSD(rankNRX).toFixed(4) });
      // setStaking({ nrx: stakingNRX.toFixed(4), usd: toUSD(stakingNRX).toFixed(4) });
      /* ===== TOTAL STAKING TOKENS (PHP EXACT SAME) ===== */

      const totalNRXStaked =
        Number(user.totalNRXStaked.toString()) / 1e18;

      setStaking({
        nrx: totalNRXStaked.toFixed(4),
        usd: ""   // PHP me USD show nahi ho raha is section me
      });
      setTotalWithdraw({ nrx: withdrawnNRX.toFixed(4), usd: toUSD(withdrawnNRX).toFixed(4) });
      // setDirectBusiness({ nrx: directBizNRX.toFixed(2), usd: toUSD(directBizNRX).toFixed(2) });
      // setTeamBusiness({ nrx: teamBizNRX.toFixed(2), usd: toUSD(teamBizNRX).toFixed(2) });

      /* ===== DIRECT BUSINESS (PHP SAME) ===== */

      const directBusinessUSD =
        Number(details.DirectStaked.toString()) / 1e18;

      const directBusinessNRX =
        directBusinessUSD / price;

      setDirectBusiness({
        usd: directBusinessUSD.toFixed(2),
        nrx: directBusinessNRX.toFixed(2)
      });

      /* ===== TEAM BUSINESS (PHP SAME) ===== */

      const teamBusinessUSD =
        Number(details.totalTeambuisness.toString()) / 1e18;

      const teamBusinessNRX =
        teamBusinessUSD / price;

      setTeamBusiness({
        usd: teamBusinessUSD.toFixed(2),
        nrx: teamBusinessNRX.toFixed(2)
      });


      setTotalCapping({ nrx: totalCappingNRX.toFixed(4), usd: toUSD(totalCappingNRX).toFixed(4) });

      setPartnerCount(user.partnercount.toString());
      setTeamCount(details.myTeamCount.toString());
      setMyId(user.referralCode);

      const ranks = ["", "Pearl", "Sapphire", "Emerald", "Ruby", "Diamond", "Double Diamond"];
      const rankValue = parseInt(details.rank);
      setRank(rankValue > 0 ? ranks[rankValue] : "No Rank");

      deployRef.current = Number(deployTime);
      startCountdown();

    } catch (err) {
      console.error(err);
      toast.error("Dashboard Load Failed");
    }
  };

  /* ================= LIVE OFFER COUNTDOWN ================= */

  const startCountdown = () => {
    if (!deployRef.current) return;

    const start = new Date(deployRef.current * 1000);
    const future = new Date(start);
    future.setDate(future.getDate() + 60);

    const timer = setInterval(() => {
      const diff = future - new Date();
      if (diff <= 0) {
        setOfferTime("");
        clearInterval(timer);
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const d = Math.floor(totalSeconds / (60 * 60 * 24));
      const h = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      setOfferTime(`${d}d ${h}h ${m}m ${s}s`);

    }, 1000);
  };

  /* ================= UI (UNCHANGED DESIGN) ================= */

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
                    <span>Current Balance</span><br />
                    <b>NRX {available.nrx}</b><br />
                    <span>( $ {available.usd} )</span>
                  </div>

                  <div className="grid-item">
                    <span>Total Earning</span><br />
                    <b>NRX {totalEarn.nrx}</b><br />
                    <span>( $ {totalEarn.usd} )</span>
                  </div>

                  <div className="grid-item">
                    <span>Level Income</span><br />
                    <b>NRX {levelIncome.nrx}</b><br />
                    <span>( $ {levelIncome.usd} )</span>
                  </div>

                  <div className="grid-item">
                    <span>Direct Income</span><br />
                    <b>NRX {directIncome.nrx}</b><br />
                    <span>( $ {directIncome.usd} )</span>
                  </div>

                  <div className="grid-item">
                    <span>Rank Income</span><br />
                    <b>NRX {rankIncome.nrx}</b><br />
                    <span>( $ {rankIncome.usd} )</span>
                  </div>

                  <div className="grid-item">
                    <span>Current Rank</span><br />
                    <b>{rank}</b>
                  </div>

                  <div className="grid-item">
                    <span>Total Staking Tokens</span><br />
                    <b>NRX {staking.nrx}</b><br />
                    {/* <span>( $ {staking.usd} )</span> */}
                  </div>

                </div>
              </div>

              <div className="col-md-6">

                <h3 className="newFont">
                  Earn Consistent Returns Every Day – Reliable Mining for Smarter Growth
                </h3>




                <div className="row">
                  <div className="col-sm-6">
                    <div>Total Direct Referral   <Link to="/myPartners" className="bg nonselect" style={{ color: "#fff", fontSize: "10px", width: "19%" }}>
                      View
                    </Link> : {partnerCount}</div>
                    <div>Total Direct Business : $ {directBusiness.usd} ( NRX {directBusiness.nrx} )</div>
                  </div>

                  <div className="col-sm-6">
                    <div>Total Team Size <Link to="/level" className="bg nonselect" style={{ color: "#fff", fontSize: "10px", width: "19%" }}>
                      View
                    </Link> : {teamCount}</div>
                    <div>Total Team Business : $ {teamBusiness.usd} ( NRX {teamBusiness.nrx} )</div>
                    <div>My ID : {myId}</div>
            
                  </div>

                  <div className="col-sm-6">
                    <div>Total Earning : NRX {totalEarn.nrx} ( $ {totalEarn.usd} )</div>
                  </div>

 <div className="col-sm-6">
                    <div>Total Capping : NRX {totalCapping.nrx} ( $ {totalCapping.usd} )</div>
                  </div>
                 
                </div>

                {/* ===== REFERRAL LINK (PHP SAME) ===== */}

                <hr />

                <div className="spaceBetween">
                  <input
                    className="baseInput referral-link refWidth"
                    readOnly
                    value={`https://gm.nirmalx.io/gmnirmalX_react_demo/register?ref=${myId}`}
                    style={{
                      color: "#000",
                      backgroundColor: "#fff",
                      opacity: 1,
                      WebkitTextFillColor: "#000"
                    }}
                  />

                  <span
                    className="base_btn copy_ref"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://gm.nirmalx.io/gmnirmalX_react_demo/register?ref=${myId}`
                      );
                      toast.success("Copied!");
                    }}
                  >
                    Copy
                  </span>
                </div>

                {/* <hr /> */}

                <div className="col-sm-12 mt-3">
                  <div className="coin-desc">
                    <div className="col-sm-12 d-flex flex-column align-items-center justify-content-center grid-item">
                      <h3 className="newFont" style={{ color: "#ffc107" }}>
                        <i className="fas fa-hourglass-half me-2"></i>
                        OFFER COUNTDOWN
                      </h3>
                      <div className="d-flex align-items-center gap-4">
                        <h6 style={{ color: "#ffc107" }}>
                          60 - 50 Offer ends:
                        </h6>
                        <h6 style={{ color: "#ffc107" }}>
                          {offerTime || ""}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
          <Cards totalWithdraw={totalWithdraw} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;