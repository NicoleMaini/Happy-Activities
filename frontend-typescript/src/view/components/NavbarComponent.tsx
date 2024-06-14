import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import axios from "axios";
import { AuthActions, LOGOUT } from "../../redux/actions";
import logo from "../../assets/img/logo.svg"; // Importa l'immagine SVG
import { useState } from "react";

function NavbarComponent() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
    <Navbar expand="lg" className="bg-body-white container-navbar">
      <Container fluid>
        <Link className="nav-brand" to="/">
          <img src={logo} alt="" width={60} />
        </Link>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-3" style={{ maxHeight: "100px" }} navbarScroll>
            <Link to="/">Home</Link>
          </Nav>
          <Nav className="ms-3" style={{ maxHeight: "100px" }} navbarScroll>
            <Link to="/">About Us</Link>
          </Nav>
          <Nav className="me-auto ms-3" style={{ maxHeight: "100px" }} navbarScroll>
            <Link to="/">Contact</Link>
          </Nav>
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
              <button type="button" className="btn-log-navbar" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn-log-navbar me-3" to="/login">
                Login
              </Link>
              <Link className="btn-sign-navbar" to="/signin">
                Sign In
              </Link>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
