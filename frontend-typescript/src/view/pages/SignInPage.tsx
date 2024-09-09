import axios from "axios";
import { FormDataRegister, LoginPageProps } from "../../interfaces/User";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function SignInPage({ open, click }: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Sign Up";
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
    setFormData((oldFormData) => ({
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
      .then((resp) => navigate("/login"))
      .catch((err) => {
        setErrors(err.response.data.errors || { general: "Unknown error" });
      });
  };

  const openSignin =
    location.pathname === "/signin"
      ? "login-component position-relative login-round open4"
      : "login-component signin-container open2";
  const closeSignin =
    location.pathname === "/signin"
      ? "login-component position-relative "
      : "login-component signin-container";

  return (
    <div className={location.pathname === "/signin" ? "left-side" : ""}>
     <div className={location.pathname === "/signin" ? "login-pathname" : ""}>
        <div className={open ? closeSignin : openSignin}>
          <div className="signin-hat" onClick={click}>
            SIGN UP
          </div>
          <form
            className="signin-body"
            onSubmit={(ev) => submitRegister(ev)}
            noValidate
          >
            <div>
              <span>
                <input
                  placeholder="Username"
                  type="text"
                  id="name"
                  name="name"
                  onChange={(ev) => updateInputValue(ev)}
                  value={formData.name}
                />
              </span>
              <br />
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
              <br />
              <span>
                <input
                  placeholder="Password Confirmed"
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  onChange={(ev) => updateInputValue(ev)}
                  value={formData.password_confirmation}
                />
              </span>
              {/* <br />
            <span className="">
              <input
                type="file"
                id="profile-image-log"
                name="profile_image"
                onChange={ev => updateImageField(ev)}
              />
            </span>*/}
            </div>
            <button type="submit" className="signin-button">
              SIGN UP
            </button>
            {location.pathname === "/signin" && (
              <>
                <div className="mt-5 text-center">
                You are not registered?
                  <Link to="/login" className="login-register orange">
                    LOGIN HERE
                  </Link>
                </div>
              </>
            )}
          </form>
          {location.pathname === "/signin" && (
            <div className="login-shoes orange">
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

export default SignInPage;
