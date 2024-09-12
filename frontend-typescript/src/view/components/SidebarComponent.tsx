import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import folder from "../../assets/img/folder.svg";
import openFolder from "../../assets/img/open-folder.svg";
import newProject from "../../assets/img/new-project.svg";
import projectImg from "../../assets/img/project.svg";
import trash from "../../assets/img/trash.svg";
import fullTrash from "../../assets/img/full-trash.svg";
import setting from "../../assets/img/setting.svg";
import exit from "../../assets/img/exit.svg";
import arrowDown from "../../assets/img/arrow-down.svg";
import arrowUp from "../../assets/img/arrow-up.svg";
import { AuthActions, LOGOUT } from "../../redux/actions";
import { useAppDispatch } from "../../redux/store";
import axios from "axios";
import { Project } from "../../interfaces/Project";
import { goProject, projectPageLink } from "../../includes/functions";

function SidebarComponent() {
  const [errors, setErrors] = useState(null);

  const [open, setOpen] = useState<boolean>(false);
  const [openProject, setOpenProject] = useState<boolean>(false);

  const [projectsActive, setProjectsActive] = useState<Project[] | []>([]);
  const [projectsDelete, setProjectsDelete] = useState<Project[] | []>([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // fetch per recuperare i progetti e dividerli in active e delete
  useEffect(() => {
    axios
      .get(`/api/v1/projects`)
      .then((resp) => {
        const projs: Project[] = resp.data.data;
        const projsActive = projs.filter((pro) => {
          return pro.progress === "active";
        });
        setProjectsActive(projsActive);
        const projsDelete = projs.filter((pro) => {
          return pro.progress === "delete";
        });
        setProjectsDelete(projsDelete);
      })
      .catch((err) => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  }, [projectsDelete.length]);

  console.log("delete", projectsDelete);
  console.log("active", projectsActive);

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
    <div
      className="icons-circle"
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      >
      <div
        className={
          open
            ? "dashboard-color sidebar-component open"
            : "dashboard-color sidebar-component"
        }
      >
        {/* folder icons--------------------------------------- */}
        <>
          <div className={location.pathname === "/dashboard" || openProject ? "d-flex align-items-center folder selected w-100": "d-flex align-items-center folder w-100"}>
            <Link to={"/dashboard"}>
              {location.pathname === "/dashboard" || openProject ? (
                <img className="selected" src={openFolder} alt="" width={28} />
              ) : (
                <img src={folder} alt="" width={28} />
              )}
            </Link>
            {open && (
              <h5
              className="ms-3 text-nowarp position-relative"
              onClick={() => setOpenProject(!openProject)}
              >
                your projects
                <img src={openProject? arrowUp :arrowDown} alt="" width={20} className="opacity-25 ms-4"/>
              </h5>
            )}
          </div>
          {/* trovare un modo per fargli fare un transizione pulita verso il basso */}
          {open && openProject && (
            <div className="open-project open text-nowarp">
              {projectsActive.length >= 1
                ? projectsActive.map((proj) => (
                    <div key={proj.id} className={location.pathname === projectPageLink(proj)? 'd-flex align-items-center project selected': 'd-flex align-items-center project-padding'}>
                      <img className='me-1' src={projectImg} alt="document"/>
                      <p onClick={()=>goProject(proj, dispatch, navigate)}>
                        {proj.name.length >= 16? proj.name.substring(0, 16) + '...': proj.name}
                      </p>
                    </div>
                  ))
                : "no projects active"}
            </div>
          )}
        </>

        {/* create-project icons--------------------------------------- */}
        <Link
          to={"/dashboard/create-project"}
          className="d-flex align-items-center my-3 folder"
        >
          <img src={newProject} alt="" width={28} />
          {open && <h5 className="ms-3 text-nowarp">create new projects</h5>}
        </Link>

        {/* trash icons--------------------------------------- */}
        <Link
          to={"/dashboard/projects/trash"}
          className={location.pathname === "/dashboard/projects/trash" ? 'd-flex align-items-center mb-3 folder selected w-100':'d-flex align-items-center mb-3 folder'}
        >
          {projectsDelete.length >= 1 ? (
            <img className={location.pathname === "/dashboard/projects/trash" ? 'selected':''} src={fullTrash} alt="" width={28} />
          ) : (
            <img src={trash} alt="" width={28} />
          )}
          {open && <h5 className="ms-3">trash</h5>}
        </Link>

        {/* settings icons--------------------------------------- */}
        <Link to={""} className="d-flex align-items-center mb-3 mt-auto folder">
          <img src={setting} alt="" width={28} />
          {open && <h5 className="ms-3">settings</h5>}
        </Link>

        {/* logout icons--------------------------------------- */}
        <div className="d-flex align-items-center folder" onClick={logout}>
          <img src={exit} alt="" width={28} />
          {open && <h5 className="ms-3">logout</h5>}
        </div>
      </div>
    </div>
  );
}

export default SidebarComponent;
