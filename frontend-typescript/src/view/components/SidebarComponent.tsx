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
import { useAppDispatch, useAppSelector } from "../../redux/store";
import axios from "axios";
import { Project } from "../../interfaces/Project";
import {
  getProjects,
  goProject,
  projectPageLink,
} from "../../includes/functions";

function SidebarComponent() {
  const [errors, setErrors] = useState<
    { [key: string]: any } | { general: string } | null
  >(null);

  const [open, setOpen] = useState<boolean>(false);
  const [openProject, setOpenProject] = useState<boolean>(false);

  const [projectsActive, setProjectsActive] = useState<Project[] | []>([]);
  const [projectsDelete, setProjectsDelete] = useState<Project[] | []>([]);

  const project = useAppSelector((state) => state.project.project);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getProjects(setProjectsActive, setErrors, undefined, setProjectsDelete);
  }, [projectsDelete.length]);

  return (
    <div
      className="icons-circle"
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        id="sidebar-transition"
        className={
          open
            ? `sidebar-component open ${
                !project ? "dashboard-color" : `dashboard-color-${project.type}`
              }`
            : `sidebar-component ${
                !project ? "dashboard-color" : `dashboard-color-${project.type}`
              }`
        }
      >
        {/* folder icons--------------------------------------- */}
        <>
          <div
            className={
              location.pathname === "/dashboard" || openProject
                ? "d-flex align-items-center folder selected w-100"
                : "d-flex align-items-center folder w-100"
            }
          >
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
                <img
                  src={arrowDown}
                  alt=""
                  width={24}
                  className={
                    openProject
                      ? "opacity-25 ms-4 open-arrow rotate"
                      : "opacity-25 ms-4 open-arrow"
                  }
                />
              </h5>
            )}
          </div>
          {/* trovare un modo per fargli fare un transizione pulita verso il basso */}
          {open && openProject && (
            <div className="open-project open text-nowarp">
              {projectsActive.length >= 1
                ? projectsActive.map((proj) => (
                    <div
                      key={proj.id}
                      className={
                        location.pathname === projectPageLink(proj)
                          ? "d-flex align-items-center project selected"
                          : "d-flex align-items-center project-padding"
                      }
                    >
                      <img className="me-1" src={projectImg} alt="document" />
                      <p onClick={() => goProject(proj, dispatch, navigate)}>
                        {proj.name.length >= 16
                          ? proj.name.substring(0, 16) + "..."
                          : proj.name}
                      </p>
                    </div>
                  ))
                : "no projects active"}
            </div>
          )}
        </>

        {/* create-project icons--------------------------------------- */}

        <div className="d-flex align-items-center my-3 w-100 folder">
          <Link to={"/dashboard/create-project"}>
            <img src={newProject} alt="" width={28} />
          </Link>
          {open && (
            <h5
              className="ms-3 text-nowarp"
              onClick={() => navigate("/dashboard/create-project")}
            >
              create new projects
            </h5>
          )}
        </div>

        {/* trash icons--------------------------------------- */}

        <div
          className={
            location.pathname === "/dashboard/projects/trash"
              ? "d-flex align-items-center mb-3 w-100 folder selected"
              : "d-flex align-items-center mb-3 w-100 folder"
          }
        >
          <Link to={"/dashboard/projects/trash"}>
            {projectsDelete.length >= 1 ? (
              <img
                className={
                  location.pathname === "/dashboard/projects/trash"
                    ? "selected"
                    : ""
                }
                src={fullTrash}
                alt=""
                width={28}
              />
            ) : (
              <img src={trash} alt="" width={28} />
            )}
          </Link>
          {open && (
            <h5
              className="ms-3 text-nowarp"
              onClick={() => navigate("/dashboard/projects/trash")}
            >
              trash
            </h5>
          )}
        </div>

        {/* settings icons--------------------------------------- */}

        <div className="d-flex align-items-center mb-3 mt-auto folder w-100">
          <Link to={""}>
            <img src={setting} alt="" width={28} />
          </Link>
          {open && <h5 className="ms-3 text-nowarp">settings</h5>}
        </div>

        {/* logout icons--------------------------------------- */}
        
        <Link
          to={"/dashboard"}
          className="d-flex align-items-center folder w-100"
        >
          <div>
            <img src={exit} alt="" width={28} />
          </div>
          {open && <h5 className="ms-3 text-nowarp">exit</h5>}
        </Link>
      </div>
    </div>
  );
}

export default SidebarComponent;
