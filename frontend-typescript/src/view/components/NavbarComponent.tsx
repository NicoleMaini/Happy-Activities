import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import axios from "axios";
import { AuthActions, LOGOUT } from "../../redux/actions";
import logo from "../../assets/img/logo.png"; // Importa l'immagine SVG
import { useState } from "react";

function NavbarComponent() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAppSelector(state => state.user);

  const [errors, setErrors] = useState(null);

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
    <Navbar expand="lg" className="bg-color-navbar container-navbar ">
      <Container fluid>
        <Link className="nav-brand" to="/">
          <img src={logo} alt="" width={200} />
        </Link>
        <div className="vertical-line-navbar"></div>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className={location.pathname === "/" ? "ms-3 pages-navbar-active" : "ms-3 pages-navbar"}
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Link to="/">Home</Link>
          </Nav>
          <Nav
            className={
              location.pathname === "/support-us" ? "ms-3 pages-navbar-active me-auto" : "ms-3 pages-navbar me-auto"
            }
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Link to="/">Support Us</Link>
          </Nav>
          <div className="vertical-line-navbar me-3"></div>
          {user ? (
            <>
              <span className="me-2"></span>
              <NavDropdown title={user.name} id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">Something else here</NavDropdown.Item>
              </NavDropdown>
              {/* <img className="me-2" src={user.profile_img} alt="" style={{ height: "50px", width: "50px" }} /> */}
              <button type="button" className="to-click" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="to-click log-navbar me-3" to="/login">
                LOGIN
              </Link>
              <Link className="to-click sign-navbar me-1" to="/signin">
                SIGN IN
              </Link>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
