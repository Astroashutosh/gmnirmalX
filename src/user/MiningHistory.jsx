import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { getMainContract } from "../utils/contract";
import { toast } from "react-toastify";

function MiningHistory() {
  const { address2, contracts } = useSelector(
    (state) => state.wallet
  );
      let address = "0x2c50670e45Fd9C6347630c733BF1B3d76cdFCd1d";

  const [roiData, setRoiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] =
    useState(1);

  const pageSize = 10;

  useEffect(() => {
    if (address && contracts?.MAIN_CONTRACT) {
      loadROI();
    }
  }, [address, currentPage]);

  const getNRX = async (main) => {
    try {
      const oneToken = ethers.parseUnits("1", 18);
      const price =
        await main.getTokenToUSDT(oneToken);
      return Number(
        ethers.formatUnits(price, 18)
      );
    } catch {
      return 1;
    }
  };

  const loadROI = async () => {
    try {
      setLoading(true);

      const main =
        await getMainContract(
          contracts.MAIN_CONTRACT
        );

      const exists =
        await main.isUserExists(address);

      if (!exists) {
        toast.error("User not found");
        setLoading(false);
        return;
      }

      const stakeList =
        await main.getUserROITransactions(
          address
        );

      if (!stakeList.length) {
        setRoiData([]);
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

      const formatted = paginated.map(
        (item) => {
          const stakeAmount = Number(
            ethers.formatUnits(
              item.stakeamount,
              18
            )
          );

          const roiAmount = Number(
            ethers.formatUnits(
              item.roiamount,
              18
            )
          );

          const stakeNRX =
            stakeAmount / nrxValue;

          const roiNRX =
            roiAmount / nrxValue;

          const date = new Date(
            Number(item.timestamp) * 1000
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

          return {
            id: item.stakeid,
            stakeAmount,
            stakeNRX,
            roiAmount,
            roiNRX,
            date: formattedDate,
          };
        }
      );

      setRoiData(formatted);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error loading ROI data:",
        error
      );
      toast.error(
        "Error loading Mining History"
      );
      setLoading(false);
    }
  };

  return (
    <div className="transaction-container">
      <h2>Mining History</h2>

      <table
        className="table transaction-table"
        style={{ color: "#ffffff" }}
      >
        <thead>
          <tr>
            <th>Stake ID</th>
            <th>Stake Amount</th>
            <th>Mining Amount</th>
            <th>DateTime</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center">
                Loading...
              </td>
            </tr>
          ) : roiData.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-warning">
                No ROI records found.
              </td>
            </tr>
          ) : (
            roiData.map((row, i) => (
              <tr key={i}>
                <td>{row.id}</td>

                <td>
                  $ {row.stakeAmount.toFixed(4)} (
                  NRX {row.stakeNRX.toFixed(4)})
                </td>

                <td>
                  $ {row.roiAmount.toFixed(4)} (
                  NRX {row.roiNRX.toFixed(4)})
                </td>

                <td>{row.date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Buttons */}
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

export default MiningHistory;