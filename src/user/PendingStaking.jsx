// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { ethers } from "ethers";
// import { toast } from "react-toastify";
// import { getMainContract } from "../utils/contract";
// import { Link } from "react-router-dom";


// function PendingStaking() {

//     const { address, contracts } = useSelector((state) => state.wallet);
//     const [records, setRecords] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const safeFormat = (val) => {
//         try {
//             if (!val) return 0;
//             return Number(ethers.formatUnits(val, 18));
//         } catch {
//             return 0;
//         }
//     };

//     useEffect(() => {
//         if (address && contracts?.MAIN_CONTRACT) {
//             loadStakingRequests(false);
//         }
//     }, [address, contracts]);

//     const loadStakingRequests = async (approvedStatus) => {
//         try {
//             setLoading(true);

//             const main = await getMainContract(contracts.MAIN_CONTRACT);

//             const isUser = await main.isUserExists(address);
//             if (!isUser) {
//                 toast.warning("User not found");
//                 setLoading(false);
//                 return;
//             }

//             const stakeList = await main.getAllUsersStakingTransactionsDesc();

//             const addresses = stakeList.userAddresses;
//             const allResults = stakeList.allResults;

//             let tempRecords = [];

//             for (let i = 0; i < addresses.length; i++) {
//                 const userAccount = addresses[i];
//                 const userStakings = allResults[i];
//                 if (!userStakings?.length) continue;

//                 const user = await main.users(userAccount);

//                 for (const staking of userStakings) {
//                     if (staking.approved !== approvedStatus) continue;

//                     tempRecords.push({
//                         userAccount,
//                         user,
//                         staking
//                     });
//                 }
//             }

//             tempRecords.sort(
//                 (a, b) =>
//                     Number(b.staking.timestamp) -
//                     Number(a.staking.timestamp)
//             );

//             setRecords(tempRecords);
//             setLoading(false);

//         } catch (err) {
//             console.error(err);
//             toast.error("Error loading data");
//             setLoading(false);
//         }
//     };

//     const approveStaking = async (userAccount, id) => {
//         try {
//             const main = await getMainContract(contracts.MAIN_CONTRACT);

//             const tx = await main.approveStaking(userAccount, id);
//             await tx.wait();

//             toast.success("Approved Successfully");
//             loadStakingRequests(false);

//         } catch (err) {
//             console.error(err);
//             toast.error("Approval failed");
//         }
//     };

//     return (
//         <div className="transaction-container">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h2 className="mb-0">Pending Staking History</h2>

//                 <Link to="/approved-staking" className="btn btn-success btn-sm">
//                     Approved Stakings
//                 </Link>
//             </div>

//             <div className="table-responsive">
//                 <table className="table transaction-table">
//                     <thead>
//                         <tr>
//                             <th>User ID</th>
//                             <th>Address</th>
//                             <th>Amount(USDT)</th>
//                             <th>Monthly NRX</th>
//                             <th>Total ROI</th>
//                             <th>Gold (%)</th>
//                             <th>NRX (%)</th>
//                             <th>NRX Reserved</th>
//                             <th>ROI Paid Months</th>
//                             <th>Stake DateTime</th>
//                             <th>Status</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>

//                     <tbody>

//                         {loading && (
//                             <tr>
//                                 <td colSpan="12" className="text-center">
//                                     Loading...
//                                 </td>
//                             </tr>
//                         )}

//                         {!loading && records.length === 0 && (
//                             <tr>
//                                 <td colSpan="12" className="text-center text-warning">
//                                     No records found.
//                                 </td>
//                             </tr>
//                         )}

//                         {!loading &&
//                             records.map((item, index) => {

//                                 const staking = item.staking;
//                                 const user = item.user;
//                                 const userAccount = item.userAccount;

//                                 return (
//                                     <tr key={index} className="text-white">
//                                         <td>{user.referralCode}</td>

//                                         <td>
//                                             <span style={{ fontFamily: "monospace", marginRight: 8 }}>
//                                                 {userAccount.slice(0, 6)}....
//                                                 {userAccount.slice(-4)}
//                                             </span>
//                                             <i
//                                                 className="fa fa-copy"
//                                                 style={{ cursor: "pointer", color: "#b0b3b8" }}
//                                                 onClick={() => {
//                                                     navigator.clipboard.writeText(userAccount);
//                                                     toast.success("Address copied");
//                                                 }}
//                                             />
//                                         </td>

//                                         <td>$ {safeFormat(staking.amount).toFixed(4)}</td>
//                                         <td>NRX {safeFormat(staking.monthlyNRX).toFixed(4)}</td>
//                                         <td>NRX {safeFormat(staking.totalRoi).toFixed(4)}</td>
//                                         <td>{staking.goldPercent || 0}</td>
//                                         <td>{staking.nrxPercent || 0}</td>
//                                         <td>NRX {safeFormat(staking.nrxReserved).toFixed(4)}</td>
//                                         <td>{staking.roiPaidMonths || 0}</td>

//                                         <td>
//                                             {staking.timestamp
//                                                 ? new Date(
//                                                     Number(staking.timestamp) * 1000
//                                                 ).toLocaleString()
//                                                 : "--"}
//                                         </td>

//                                         <td>
//                                             {staking.approved ? (
//                                                 <span className="badge badge-success">
//                                                     Approved
//                                                 </span>
//                                             ) : (
//                                                 <span className="badge badge-warning">
//                                                     Pending
//                                                 </span>
//                                             )}
//                                         </td>

