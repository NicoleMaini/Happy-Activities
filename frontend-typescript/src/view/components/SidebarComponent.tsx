import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import folder from "../../assets/img/folder.svg";
import openFolder from "../../assets/img/open-folder.svg";
import newProject from "../../assets/img/new-project.svg";
import trash from "../../assets/img/trash.svg";
import fullTrash from "../../assets/img/full-trash.svg";
import setting from "../../assets/img/setting.svg";
import exit from "../../assets/img/exit.svg";
import { Button } from "react-bootstrap";
import { AuthActions, LOGOUT } from "../../redux/actions";
import { useAppDispatch } from "../../redux/store";
import axios from "axios";
import { Project } from "../../interfaces/Project";

function SidebarComponent() {
  const [errors, setErrors] = useState(null);
  const [projectsActive, setProjectsActive] = useState<Project[] | []>([]);
  const [projectsDelete, setProjectsDelete] = useState<Project[] | []>([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios
      .get(`/api/v1/projects`)
      .then(resp => {
        const projs: Project[] = resp.data.data;
        const projsActive = projs.filter(pro => {
          return pro.progress === "active";
        });
        setProjectsActive(projsActive);
        const projsDelete = projs.filter(pro => {
          return pro.progress === "delete";
        });
        setProjectsDelete(projsDelete);
      })
      .catch(err => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  }, [projectsDelete.length]);

  // console.log("delete", projectsDelete);
  // console.log("active", projectsActive);

  const logout = () => {
    axios
      .post("/logout")
      .then(() => {
        const logoutAction: AuthActions = { type: LOGOUT } as const;
        dispatch(logoutAction);
        navigate("/");
      })
      .catch(err => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  };

  return (
    <>
      <div className="d-flex flex-column bg-sidebar">
        <Link to={"/dashboard"}>
          {location.pathname === "/dashboard" ? (
            <img src={openFolder} alt="" width={30} />
          ) : (
            <img src={folder} alt="" width={30} />
          )}
        </Link>
        <Link to={"/dashboard/create-project"} className="mt-3">
          <img src={newProject} alt="" width={30} />
        </Link>
        <Link to={"/dashboard/project/trash"} className="mt-3">
          {projectsDelete.length >= 1 ? (
            <img src={fullTrash} alt="" width={30} />
          ) : (
            <img src={trash} alt="" width={30} />
          )}
        </Link>

        <Link to={""} className="mt-auto">
          <img src={setting} alt="" width={30} />
        </Link>
        <Button variant="link" className="mt-3 p-0" onClick={logout}>
          <img src={exit} alt="" width={30} />
        </Button>
      </div>

      {/* <Offcanvas show={show} onHide={handleClose} backdrop={backdrop}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists,
          etc.
        </Offcanvas.Body>
      </Offcanvas>*/}
    </>
  );
}

export default SidebarComponent;
