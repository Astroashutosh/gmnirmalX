import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "./Footer";
import Common from "./Common";

function ProtectedRoute() {
  const { isConnected } = useSelector(
    (state) => state.wallet
  );

  return isConnected ? (
    <>
      <Common />
      <Outlet />
      <Footer />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default ProtectedRoute;