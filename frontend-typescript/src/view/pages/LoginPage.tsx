import axios from "axios";
import { FormDataLogin, LoginResponse, User } from "../../interfaces/User";
import { LOGIN } from "../../redux/actions";
import { useAppDispatch } from "../../redux/store";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

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
    <form onSubmit={ev => submitLogin(ev)} noValidate>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          onChange={ev => updateInputValue(ev)}
          value={formData.email}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          onChange={ev => updateInputValue(ev)}
          value={formData.password}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </form>
  );
}

export default LoginPage;
