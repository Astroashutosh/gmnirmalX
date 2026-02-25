// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { ethers } from "ethers";
// import { getMainContract, getSigner } from "../utils/contract";
// import { toast } from "react-toastify";
// function Level() {
//   const { address,contracts } = useSelector((state) => state.wallet);

//   const [selectedLevel, setSelectedLevel] = useState(1);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (contracts?.MAIN_CONTRACT) {
//       loadLevelUsers(selectedLevel);
//     }
//   }, [selectedLevel, contracts]);

//   /* ================= LEVEL USERS ================= */

// //   const loadLevelUsers = async (level) => {
// //     try {
// //       setLoading(true);
// //       setUsers([]);

// //       const signer = await getSigner();
// //       const account = await signer.getAddress();
// //       // const account = "0xc56eCBBf7A3C63cF659c87355fD548e9b78b30c0";

// //       const main = await getMainContract(
// //         contracts.MAIN_CONTRACT
// //       );

// //       const userExists = await main.isUserExists(
// //         account
// //       );

// //       if (!userExists) {
// //         alert("User does not exist.");
// //         setLoading(false);
// //         return;
// //       }

// //       let currentLevelUsers =
// //         await main.partners(account);
// // console.log(currentLevelUsers);
// //       // move to required level
// //       for (let i = 1; i < level; i++) {
// //         let nextLevelUsers = [];

// //         for (const user of currentLevelUsers) {
// //           const partners =
// //             await main.partners(user);
// //           nextLevelUsers =
// //             nextLevelUsers.concat(partners);
// //         }

// //         currentLevelUsers = nextLevelUsers;
// //       }

// //       if (currentLevelUsers.length === 0) {
// //         setUsers([]);
// //         setLoading(false);
// //         return;
// //       }

// //       let finalUsers = [];

// //       let index = 1;

// //       for (const userAddress of currentLevelUsers) {
// //         const userData =
// //           await main.users(userAddress);

// //         const userDetails =
// //           await main.user_details(userAddress);

// //         finalUsers.push({
// //           index: index++,
// //           address: userAddress,
// //           partnerId: userData.referralCode,
// //           amount: Number(
// //             ethers.formatUnits(
// //               userData.totalStaked,
// //               18
// //             )
// //           ),
// //           teamBusiness: Number(
// //             ethers.formatUnits(
// //               userDetails.totalTeambuisness,
// //               18
// //             )
// //           ),
// //           rank: userData.rank,
// //           level: level,
// //           status:
// //             Number(
// //               ethers.formatUnits(
// //                 userData.totalStaked,
// //                 18
// //               )
// //             ) >= 125
// //               ? "Active"
// //               : "Inactive",
// //         });
// //       }

// //       setUsers(finalUsers);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error(
// //         "Error fetching level users:",
// //         error
// //       );
// //       alert(
// //         "An error occurred while fetching users."
// //       );
// //       setLoading(false);
// //     }
// //   };





// const loadLevelUsers = async (level) => {
//   try {
//     setLoading(true);
//     setUsers([]);

//     if (!contracts?.MAIN_CONTRACT) {
//       toast.error("Contract not loaded");
//       setLoading(false);
//       return;
//     }

//     // const signer = await getSigner();
//     // const account = await signer.getAddress();
//     const account = address;
// //  const account = "0x2c50670e45Fd9C6347630c733BF1B3d76cdFCd1d";
//     const main = await getMainContract(
//       contracts.MAIN_CONTRACT
//     );

//     const userExists = await main.isUserExists(account);

//     if (!userExists) {
//       toast.error("User does not exist.");
//       setLoading(false);
//       return;
//     }

//     let currentLevelUsers =
//       await main.partners(account);

//     for (let i = 1; i < level; i++) {
//       let nextLevelUsers = [];

//       for (const user of currentLevelUsers) {
//         if (!user || user === ethers.ZeroAddress)
//           continue;

//         try {
//           const partners =
//             await main.partners(user);
//           nextLevelUsers =
//             nextLevelUsers.concat(partners);
//         } catch {
//           continue;
//         }
//       }

//       currentLevelUsers = nextLevelUsers;
//     }

//     if (currentLevelUsers.length === 0) {
//       toast.info(
//         `No users found for level ${level}`
//       );
//       setLoading(false);
//       return;
//     }

//     let finalUsers = [];
//     let index = 1;

//     for (const userAddress of currentLevelUsers) {
//       try {
//         const userData =
//           await main.users(userAddress);
// // console.log("User Data:", userData);
//         const userDetails =
//           await main.user_details(userAddress);

//         const totalStaked = Number(
//           ethers.formatUnits(
//             userData.totalStaked,
//             18
//           )
//         );

//         finalUsers.push({
//           index: index++,
//           address: userAddress,
//           partnerId: userData.referralCode,
//           amount: totalStaked,
//           teamBusiness: Number(
//             ethers.formatUnits(
//               userDetails.totalTeambuisness,
//               18
//             )
//           ),
//           rank: userData.rank,
//           // rank: Number(userData[5]),
//           level: level,
//           status:
//             totalStaked >= 125
//               ? "Active"
//               : "Inactive",
//         });
//       } catch {
//         continue;
//       }
//     }

//     setUsers(finalUsers);

//     if (finalUsers.length > 0) {
//       toast.success(
//         `Level ${level} loaded successfully`
//       );
//     }

//     setLoading(false);
//   } catch (error) {
//     console.error("Level fetch error:", error);
//     toast.error("Failed to load level users.");
//     setLoading(false);
//   }
// };




//   return (
//     <div className="transaction-container">
//       <h2>Get Level</h2>

//       <table
//         className="table transaction-table"
//         style={{ color: "#ffffff" }}
//       >
//         <thead>
//           <tr>
//             <th colSpan="4"></th>
//             <th className="text-right">
//               Select Level
//             </th>
//             <th>
//               <div className="input-group">
//                 <select
//                   className="form-control"
//                   value={selectedLevel}
//                   onChange={(e) =>
//                     setSelectedLevel(
//                       Number(e.target.value)
//                     )
//                   }
//                 >
//                   {[...Array(10)].map((_, i) => (
//                     <option
//                       key={i + 1}
//                       value={i + 1}
//                     >
//                       Level-{i + 1}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </th>
//           </tr>

//           <tr>
//             <th>S/No.</th>
//             <th>Partner ID</th>
//             <th>Amount</th>
//             <th>From Address</th>
//             <th>Team Business</th>
//             <th>Rank</th>
//             <th>Level</th>
//             <th>Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {loading ? (
//             <tr>
//               <td colSpan="8" className="text-center">
//                 Loading...
//               </td>
//             </tr>
//           ) : users.length === 0 ? (
//             <tr>
//               <td colSpan="8" className="text-center">
//                 No users found for level{" "}
//                 {selectedLevel}
//               </td>
//             </tr>
//           ) : (
//             users.map((user) => (
//               <tr key={user.index}>
//                 <td>{user.index}</td>

//                 <td>{user.partnerId}</td>

//                 <td>
//                   $
//                   {user.amount.toLocaleString()}
//                 </td>

//                 <td>
//                   {user.address.substring(0, 6)}
//                   ...
//                   {user.address.substring(
//                     user.address.length - 4
//                   )}
//                 </td>

//                 <td>
//                   $
//                   {user.teamBusiness.toLocaleString()}
//                 </td>

//                 <td>{user.rank}</td>

//                 <td>{user.level}</td>

//                 <td
//                   style={{
//                     color:
//                       user.status === "Active"
//                         ? "green"
//                         : "red",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {user.status}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Level;




import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { getMainContract } from "../utils/contract";
import { toast } from "react-toastify";
import {
  getNRXPrice,
  formatUSDNRX,
  formatRank,
} from "../utils/formatters";

