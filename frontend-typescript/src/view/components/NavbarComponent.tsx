import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import axios from "axios";
import { AuthActions, LOGOUT } from "../../redux/actions";
import projectImg from "../../assets/img/project.svg";
import logo from "../../assets/img/logo.png"; // Importa l'immagine SVG
import exit from "../../assets/img/exit.svg";
import userImg from "../../assets/img/user.svg";
import calendar from "../../assets/img/calendar.svg";
import { useEffect, useState } from "react";
import { resetProject } from "../../includes/functions";

function NavbarComponent() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAppSelector((state) => state.user.user);
  const project = useAppSelector((state) => state.project.project);

  const [errors, setErrors] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    //per resettare lo stato redux del progetto a null una volta usciti dalla pagina
    if (project) {
      resetProject(project, dispatch, location);
    }
  }, [location.pathname]);

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

  // per mostrare se si è collaboratori o team leader
  const teamComponentFunction = () => {
    if (project && project.users && user) {
      const roleUser = project.users.filter((userRole) => {
        return userRole.id === user.id;
      });
      return roleUser[0].pivot.team;
    }
  };

  return (
    <div className={!project ? `nav-dashboard-component dashboard-color` : `nav-dashboard-component dashboard-color-${project.type}`}>
      <img src={logo} alt="logo" width={26} className="me-3" />
      <Link to="/dashboard">Dashboard</Link>
      <div className="dividing-line"></div>
      {project ? (
        <>
          <div className="project-img">
            <img
              src={project.cover_image ? project.cover_image : projectImg}
              alt="project-img"
            />
          </div>
          <div className="text-uppercase name text-nowarp me-1">{project.name.length >= 22? project.name.substring(0, 22) + '...': project.name}</div>
          <div>&raquo;</div>
          <div
            className="position-relative w-50"
            onClick={() => setOpen(!open)}
            onMouseLeave={() => setOpen(false)}
          >
            <div>
              <div className="description text-nowarp">
                {project.description}
              </div>
            </div>
            {open && (
              <>
                <div className="total-description">{project.description}</div>
                <div className="total-description-span"></div>
              </>
            )}
          </div>
        </>
      ) : (
        <div>{location.pathname === '/dashboard/create-project'?'Create your project':'Choose your projects'}</div>
      )}

      {user ? (
        <div className="ms-auto d-flex align-items-center">
          <img
            src={user.profile_image ? user.profile_image : userImg}
            alt=""
            width={30}
            className="rounded-circle object-fit-cover me-2"
          />
          <div>
            <div>{user.name ? user.name : "unknow"}</div>
            <div className="user-role">
              {project ? teamComponentFunction() : ""}
            </div>
          </div>
        </div>
      ) : (
        <div className="ms-auto d-flex">
          <img
            src={userImg}
            alt="profile-img"
            width={30}
            className="rounded-circle object-fit-cover"
          />
          <div>unknow</div>
        </div>
      )}
      <div className="dividing-line"></div>
      {project && (
        <div className="icons-circle press me-2">
          <img src={calendar} alt="" width={26}/>
        </div>
      )}
     <div className="icons-circle press">
        <img
          src={exit}
          alt="Logout"
          onClick={logout}
          width={26}
        />
     </div>
    </div>
  );
}

export default NavbarComponent;
