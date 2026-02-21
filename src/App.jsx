import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { autoReconnect } from "./utils/autoReconnect";
import MainLayout from "./components/layout/MainLayout";
import Home from "./front/Home";
import Login from "./front/Login";
import Dashboard from "./user/Dashboard";
import ProtectedRoute from "./components/user/ProtectedRoutes";
import Level from "./user/Level";
import Transaction from "./user/Transaction";
import StakingCalculator from "./user/StakingCalculator";
import Register from "./front/Register";
import ViewAccount from "./front/ViewAccount";
import LockHistory from "./user/LockHistory";
import MyPartners from "./user/MyPartners";
import MiningHistory from "./user/MiningHistory";
import StakingHistory from "./user/StakingHistory";
import WithdrawHistory from "./user/WithdrawHistory";

function App() {

  const dispatch = useDispatch();
  const { network } = useSelector(
    (state) => state.wallet
  );

  useEffect(() => {
    autoReconnect(
      dispatch,
      network.CHAIN_ID
    );
  }, []);

useEffect(() => {
  if (!window.ethereum) return;

  window.ethereum.on(
    "accountsChanged",
    (accounts) => {
      if (accounts.length === 0) {
        window.location.reload();
      } else {
        window.location.reload();
      }
    }
  );

  window.ethereum.on(
    "chainChanged",
    () => {
      window.location.reload();
    }
  );
}, []);



  return (
    <Routes>

      <Route  element={<MainLayout />}>
         
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
<Route path="/view-account" element={<ViewAccount />} />

      </Route>
  <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/level" element={<Level />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/roiCalculator" element={<StakingCalculator />} />
<Route path="/dashboard/:userId" element={<Dashboard />} />
<Route path="/lockHistory" element={<LockHistory />} />
<Route path="/myPartners" element={<MyPartners />} />
<Route path="/miningHistory" element={<MiningHistory />} />
<Route path="/stakingHistory" element={<StakingHistory />} />
<Route path="/withdrawHistory" element={<WithdrawHistory />} />

  
  </Route>
    </Routes>
  );
}

export default App;
