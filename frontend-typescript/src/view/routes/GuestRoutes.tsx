import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/store";

function GuestRoutes() {
  const user = useAppSelector(state => state.user);

  return !user ? <Outlet /> : <Navigate to="/dashboard" />;
}

export default GuestRoutes;
