
// import React, { useEffect, useState, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { ethers } from "ethers";
// import { getMainContract } from "../utils/contract";
// import { toast } from "react-toastify";

// function MiningHistory() {
//   const { address, contracts } = useSelector(
//     (state) => state.wallet
//   );

//   const [roiData, setRoiData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const pageSize = 25; // same as PHP

//   /* ================= NRX PRICE (PHP EXACT) ================= */

//   const fetchNRXPrice = async (main) => {
//     try {
//       const one = ethers.parseUnits("1", 18);
//       const priceRaw = await main.getTokenToUSDT(one);
//       return Number(ethers.formatUnits(priceRaw, 18));
//     } catch {
//       return 1;
//     }
//   };

//   /* ================= LOAD ROI ================= */

//   const loadROI = useCallback(async () => {
//     if (!address) return;

//     try {
//       setLoading(true);

//       const main = await getMainContract(
//         contracts.MAIN_CONTRACT
//       );

//       const [exists, roiList, price] =
//         await Promise.all([
//           main.isUserExists(address),
//           main.getUserROITransactions(address),
//           fetchNRXPrice(main),
//         ]);

//       if (!exists) {
//         toast.error("User not found");
//         setLoading(false);
//         return;
//       }

//       if (!roiList.length) {
//         setRoiData([]);
//         setLoading(false);
//         return;
//       }

//       /* ===== SAME AS PHP (ONLY FIRST 25) ===== */
//       const limitedData = roiList.slice(0, pageSize);

//       const formatted = limitedData.map((item) => {
//         const stakeAmount =
//           Number(item.stakeamount) / 1e18;

//         const roiAmount =
//           Number(item.roiamount) / 1e18;

//         const stakeNRX =
//           stakeAmount / price;

//         const roiNRX =
//           roiAmount / price;

//         const date = new Date(
//           Number(item.timestamp) * 1000
//         );

//         const formattedDate =
//           `${date.getFullYear()}-${String(
//             date.getMonth() + 1
//           ).padStart(2, "0")}-${String(
//             date.getDate()
//           ).padStart(2, "0")} ${String(
//             date.getHours()
//           ).padStart(2, "0")}:${String(
//             date.getMinutes()
//           ).padStart(2, "0")}:${String(
//             date.getSeconds()
//           ).padStart(2, "0")}`;

//         return {
//           id: Number(item.stakeid),
//           stakeAmount,
//           stakeNRX,
//           roiAmount,
//           roiNRX,
//           date: formattedDate,
//         };
//       });

//       setRoiData(formatted);
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       toast.error("Error loading ROI history");
//       setLoading(false);
//     }
//   }, [address, contracts]);

//   useEffect(() => {
//     loadROI();
//   }, [loadROI]);

//   /* ================= UI ================= */

//   return (
//     <div className="transaction-container">
//       <h2>Mining History</h2>

//       <table
//         className="table transaction-table"
//         style={{ color: "#ffffff" }}
//       >
//         <thead>
//           <tr>
//             <th>Stake ID</th>
//             <th>Stake Amount</th>
//             <th>Mining Amount</th>
//             <th>DateTime</th>
//           </tr>
//         </thead>

//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan="4" className="text-center">
//                 Loading...
//               </td>
//             </tr>
//           ) : roiData.length === 0 ? (
//             <tr>
//               <td colSpan="4" className="text-center text-warning">
//                 No ROI records found.
//               </td>
//             </tr>
//           ) : (
//             roiData.map((row) => (
//               <tr key={row.id}>
//                 <td>{row.id}</td>

//                 <td>
//                   $ {row.stakeAmount.toFixed(4)} (
//                   NRX {row.stakeNRX.toFixed(4)})
//                 </td>

//                 <td>
//                   $ {row.roiAmount.toFixed(4)} (
//                   NRX {row.roiNRX.toFixed(4)})
//                 </td>

//                 <td>{row.date}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default MiningHistory;





