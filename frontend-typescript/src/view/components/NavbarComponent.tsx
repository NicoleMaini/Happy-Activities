import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import axios from "axios";
import { AuthActions, LOGOUT } from "../../redux/actions";
import logo from "../../assets/img/logo.png"; // Importa l'immagine SVG
import exit from "../../assets/img/exit.svg";
import userImg from "../../assets/img/user.svg";
import { useState } from "react";
import { Project } from "../../interfaces/Project";

interface NavbarComponentProps {
  project: Project | null;
}

function NavbarComponent({project}: NavbarComponentProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const proj = useAppSelector((state) => state.project.project);
  console.log('proj', proj);

  const user = useAppSelector((state) => state.user.user);
  console.log("user", user);

  const [errors, setErrors] = useState(null);

  const logout = () => {
    axios
      .post("/logout")
      .then(() => {
        const logoutAction: AuthActions = { type: LOGOUT } as const;
        dispatch(logoutAction);
        navigate("/");
      })
      .catch((err) => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  };

  return (
    <div className="nav-dashboard-component dashboard-color">
      <img src={logo} alt="logo" width={26} className="me-3" />
      <div>Dashboard</div>
      <div className="dividing-line"></div>
      <div>{project? project.name : 'Choise your projects'}</div>
      {user ? (
        <div className="ms-auto d-flex align-items-center">
          <img src={user.profile_image ? user.profile_image : userImg} alt="" width={30} className="rounded-circle object-fit-cover me-2"/>
          <div>{user.name ? user.name : "unknow"}</div>
        </div>
      ) : (
        <div className="ms-auto d-flex">
          <img src={userImg} alt="profile-img" width={30} className="rounded-circle object-fit-cover"/>
          <div>unknow</div>
        </div>
      )}
      <div className="dividing-line"></div>
      <img
        src={exit}
        alt="Logout"
        onClick={logout}
        width={26}
        className="cursor-pointer"
      />
    </div>
  );
}

export default NavbarComponent;
