import axios from "axios";
import { FormDataLogin, LoginPageProps, LoginResponse, User } from "../../interfaces/User";
import { LOGIN } from "../../redux/actions";
import { useAppDispatch } from "../../redux/store";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({open, click}: LoginPageProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  

  useEffect(() => {
    document.title = "Login";
  }, []);

  const [formData, setFormData] = useState<FormDataLogin>({
    email: "",
    password: "",
  });

  const updateInputValue = (ev: ChangeEvent<HTMLInputElement>) => {
    setFormData(oldFormData => ({
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
      .then(res => {
        dispatch({
          type: LOGIN,
          payload: { user: res.data },
        });
        navigate("/dashboard");
      })
      .catch(err => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  };

  return (
    <div className={open ? "login-component login-container open" : "login-component login-container"}>
      <div className="login-hat" onClick={click}>
        LOGIN
      </div>
      {open && <form className="login-body" onSubmit={ev => submitLogin(ev)} noValidate>
        <div className="fields">
          <span>
            <input
              className="input-log"
              placeholder="Email address"
              type="email"
              id="email"
              name="email"
              onChange={ev => updateInputValue(ev)}
              value={formData.email}
            />
          </span>
          <br />
          <span>
            <input
              className="input-log"
              placeholder="Password"
              type="password"
              id="password"
              name="password"
              onChange={ev => updateInputValue(ev)}
              value={formData.password}
            />
          </span>
        </div>
        <button type="submit" className="login-button">
         ENTER
        </button>
      </form>}
    </div>
  );
}

export default LoginPage;