//                                         <td>
//                                             {!staking.approved && (
//                                                 <button
//                                                     className="btn btn-sm btn-primary"
//                                                     onClick={() =>
//                                                         approveStaking(
//                                                             userAccount,
//                                                             Number(staking.id) - 1
//                                                         )
//                                                     }
//                                                 >
//                                                     Approve
//                                                 </button>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// export default PendingStaking;





import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { getMainContract } from "../utils/contract";
// import "./staking.css";

function StakingRequests() {

  const { address, contracts } = useSelector((state) => state.wallet);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApproved, setShowApproved] = useState(false);

  /* ===== SAFE FORMAT ===== */
  const safeFormat = (val) => {
    try {
      if (!val) return 0;
      return Number(ethers.formatUnits(val, 18));
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    if (address && contracts?.MAIN_CONTRACT) {
      loadData();
    }
  }, [address, contracts]);

  /* ===== RATE LIMIT SAFE + OPTIMIZED ===== */
  const loadData = async () => {
    try {
      setLoading(true);

      const main = await getMainContract(contracts.MAIN_CONTRACT);

      const stakeList = await main.getAllUsersStakingTransactionsDesc();

      const addresses = stakeList.userAddresses;
      const allResults = stakeList.allResults;

      let tempRecords = [];

      /* 🔥 SAFE SEQUENTIAL FETCH (NO RATE LIMIT) */
      for (let i = 0; i < addresses.length; i++) {

        const userAccount = addresses[i];
        const userStakings = allResults[i];

        if (!userStakings?.length) continue;

        const user = await main.users(userAccount);

        for (const staking of userStakings) {
          tempRecords.push({
            userAccount,
            user,
            staking
          });
        }

        /* small delay to avoid RPC flood */
        await new Promise(res => setTimeout(res, 80));
      }

      /* 🔥 DESC SORT (LATEST FIRST) */
      tempRecords.sort(
        (a, b) =>
          Number(b.staking.timestamp) -
          Number(a.staking.timestamp)
      );

      setRecords(tempRecords);
      setLoading(false);

    } catch (err) {
      console.error(err);
      toast.error("Error loading staking data");
      setLoading(false);
    }
  };

  /* 🔥 MEMO FILTER (FAST SWITCHING) */
  const filteredRecords = useMemo(() => {
    return records.filter(r =>
      showApproved
        ? r.staking.approved
        : !r.staking.approved
    );
  }, [records, showApproved]);

  const approveStaking = async (userAccount, id) => {
    try {
      const main = await getMainContract(contracts.MAIN_CONTRACT);

      const tx = await main.approveStaking(userAccount, id);
      await tx.wait();

      toast.success("Approved Successfully");

      loadData();

    } catch (err) {
      console.error(err);
      toast.error("Approval failed");
    }
  };

  return (
    <div className="transaction-container">

      {/* ===== HEADER + TOGGLE ===== */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 text-white">
          {showApproved
            ? "Approved Staking History"
            : "Pending Staking History"}
        </h2>

        <button
          className={`btn btn-sm ${
            showApproved ? "btn-warning" : "btn-success"
          }`}
          onClick={() => setShowApproved(!showApproved)}
        >
          {showApproved ? "Show Pending" : "Show Approved"}
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="table-responsive">
        <table className="table transaction-table text-white">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Address</th>
              <th>Amount (USDT)</th>
              <th>Monthly NRX</th>
              <th>Total ROI</th>
              <th>Gold (%)</th>
              <th>NRX (%)</th>
              <th>NRX Reserved</th>
              <th>ROI Paid Months</th>
              <th>Stake DateTime</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan="12" className="text-center text-white">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && filteredRecords.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center text-warning">
                  No records found.
                </td>
              </tr>
            )}

            {!loading &&
              filteredRecords.map((item, index) => {

                const staking = item.staking;
                const user = item.user;
                const userAccount = item.userAccount;

                return (
                  <tr key={index}>
                    <td>{user.referralCode}</td>

                    <td>
                      <span style={{ fontFamily: "monospace", marginRight: 8 }}>
                        {userAccount.slice(0, 6)}....
                        {userAccount.slice(-4)}
                      </span>
                      <i
                        className="fa fa-copy"
                        style={{ cursor: "pointer", color: "#b0b3b8" }}
                        onClick={() => {
                          navigator.clipboard.writeText(userAccount);
                          toast.success("Copied");
                        }}
                      />
                    </td>

                    <td>$ {safeFormat(staking.amount).toFixed(4)}</td>
                    <td>NRX {safeFormat(staking.monthlyNRX).toFixed(4)}</td>
                    <td>NRX {safeFormat(staking.totalRoi).toFixed(4)}</td>
                    <td>{staking.goldPercent || 0}</td>
                    <td>{staking.nrxPercent || 0}</td>
                    <td>NRX {safeFormat(staking.nrxReserved).toFixed(4)}</td>
                    <td>{staking.roiPaidMonths || 0}</td>

                    <td>
                      {staking.timestamp
                        ? new Date(
                            Number(staking.timestamp) * 1000
                          ).toLocaleString()
                        : "--"}
                    </td>

                    <td>
                      {staking.approved ? (
                        <span className="badge bg-success">
                          Approved
                        </span>
                      ) : (
                        <span className="badge bg-warning text-dark">
                          Pending
                        </span>
                      )}
                    </td>

                    <td>
                      {!staking.approved && !showApproved ? (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            approveStaking(
                              userAccount,
                              Number(staking.id) - 1
                            )
                          }
                        >
                          Approve
                        </button>
                      ) : (
                        "--"
                      )}
                    </td>
                  </tr>
                );
              })}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StakingRequests;