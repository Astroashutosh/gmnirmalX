import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getLockContract } from "../utils/contract";
import { useSelector } from "react-redux";

function LockHistory() {
  const { contracts } = useSelector((state) => state.wallet);

  const [locks, setLocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contracts?.LOCK_CONTRACT) {
      getLocks();
    }
  }, [contracts]);

  const getLocks = async () => {
    try {
      setLoading(true);

      const lockContract = await getLockContract(
        contracts.LOCK_CONTRACT
      );

      const latestLockId =
        await lockContract.latestLockId();

      let allLocks = [];

      for (let i = 1; i <= Number(latestLockId); i++) {
        const lock = await lockContract.locks(i);

        const amount = Number(
          ethers.formatUnits(lock.amount, 18)
        );

        const releaseTime =
          Number(lock.releaseTime) * 1000;

        allLocks.push({
          id: i,
          amount,
          locker: lock.locker,
          releaseTime,
          withdrawn: lock.withdrawn,
          description: lock.meta || "-",
        });
      }

      setLocks(allLocks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching locked history:", error);
      setLoading(false);
    }
  };

  /* ================= COUNTDOWN ================= */

  const getRemainingTime = (releaseTime) => {
    const now = Date.now();
    const diff = releaseTime - now;

    if (diff <= 0) return "Unlocked";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diff / (1000 * 60 * 60)) % 24
    );
    const minutes = Math.floor(
      (diff / (1000 * 60)) % 60
    );
    const seconds = Math.floor(
      (diff / 1000) % 60
    );

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  /* auto refresh every second */
  useEffect(() => {
    const interval = setInterval(() => {
      setLocks((prev) => [...prev]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="transaction-container">
      <div className="float-left">
        <h2>Locked History</h2>
      </div>

      <div className="table-responsive">
        <table
          className="table transaction-table"
          style={{ color: "#ffffff" }}
        >
          <thead>
            <tr>
              <th>S/No.</th>
              <th>Amount</th>
              <th>Locker</th>
              <th>Release Time</th>
              <th>Withdrawn</th>
              <th>Description</th>
              <th>Unlock Time</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">
                  Loading locked history...
                </td>
              </tr>
            ) : locks.length === 0 ? (
              <tr>
                <td colSpan="7">
                  No locks found
                </td>
              </tr>
            ) : (
              locks.map((lock) => (
                <tr key={lock.id}>
                  <td>{lock.id}</td>

                  <td>
                    {lock.amount.toLocaleString()} NRX
                  </td>

                  <td>
                    <a
                      href={`https://bscscan.com/address/${lock.locker}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {lock.locker.substring(0, 6)}
                      ...
                      {lock.locker.substring(
                        lock.locker.length - 4
                      )}
                    </a>
                  </td>

                  <td>
                    {new Date(
                      lock.releaseTime
                    ).toLocaleString()}
                  </td>

                  <td>
                    {lock.withdrawn ? "Yes" : "No"}
                  </td>

                  <td>{lock.description}</td>

                  <td>
                    {getRemainingTime(
                      lock.releaseTime
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LockHistory;