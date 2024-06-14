import axios from "axios";
import { FormDataRegister } from "../../interfaces/User";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignInPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign In";
  }, []);

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
            "Content-Type": "multipart/form-data",
          },
        });
      })
      .then(resp => navigate("/login"))
      .catch(err => {
        setErrors(err.response.data.errors || { general: "Unknown error" });
      });
  };

  return (
    // <form onSubmit={ev => submitRegister(ev)} noValidate>
    //   <div className="mb-3">
    //     <label htmlFor="name" className="form-label">
    //       Name
    //     </label>
    //     <input
    //       type="text"
    //       className="form-control"
    //       id="name"
    //       name="name"
    //       onChange={ev => updateInputValue(ev)}
    //       value={formData.name}
    //     />
    //   </div>
    //   <div className="mb-3">
    //     <label htmlFor="email" className="form-label">
    //       Email address
    //     </label>
    //     <input
    //       type="email"
    //       className="form-control"
    //       id="email"
    //       name="email"
    //       onChange={ev => updateInputValue(ev)}
    //       value={formData.email}
    //     />
    //   </div>
    //   <div className="mb-3">
    //     <label htmlFor="password" className="form-label">
    //       Password
    //     </label>
    //     <input
    //       type="password"
    //       className="form-control"
    //       id="password"
    //       name="password"
    //       onChange={ev => updateInputValue(ev)}
    //       value={formData.password}
    //     />
    //   </div>
    //   <div className="mb-3">
    //     <label htmlFor="password_confirmation" className="form-label">
    //       Conferma password
    //     </label>
    //     <input
    //       type="password"
    //       className="form-control"
    //       id="password_confirmation"
    //       name="password_confirmation"
    //       onChange={ev => updateInputValue(ev)}
    //       value={formData.password_confirmation}
    //     />
    //   </div>
    //   <div className="mb-3">
    //     <label htmlFor="profile_image" className="form-label">
    //       Profile image
    //     </label>
    //     <input
    //       className="form-control"
    //       type="file"
    //       id="profile_image"
    //       name="profile_image"
    //       onChange={ev => updateImageField(ev)}
    //     />
    //   </div>
    //   <button type="submit" className="btn btn-primary">
    //     Sign In
    //   </button>
    // </form>
    <div className="container-log">
      <h2>It's now or never</h2>
      <h1>Come on , Join us!</h1>

      <form className="form-log sign" onSubmit={ev => submitRegister(ev)} noValidate>
        <div className="fields">
          <span>
            <input
              placeholder="Username"
              type="text"
              className="input-log"
              id="name"
              name="name"
              onChange={ev => updateInputValue(ev)}
              value={formData.name}
            />
          </span>
          <br />
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
          <br />
          <span>
            <input
              className="input-log"
              placeholder="Password Confirmed"
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              onChange={ev => updateInputValue(ev)}
              value={formData.password_confirmation}
            />
          </span>
          <br />
          <span className="">
            <input
              className="input-log "
              type="file"
              id="profile-image-log"
              name="profile_image"
              onChange={ev => updateImageField(ev)}
            />
          </span>
        </div>
        <button type="submit" className="button-log">
          Login
        </button>
      </form>
    </div>
  );
}

export default SignInPage;
