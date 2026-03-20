
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: null,
  isConnected: false,
  chainId: null,
  userId: null,
  userData: null,
  baseUrl:"https://gm.nirmalx.io/old/",
  contracts: {
    MAIN_CONTRACT: "0x004d636F30f99a97E0929F0501712D6AB626F470",
    TOKEN_CONTRACT: "0x7012c662747EF65bcDabFDEe6cB2d41666c2903C",
    USDT_CONTRACT: "0x55d398326f99059ff775485246999027b3197955",
    LOCK_CONTRACT: "0xa6aF428140c2C6397f1A8589C1778BE599d31CB6",
    ROUTER: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  },

  network: {
    CHAIN_ID: 56,
    name: "BSC Mainnet",
  },
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    // setWallet(state, action) {
    //   state.address = action.payload.address ?? state.address;
    //   state.chainId = action.payload.chainId ?? state.chainId;
    //   state.userId = action.payload.userId ?? state.userId;
    //   state.userData = action.payload.userData ?? state.userData;
    //   state.isConnected = true;
    // },

    setWallet(state, action) {

      state.address = action.payload.address ?? state.address;
      state.chainId = action.payload.chainId ?? state.chainId;
      state.userId = action.payload.userId ?? state.userId;
      state.userData = action.payload.userData ?? state.userData;

      /* IMPORTANT */

      state.isConnected =
        action.payload.chainId ? true : false;

    },


    disconnectWallet(state) {
      state.address = null;
      state.chainId = null;
      state.userId = null;
      state.userData = null;
      state.isConnected = false;
    },
  },
});

export const { setWallet, disconnectWallet } = walletSlice.actions;
export default walletSlice.reducer;