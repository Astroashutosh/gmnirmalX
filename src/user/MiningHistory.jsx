

import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { getMainContract } from "../utils/contract";
import { toast } from "react-toastify";

function MiningHistory() {
  const { address, contracts } = useSelector(
    (state) => state.wallet
  );

  const [roiData, setRoiData] = useState([]);
  const [loading, setLoading] = useState(false);

  const pageSize = 25; // same as PHP

  /* ================= NRX PRICE (PHP EXACT) ================= */

  const fetchNRXPrice = async (main) => {
    try {
      const one = ethers.parseUnits("1", 18);
      const priceRaw = await main.getTokenToUSDT(one);
      return Number(ethers.formatUnits(priceRaw, 18));
    } catch {
      return 1;
    }
  };

  /* ================= LOAD ROI ================= */

  const loadROI = useCallback(async () => {
    if (!address) return;

    try {
      setLoading(true);

      const main = await getMainContract(
        contracts.MAIN_CONTRACT
      );

      const [exists, roiList, price] =
        await Promise.all([
          main.isUserExists(address),
          main.getUserROITransactions(address),
          fetchNRXPrice(main),
        ]);

      if (!exists) {
        toast.error("User not found");
        setLoading(false);
        return;
      }

      if (!roiList.length) {
        setRoiData([]);
        setLoading(false);
        return;
      }

      /* ===== SAME AS PHP (ONLY FIRST 25) ===== */
      const limitedData = roiList.slice(0, pageSize);

      const formatted = limitedData.map((item) => {
        const stakeAmount =
          Number(item.stakeamount) / 1e18;

        const roiAmount =
          Number(item.roiamount) / 1e18;

        const stakeNRX =
          stakeAmount / price;

        const roiNRX =
          roiAmount / price;

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
          id: Number(item.stakeid),
          stakeAmount,
          stakeNRX,
          roiAmount,
          roiNRX,
          date: formattedDate,
        };
      });

      setRoiData(formatted);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Error loading ROI history");
      setLoading(false);
    }
  }, [address, contracts]);

  useEffect(() => {
    loadROI();
  }, [loadROI]);

  /* ================= UI ================= */

  return (
    <div className="transaction-container">
      <h2>ROI History</h2>

      <table
        className="table transaction-table"
        style={{ color: "#ffffff" }}
      >
        <thead>
          <tr>
            <th> ID</th>
            <th>Stake Amount</th>
            <th>ROI Amount</th>
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
            roiData.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>

                <td>
                  NRX {row.stakeAmount.toFixed(4)} 
                  {/* (NRX {row.stakeNRX.toFixed(4)}) */}
                </td>

                <td>
                  NRX {row.roiAmount.toFixed(4)} 
                 {/* ( NRX {row.roiNRX.toFixed(4)}) */}
                </td>

                <td>{row.date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MiningHistory;