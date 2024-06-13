import axios from "axios";
import { useAppDispatch } from "../../redux/store";
import { FormDataRegister, User } from "../../interfaces/User";
import { LOGIN } from "../../redux/actions";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignInPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormDataRegister>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    profile_image: null,
  });

  const [errors, setErrors] = useState(null);

  const updateInputValue = (ev: ChangeEvent<HTMLInputElement>) => {
    setFormData(oldFormData => ({
      ...oldFormData,
      [ev.target.name]: ev.target.value,
    }));
  };

  const updateImageField = (ev: ChangeEvent<HTMLInputElement>) => {
    updateInputValue(ev);
    if (ev.target.files && ev.target.files[0]) {
      const selectedFile = ev.target.files[0];
      setProfileImage(selectedFile);
    }
  };

  const submitRegister = (ev: FormEvent) => {
    ev.preventDefault();
    // gli indirizzi relativi, con il proxy attivo fanno la richiesta a http://localhost:8000/login mascherandolo come indirizzo nello stesso host di react (che nel nostro caso è http://localhost:3000/login)

    const body = new FormData();
    body.append("name", formData.name);
    body.append("email", formData.email);
    body.append("password", formData.password);
    body.append("password_confirmation", formData.password_confirmation);
    if (profileImage !== null) {
      body.append("profile_image", profileImage);
    }

    axios
      .get("/sanctum/csrf-cookie")
      .then(() => {
        return axios.post("/register", body, {
          headers: {
            "Content-Type": "multipart/form-data", //specificato
          },
        });
      })
      // .then(() => axios.get<User>("/api/user"))
      // .then(res => {
      //   // salvare i dati dello user nel Redux state
      //   dispatch({
      //     type: LOGIN,
      //     payload: { user: res.data },
      //   });
      // })
      .then(resp => navigate("/login"))
      .catch(err => {
        setErrors(err.response.data.errors || { general: "Unknown error" });
      });
  };

  return (
    // <form method="POST" action="....." novalidate enctype='multipart/form-data'> // se fatto in Blade
    <form onSubmit={ev => submitRegister(ev)} noValidate>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          onChange={ev => updateInputValue(ev)}
          value={formData.name}
        />
      </div>
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
      <div className="mb-3">
        <label htmlFor="password_confirmation" className="form-label">
          Conferma password
        </label>
        <input
          type="password"
          className="form-control"
          id="password_confirmation"
          name="password_confirmation"
          onChange={ev => updateInputValue(ev)}
          value={formData.password_confirmation}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="profile_image" className="form-label">
          Profile image
        </label>
        <input
          className="form-control"
          type="file"
          id="profile_image"
          name="profile_image"
          onChange={ev => updateImageField(ev)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Sign In
      </button>
    </form>
  );
}

export default SignInPage;
