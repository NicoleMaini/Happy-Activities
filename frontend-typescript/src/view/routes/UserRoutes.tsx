import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/store";

function UserRoutes() {
  const user = useAppSelector(state => state.user);

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default UserRoutes;
