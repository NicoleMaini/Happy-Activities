import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import axios from "axios";
import { useAppDispatch } from "./redux/store";
import { useEffect, useState } from "react";
import { AuthActions, LOGIN } from "./redux/actions";
import { User } from "./interfaces/User";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavbarComponent from "./view/components/NavbarComponent";
import LoginPage from "./view/pages/LoginPage";
import SignInPage from "./view/pages/SignInPage";
import GuestRoutes from "./view/routes/GuestRoutes";
import UserRoutes from "./view/routes/UserRoutes";
import DashboardPage from "./view/pages/DashboardPage";
import HomePage from "./view/pages/HomePage";

function App() {
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;

  const dispatch = useAppDispatch();
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get<User>("/api/user")
      .then(res => {
        const action: AuthActions = {
          type: LOGIN,
          payload: { user: res.data },
        };
        dispatch(action);
      })
      .catch(err => console.log(err))
      .finally(() => setLoaded(true));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route element={<GuestRoutes />}> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<SignInPage />} />
        {/* </Route> */}
        {/* <Route path="" element={<UserRoutes />}> */}
        <Route path="/dasboard" element={<DashboardPage />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
