import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { getMainContract } from "../utils/contract";


function ApprovedStaking() {

  const { address, contracts } = useSelector((state) => state.wallet);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

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
      loadApproved();
    }
  }, [address, contracts]);

  const loadApproved = async () => {
    try {
      setLoading(true);

      const main = await getMainContract(contracts.MAIN_CONTRACT);

      const isUser = await main.isUserExists(address);
      if (!isUser) {
        toast.warning("User not found");
        setLoading(false);
        return;
      }

      const stakeList = await main.getAllUsersStakingTransactionsDesc();

      const addresses = stakeList.userAddresses;
      const allResults = stakeList.allResults;

      let tempRecords = [];

      for (let i = 0; i < addresses.length; i++) {
        const userAccount = addresses[i];
        const userStakings = allResults[i];
        if (!userStakings?.length) continue;

        const user = await main.users(userAccount);

        for (const staking of userStakings) {
          if (!staking.approved) continue; // ✅ Only approved

          tempRecords.push({
            userAccount,
            user,
            staking
          });
        }
      }

      // DESC order
      tempRecords.sort(
        (a, b) =>
          Number(b.staking.timestamp) -
          Number(a.staking.timestamp)
      );

      setRecords(tempRecords);
      setLoading(false);

    } catch (err) {
      console.error(err);
      toast.error("Error loading data");
      setLoading(false);
    }
  };

  return (
    <div className="transaction-container">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Approved Staking History</h2>

        <Link to="/pending-staking" className="btn btn-warning btn-sm">
          Pending Stakings
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table transaction-table">
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
                <td colSpan="12" className="text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && records.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center text-warning">
                  No records found.
                </td>
              </tr>
            )}

            {!loading &&
              records.map((item, index) => {

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
                          toast.success("Address copied");
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
                      <span className="badge badge-success">
                        Approved
                      </span>
                    </td>

                    <td>--</td>
                  </tr>
                );
              })}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApprovedStaking;