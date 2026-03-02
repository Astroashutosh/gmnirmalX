import { ethers } from "ethers";

/* ===== NRX PRICE FETCH ===== */
export const getNRXPrice = async (main) => {
  try {
    const one = ethers.parseUnits("1", 18);
    const priceRaw = await main.getTokenToUSDT(one);
    return Number(ethers.formatUnits(priceRaw, 18));
  } catch {
    return 1;
  }
};

/* ===== FORMAT USD + NRX ===== */
export const formatUSDNRX = (amount, price) => {
  const usd = Number(amount);
  const nrx = usd / price;

  return {
    usd: usd.toFixed(4),
    nrx: nrx.toFixed(4),
  };
};

/* ===== RANK FORMAT ===== */
// export const formatRank = (rankValue) => {
//   const ranks = [
//     "",
//     "NRX1",
//     "NRX2",
//     "NRX3",
//     "NRX4",
//     "NRX5",
//     "NRX6",
//     "NRX7",
//     "NRX8",
//     "NRX9",
//   ];

//   return ranks[Number(rankValue)] || "No Rank";
// };


export const formatRank = (rank) => {
  const ranks = [
    "",
    "Pearl",
    "Sapphire",
    "Emerald",
    "Ruby",
    "Diamond",
    "Double Diamond",
  ];

  return rank > 0 ? ranks[Number(rank)] : "No Rank";
};