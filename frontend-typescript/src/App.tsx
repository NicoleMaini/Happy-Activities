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
import CreateProjectPage from "./view/pages/CreateProjectPage";
import ProjectPage from "./view/pages/ProjectPage";
import FooterComponent from "./view/components/FooterComponent";
import DeletePlacePage from "./view/pages/DeletePlacePage";

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
      <div className="page-container">
        <div className="content-wrap">
          <NavbarComponent />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<GuestRoutes />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signin" element={<SignInPage />} />
            </Route>
            <Route path="" element={<UserRoutes />}>
              <Route path="/dashboard/project/:projectId" element={<ProjectPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/project/trash" element={<DeletePlacePage />} />
              <Route path="/dashboard/create-project" element={<CreateProjectPage />} />
            </Route>
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;
