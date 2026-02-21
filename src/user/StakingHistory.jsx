import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { getMainContract } from "../utils/contract";
import { toast } from "react-toastify";

function StakingHistory() {
  const { address, contracts } = useSelector(
    (state) => state.wallet
  );

  const [stakingData, setStakingData] =
    useState([]);
  const [loading, setLoading] =
    useState(false);
  const [currentPage, setCurrentPage] =
    useState(1);

  const pageSize = 25;

  useEffect(() => {
    if (address && contracts?.MAIN_CONTRACT) {
      loadStaking();
    }
  }, [address, currentPage]);

  /* ================= NRX Price ================= */

  const getNRX = async (main) => {
    try {
      const oneToken = ethers.parseUnits(
        "1",
        18
      );
      const price =
        await main.getTokenToUSDT(
          oneToken
        );
      return Number(
        ethers.formatUnits(price, 18)
      );
    } catch {
      return 1;
    }
  };

  /* ================= LOAD STAKING ================= */

  const loadStaking = async () => {
    try {
      setLoading(true);

      const main =
        await getMainContract(
          contracts.MAIN_CONTRACT
        );

      const exists =
        await main.isUserExists(
          address
        );

      if (!exists) {
        toast.error("User not found");
        setLoading(false);
        return;
      }

      const stakeList =
        await main.getUserStakingTransactions(
          address
        );

      if (!stakeList.length) {
        setStakingData([]);
        setLoading(false);
        return;
      }

      const startIndex =
        (currentPage - 1) * pageSize;
      const endIndex =
        startIndex + pageSize;

      const paginated =
        stakeList.slice(
          startIndex,
          endIndex
        );

      const nrxValue = await getNRX(main);

      const formatted =
        paginated.map((item) => {
          const amount = Number(
            ethers.formatUnits(
              item.amount,
              18
            )
          );

          const totalRoi = Number(
            ethers.formatUnits(
              item.totalRoi,
              18
            )
          );

          const totalCapitalReturn =
            Number(
              ethers.formatUnits(
                item.totalCapitalReturn,
                18
              )
            );

          const amountNRX =
            amount / nrxValue;

          const roiNRX =
            totalRoi / nrxValue;

          const capitalNRX =
            totalCapitalReturn /
            nrxValue;

          const date = new Date(
            Number(item.timestamp) *
              1000
          );

          const formattedDate =
            `${date.getFullYear()}-${String(
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

          let status =
            amount === 0
              ? "Capital Withdraw"
              : "On Going.";

          let packageName =
            item.stakeType === 1
              ? "Staking Package"
              : "--";

          let action =
            item.stakeType === 1
              ? "--"
              : amount === 0
              ? "Withdrawn"
              : "Capital Withdraw";

          return {
            id: item.id,
            amount,
            amountNRX,
            totalRoi,
            roiNRX,
            totalCapitalReturn,
            capitalNRX,
            date: formattedDate,
            status,
            packageName,
            action,
          };
        });

      setStakingData(formatted);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error loading stake list:",
        error
      );
      toast.error(
        "Error loading staking history"
      );
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="transaction-container">
      <h2>Staking History</h2>

      <table
        className="table transaction-table"
        style={{ color: "#ffffff" }}
      >
        <thead>
          <tr>
            <th>Stake ID</th>
            <th>Amount(USDT)</th>
            <th>Total ROI</th>
            <th>Total Capital Return</th>
            <th>Stake DateTime</th>
            <th>Status</th>
            <th>Package</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center">
                Loading...
              </td>
            </tr>
          ) : stakingData.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-warning">
                No records found.
              </td>
            </tr>
          ) : (
            stakingData.map(
              (row, index) => (
                <tr key={index}>
                  <td>{row.id}</td>

                  <td>
                    $ {row.amount.toFixed(4)} (
                    NRX{" "}
                    {row.amountNRX.toFixed(4)}
                    )
                  </td>

                  <td>
                    $ {row.totalRoi.toFixed(4)} (
                    NRX{" "}
                    {row.roiNRX.toFixed(4)})
                  </td>

                  <td>
                    $ {row.totalCapitalReturn.toFixed(
                      4
                    )}{" "}
                    ( NRX{" "}
                    {row.capitalNRX.toFixed(
                      4
                    )}
                    )
                  </td>

                  <td>{row.date}</td>

                  <td>
                    <div className="badge badge-outline-warning">
                      {row.status}
                    </div>
                  </td>

                  <td>
                    <div className="badge badge-outline-warning">
                      {row.packageName}
                    </div>
                  </td>

                  <td>
                    {row.action ===
                    "Capital Withdraw" ? (
                      <button className="btn btn-sm btn-primary">
                        Capital Withdraw
                      </button>
                    ) : (
                      row.action
                    )}
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="connect_btn"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(
              (prev) => prev - 1
            )
          }
        >
          Prev
        </button>

        <button
          className="connect_btn"
          onClick={() =>
            setCurrentPage(
              (prev) => prev + 1
            )
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default StakingHistory;