// import React, { useEffect, useState, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { ethers } from "ethers";
// import { getMainContract } from "../utils/contract";
// import { toast } from "react-toastify";

// function StakingHistory() {
//   const { address, contracts } = useSelector(
//     (state) => state.wallet
//   );

//   const [stakingData, setStakingData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [withdrawingId, setWithdrawingId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [nrxPrice, setNrxPrice] = useState(1);

//   const pageSize = 25;

//   /* ================= FETCH NRX PRICE (PHP EXACT) ================= */

//   const fetchNRXPrice = async (main) => {
//     try {
//       const oneToken = ethers.parseUnits("1", 18);
//       const priceRaw = await main.getTokenToUSDT(oneToken);
//       const scaled = Number(
//         ethers.formatUnits(priceRaw, 18)
//       );
//       setNrxPrice(scaled);
//       return scaled;
//     } catch {
//       return 1;
//     }
//   };

//   /* ================= LOAD STAKING ================= */

//   const loadStaking = useCallback(async () => {
//     if (!address) return;

//     try {
//       setLoading(true);

//       const main = await getMainContract(
//         contracts.MAIN_CONTRACT
//       );

//       /* ---- Parallel Calls ---- */
//       const [exists, stakeList, price] =
//         await Promise.all([
//           main.isUserExists(address),
//           main.getUserStakingTransactions(address),
//           fetchNRXPrice(main),
//         ]);

//       if (!exists) {
//         toast.error("User not found");
//         setLoading(false);
//         return;
//       }

//       if (!stakeList.length) {
//         setStakingData([]);
//         setLoading(false);
//         return;
//       }

//       const startIndex =
//         (currentPage - 1) * pageSize;
//       const endIndex =
//         startIndex + pageSize;

//       const paginated = stakeList.slice(
//         startIndex,
//         endIndex
//       );

//       const formatted = paginated.map((item) => {
//         /* ==== EXACT PHP STYLE CALC ==== */
//         const amount =
//           Number(item.amount) / 1e18;

//         const totalRoi =
//           Number(item.totalRoi) / 1e18;

//         const totalCapitalReturn =
//           Number(item.totalCapitalReturn) /
//           1e18;

//         const amountNRX =
//           amount / price;

//         const roiNRX =
//           totalRoi / price;

//         const capitalNRX =
//           totalCapitalReturn / price;

//         const date = new Date(
//           Number(item.timestamp) * 1000
//         );

//         const formattedDate =
//           `${date.getFullYear()}-${String(
//             date.getMonth() + 1
//           ).padStart(2, "0")}-${String(
//             date.getDate()
//           ).padStart(2, "0")} ${String(
//             date.getHours()
//           ).padStart(2, "0")}:${String(
//             date.getMinutes()
//           ).padStart(2, "0")}:${String(
//             date.getSeconds()
//           ).padStart(2, "0")}`;

//         /* ==== EXACT PHP STATUS ==== */
//         const status =
//           amount === 0
//             ? "Capital Withdraw"
//             : "On Going.";

//         const stakeType =
//           Number(item.stakeType);

//         let packageName =
//           stakeType === 1
//             ? "Staking Package"
//             : "--";

//         let action;

//         if (stakeType === 1) {
//           action = "--";
//         } else {
//           if (amount === 0) {
//             action = "Withdrawn";
//           } else {
//             action = "Capital Withdraw";
//           }
//         }

//         return {
//           id: Number(item.id),
//           amount,
//           amountNRX,
//           totalRoi,
//           roiNRX,
//           totalCapitalReturn,
//           capitalNRX,
//           date: formattedDate,
//           status,
//           packageName,
//           action,
//         };
//       });

//       setStakingData(formatted);
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       toast.error(
//         "Error loading staking history"
//       );
//       setLoading(false);
//     }
//   }, [address, currentPage, contracts]);

//   useEffect(() => {
//     loadStaking();
//   }, [loadStaking]);

//   /* ================= WITHDRAW ================= */

//   const handleCapitalWithdraw = async (
//     stakeId
//   ) => {
//     try {
//       const confirmWithdraw =
//         window.confirm(
//           "Are you sure for capital withdraw?"
//         );

//       if (!confirmWithdraw) return;

//       setWithdrawingId(stakeId);

//       const main = await getMainContract(
//         contracts.MAIN_CONTRACT
//       );

//       const tx =
//         await main.withdrawCapital(
//           stakeId
//         );

//       await tx.wait();

//       toast.success(
//         "Successfully withdrawn"
//       );

//       loadStaking();
//     } catch (error) {
//       console.error(error);
//       toast.error(
//         "Transaction failed or rejected"
//       );
//     } finally {
//       setWithdrawingId(null);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="transaction-container">
//       <h2>Staking History</h2>

//       <table
//         className="table transaction-table"
//         style={{ color: "#ffffff" }}
//       >
//         <thead>
//           <tr>
//             <th>Stake ID</th>
//             <th>Amount(USDT)</th>
//             <th>Total ROI</th>
//             <th>Total Capital Return</th>
//             <th>Stake DateTime</th>
//             <th>Status</th>
//             <th>Package</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan="8" className="text-center">
//                 Loading...
//               </td>
//             </tr>
//           ) : stakingData.length === 0 ? (
//             <tr>
//               <td colSpan="8" className="text-center text-warning">
//                 No records found.
//               </td>
//             </tr>
//           ) : (
//             stakingData.map((row) => (
//               <tr key={row.id}>
//                 <td>{row.id}</td>

//                 <td>
//                   $ {row.amount.toFixed(4)} (
//                   NRX {row.amountNRX.toFixed(4)})
//                 </td>

//                 <td>
//                   $ {row.totalRoi.toFixed(4)} (
//                   NRX {row.roiNRX.toFixed(4)})
//                 </td>

//                 <td>
//                   $ {row.totalCapitalReturn.toFixed(
//                     4
//                   )}{" "}
//                   ( NRX{" "}
//                   {row.capitalNRX.toFixed(4)})
//                 </td>

//                 <td>{row.date}</td>

//                 <td>
//                   <div className="badge badge-outline-warning">
//                     {row.status}
//                   </div>
//                 </td>

//                 <td>
//                   <div className="badge badge-outline-warning">
//                     {row.packageName}
//                   </div>
//                 </td>

//                 <td>
//                   {row.action ===
//                   "Capital Withdraw" ? (
//                     <button
//                       className="btn btn-sm btn-primary"
//                       disabled={
//                         withdrawingId ===
//                         row.id
//                       }
//                       onClick={() =>
//                         handleCapitalWithdraw(
//                           row.id
//                         )
//                       }
//                     >
//                       {withdrawingId ===
//                       row.id
//                         ? "Processing..."
//                         : "Capital Withdraw"}
//                     </button>
//                   ) : row.action ===
//                     "Withdrawn" ? (
//                     <div className="badge badge-outline-success">
//                       Withdrawn
//                     </div>
//                   ) : (
//                     "--"
//                   )}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       <div className="d-flex justify-content-between mt-3">
//         <button
//           className="connect_btn"
//           disabled={currentPage === 1}
//           onClick={() =>
//             setCurrentPage(
//               (prev) => prev - 1
//             )
//           }
//         >
//           Prev
//         </button>

//         <button
//           className="connect_btn"
//           onClick={() =>
//             setCurrentPage(
//               (prev) => prev + 1
//             )
//           }
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default StakingHistory;



import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { getMainContract } from "../utils/contract";
import { toast } from "react-toastify";

function StakingHistory() {
  const { address, contracts } = useSelector(
    (state) => state.wallet
  );

  const [stakingData, setStakingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 25;

  /* ===== GET NRX PRICE (Same PHP getNRX(1)) ===== */
  const getNRXPrice = async (main) => {
    try {
      const one = ethers.parseUnits("1", 18);
      const priceRaw = await main.getTokenToUSDT(one);
      return Number(ethers.formatUnits(priceRaw, 18));
    } catch {
      return 1;
    }
  };

  const loadStaking = useCallback(async () => {
    if (!address) return;

    try {
      setLoading(true);

      const main = await getMainContract(
        contracts.MAIN_CONTRACT
      );

      const exists = await main.isUserExists(address);

      if (!exists) {
        setStakingData([]);
        setLoading(false);
        return;
      }

      const stakeList =
        await main.getUserStakingTransactions(address);

      const nrxPrice = await getNRXPrice(main);

      const startIndex =
        (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      const paginated = stakeList.slice(
        startIndex,
        endIndex
      );

      if (!paginated.length) {
        setStakingData([]);
        setLoading(false);
        return;
      }

      const formatted = paginated.map(
        (data, index) => {
          const amount =
            Number(data.amount) / 1e18;

          const amountNRX =
            amount / nrxPrice;

          const monthlyNRX =
            Number(data.monthlyNRX) / 1e18;

          const totalRoi =
            Number(data.totalRoi) / 1e18;

          const nrxReserved =
            Number(data.nrxReserved) / 1e18;

          const roiPaidMonths =
            Number(data.roiPaidMonths);

          const goldPercent =
            Number(data.goldPercent);

          const nrxPercent =
            Number(data.nrxPercent);

          let formattedDate = "";

          if (data.timestamp) {
            const date = new Date(
              Number(data.timestamp) * 1000
            );

            formattedDate = `${date.getFullYear()}-${String(
              date.getMonth() + 1
            ).padStart(2, "0")}-${String(
              date.getDate()
            ).padStart(2, "0")} ${String(
              date.getHours()
            ).padStart(2, "0")}:${String(
              date.getMinutes()
            ).padStart(2, "0")}:${String(
              date.getSeconds()
            ).padStart(2, "0")}`;
          }

          const status =
            data.approved === false
              ? "Pending"
              : "Approved";

          return {
            id: startIndex + index + 1,
            amount,
            amountNRX,
            monthlyNRX,
            totalRoi,
            goldPercent,
            nrxPercent,
            nrxReserved,
            roiPaidMonths,
            formattedDate,
            status,
          };
        }
      );

      setStakingData(formatted);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Error loading data.");
      setLoading(false);
    }
  }, [address, currentPage, contracts]);

  useEffect(() => {
    loadStaking();
  }, [loadStaking]);

  return (
    <div className="transaction-container">
      <h2>Staking History</h2>

      <table
        className="table transaction-table"
        style={{ color: "#ffffff" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount(USDT)</th>
            <th>Monthly NRX</th>
            <th>Total ROI</th>
            <th>Gold (%)</th>
            <th>NRX (%)</th>
            <th>NRX Reserved</th>
            <th>ROI Paid Months</th>
            <th>Stake DateTime</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="10" className="text-center">
                Loading...
              </td>
            </tr>
          ) : stakingData.length === 0 ? (
            <tr>
              <td
                colSpan="10"
                className="text-center text-warning"
              >
                No records found.
              </td>
            </tr>
          ) : (
            stakingData.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>

                <td>
                  $ {row.amount.toFixed(4)} (
                  NRX{" "}
                  {row.amountNRX.toFixed(4)})
                </td>

                <td>
                  NRX{" "}
                  {row.monthlyNRX.toFixed(4)}
                </td>

                <td>
                  NRX{" "}
                  {row.totalRoi.toFixed(4)}
                </td>

                <td>{row.goldPercent}</td>

                <td>{row.nrxPercent}</td>

                <td>
                  NRX{" "}
                  {row.nrxReserved.toFixed(4)}
                </td>

                <td>{row.roiPaidMonths}</td>

                <td>{row.formattedDate}</td>

                <td>
                  <div className="badge badge-outline-warning">
                    {row.status}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mt-3">
        <button
          className="connect_btn"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage((prev) => prev - 1)
          }
        >
          Prev
        </button>

        <button
          className="connect_btn"
          onClick={() =>
            setCurrentPage((prev) => prev + 1)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default StakingHistory;