import { Container } from "react-bootstrap";
import work from "../../../assets/img/work.svg";
import study from "../../../assets/img/study.svg";
import event from "../../../assets/img/event.svg";
import freeTime from "../../../assets/img/freetime.svg";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import axios from "axios";
import { ProjectCreate } from "../../../interfaces/Project";

function FormCreateProject({ type }: { type: string }) {
  const user = useAppSelector(state => state.user);
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

  console.log(type);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<ProjectCreate>({
    cover_image: "",
    name: "",
    type: "",
    description: "",
    progress: "",
  });

  const updateInputValue = (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const submitLogin = (ev: FormEvent) => {
    ev.preventDefault();
    // gli indirizzi relativi, con il proxy attivo fanno la richiesta a http://localhost:8000/login mascherandolo come indirizzo nello stesso host di react (che nel nostro caso è http://localhost:3000/login)

    console.log("siamo dentro alla fetch");
    // axios
    //   .get("/sanctum/csrf-cookie")
    //   .then(res => {
    //     navigate("/dashboard");
    //   })
    //   .catch(err => {
    //     setErrors(err.response?.data.errors || { general: "Unknown error" });
    //   });
  };

  const classString: string = type + " padding-container-form-project";

  return (
    <Container className={classString}>
      <div className="container-form-project-create">
        <div className="img-card-types form-project-create">
          {type === "work" && <img src={work} alt="" />}
          {type === "study" && <img src={study} alt="" />}
          {type === "event" && <img src={event} alt="" />}
          {type === "free-time" && <img src={freeTime} alt="" />}
        </div>
        <h4 className="pt-5">Category: {type}</h4>

        <form action="">
          <input type="hidden" name="type" value={type} />
          <input type="hidden" name="progress" value="active" />
          <form className="form-log log" onSubmit={ev => submitLogin(ev)} noValidate>
            <div className="ms-3 label-create-project">
              <span>
                <input
                  className="input-log"
                  placeholder="Name"
                  type="text"
                  name="name"
                  onChange={ev => updateInputValue(ev)}
                  value={formData.name}
                />
              </span>
              <br />
              <span>
                <textarea
                  className="input-log mt-5"
                  placeholder="Description"
                  rows={4}
                  name="description"
                  onChange={ev => updateInputValue(ev)}
                  value={formData.description}
                ></textarea>
              </span>
            </div>
            <button type="submit" className="to-click log-btn-page p-1 mt-4">
              Login
            </button>
          </form>
        </form>
      </div>
    </Container>
  );
}
export default FormCreateProject;
