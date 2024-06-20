import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import folder from "../../assets/img/folder.svg";
import openFolder from "../../assets/img/open-folder.svg";
import newProject from "../../assets/img/new-project.svg";
import trash from "../../assets/img/trash.svg";
import user from "../../assets/img/user.svg";
import setting from "../../assets/img/setting.svg";
import exit from "../../assets/img/exit.svg";
import { Button } from "react-bootstrap";
import { AuthActions, LOGOUT } from "../../redux/actions";
import { useAppDispatch } from "../../redux/store";
import axios from "axios";

function SidebarComponent() {
  const [errors, setErrors] = useState(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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
        <Link to={""} className="mt-3">
          <img src={trash} alt="" width={30} />
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