function Level() {
  const { address, contracts } = useSelector(
    (state) => state.wallet
  );

  const [selectedLevel, setSelectedLevel] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadLevelUsers = useCallback(
    async (level) => {
      if (!address) return;

      try {
        setLoading(true);
        setUsers([]);

        const main = await getMainContract(
          contracts.MAIN_CONTRACT
        );

        const [exists, price] = await Promise.all([
          main.isUserExists(address),
          getNRXPrice(main),
        ]);

        if (!exists) {
          toast.error("User does not exist.");
          setLoading(false);
          return;
        }

        let currentLevelUsers =
          await main.partners(address);

        /* ===== Traverse Levels ===== */
        for (let i = 1; i < level; i++) {
          let nextLevelUsers = [];

          for (const user of currentLevelUsers) {
            if (!user || user === ethers.ZeroAddress)
              continue;

            const partners =
              await main.partners(user);

            nextLevelUsers =
              nextLevelUsers.concat(partners);
          }

          currentLevelUsers = nextLevelUsers;
        }

        if (currentLevelUsers.length === 0) {
          setLoading(false);
          return;
        }

        /* ===== Fetch All User Data Parallel ===== */
        const allData = await Promise.all(
          currentLevelUsers.map(async (userAddress) => {
            const [userData, userDetails] =
              await Promise.all([
                main.users(userAddress),
                main.user_details(userAddress),
              ]);

            const totalStaked =
              Number(userData.totalStaked) / 1e18;

            const teamBusiness =
              Number(
                userDetails.totalTeambuisness
              ) / 1e18;

            return {
              address: userAddress,
              partnerId: userData.referralCode,
              amount: totalStaked,
              teamBusiness,
              rank: formatRank(userData.rank),
              level,
              status:
                totalStaked > 0
                  ? "Active"
                  : "Inactive",
            };
          })
        );

        setUsers(
          allData.map((u, i) => ({
            ...u,
            index: i + 1,
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load level users");
        setLoading(false);
      }
    },
    [address, contracts]
  );

  useEffect(() => {
    loadLevelUsers(selectedLevel);
  }, [selectedLevel, loadLevelUsers]);

  return (
    <div className="transaction-container">
      <h2>Get Level</h2>

      <table
        className="table transaction-table"
        style={{ color: "#ffffff" }}
      >
        <thead>
          <tr>
            <th colSpan="4"></th>
            <th>Select Level</th>
            <th>
              <select
                className="form-control"
                value={selectedLevel}
                onChange={(e) =>
                  setSelectedLevel(
                    Number(e.target.value)
                  )
                }
              >
                {[...Array(10)].map((_, i) => (
                  <option
                    key={i + 1}
                    value={i + 1}
                  >
                    Level-{i + 1}
                  </option>
                ))}
              </select>
            </th>
          </tr>

          <tr>
            <th>S/No.</th>
            <th>Partner ID</th>
            <th>Amount</th>
            <th>From Address</th>
            <th>Team Business</th>
            <th>Rank</th>
            <th>Level</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center">
                Loading...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const formattedAmount =
                formatUSDNRX(
                  user.amount,
                  1
                ); // price already included in format function if needed

              const formattedTeam =
                formatUSDNRX(
                  user.teamBusiness,
                  1
                );

              return (
                <tr key={user.index}>
                  <td>{user.index}</td>

                  <td>{user.partnerId}</td>

                  <td>
                    $ {user.amount.toFixed(4)}
                  </td>

                  <td>
                    <a
                      href={`https://bscscan.com/address/${user.address}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#fff" }}
                    >
                      {user.address.substring(0, 5)}
                      ...
                      {user.address.substring(
                        user.address.length - 4
                      )}
                    </a>
                  </td>

                  <td>
                    $ {user.teamBusiness.toFixed(4)}
                  </td>

                  <td>{user.rank}</td>

                  <td>Level {user.level}</td>

                  <td>
                    {user.status === "Active" ? (
                      <span className="bg history0 nonSelect" style={{color:"#ffffff"}}>
                        Active
                      </span>
                    ) : (
                      <span className="bg history0 nonSelect" style={{color:"red"}}>
                        Inactive
                      </span>
                    )}
                  </td>


                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Level;