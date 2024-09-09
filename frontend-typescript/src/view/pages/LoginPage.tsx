import axios from "axios";
import {
  FormDataLogin,
  LoginPageProps,
  LoginResponse,
  User,
} from "../../interfaces/User";
import { LOGIN } from "../../redux/actions";
import { useAppDispatch } from "../../redux/store";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function LoginPage({ open, click }: LoginPageProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [errors, setErrors] = useState(null);

  useEffect(() => {
    document.title = "Login";
  }, []);

  const [formData, setFormData] = useState<FormDataLogin>({
    email: "",
    password: "",
  });

  const updateInputValue = (ev: ChangeEvent<HTMLInputElement>) => {
    setFormData((oldFormData) => ({
      ...oldFormData,
      [ev.target.name]: ev.target.value,
    }));
  };

  const submitLogin = (ev: FormEvent) => {
    ev.preventDefault();
    // gli indirizzi relativi, con il proxy attivo fanno la richiesta a http://localhost:8000/login mascherandolo come indirizzo nello stesso host di react (che nel nostro caso è http://localhost:3000/login)
    axios
      .get("/sanctum/csrf-cookie")
      .then(() => axios.post<LoginResponse>("/login", formData))
      .then(() => axios.get<User>("/api/user"))
      .then((res) => {
        dispatch({
          type: LOGIN,
          payload: { user: res.data },
        });
        navigate("/dashboard");
      })
      .catch((err) => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  };

  const openLogin =
    location.pathname === "/login"
      ? "login-component position-relative login-round open3"
      : "login-component login-container open";
  const closeLogin =
    location.pathname === "/login"
      ? "login-component position-relative "
      : "login-component login-container";

  return (
    <div className={location.pathname === "/login" ? "left-side" : ""}>
      <div className={location.pathname === "/login" ? "login-pathname" : ""}>
        <div className={open ? openLogin : closeLogin}>
          <div className="login-hat" onClick={click}>
            LOGIN
          </div>
          <form
            className="login-body"
            onSubmit={(ev) => submitLogin(ev)}
            noValidate
          >
            <div>
              <span>
                <input
                  placeholder="Email address"
                  type="email"
                  id="email"
                  name="email"
                  onChange={(ev) => updateInputValue(ev)}
                  value={formData.email}
                />
              </span>
              <br />
              <span>
                <input
                  placeholder="Password"
                  type="password"
                  id="password"
                  name="password"
                  onChange={(ev) => updateInputValue(ev)}
                  value={formData.password}
                />
              </span>
            </div>
            <button type="submit" className="login-button">
              ENTER
            </button>
            {location.pathname === "/login" && (
              <>
                <div className="mt-5 text-center">
                  Are you already registered?
                  <Link to="/signin" className="login-register">
                    REGISTER HERE
                  </Link>
                </div>
              </>
            )}
          </form>
          {location.pathname === "/login" && (
            <div className="login-shoes">
              <Link to={"/"} className="link">
                return to the homepage
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
