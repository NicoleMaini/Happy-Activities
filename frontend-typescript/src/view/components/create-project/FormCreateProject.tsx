import { Container } from "react-bootstrap";
import work from "../../../assets/img/work.svg";
import study from "../../../assets/img/study.svg";
import event from "../../../assets/img/event.svg";
import freeTime from "../../../assets/img/freetime.svg";
import edit from "../../../assets/img/edit.svg";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import axios from "axios";
import { ProjectCreate } from "../../../interfaces/Project";

function FormCreateProject({ type }: { type: string }) {
  const user = useAppSelector(state => state.user);

  const navigate = useNavigate();

  const [errors, setErrors] = useState(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProjectCreate>({
    cover_image: "",
    name: "",
    description: "",
    type: "",
    progress: "",
  });

  const updateInputValue = (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(oldFormData => ({
      ...oldFormData,
      [ev.target.name]: ev.target.value,
    }));
  };

  const updateImageField = (ev: React.ChangeEvent<HTMLInputElement>) => {
    updateInputValue(ev);
    if (ev.target.files && ev.target.files[0]) {
      const selectedFile = ev.target.files[0];
      setCoverImage(selectedFile);
      console.log("select", selectedFile);
      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewSrc(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const createProject = (ev: FormEvent) => {
    ev.preventDefault();

    const body = new FormData();

    if (coverImage !== null) {
      body.append("cover_image", coverImage);
    }
    body.append("name", formData.name);
    body.append("description", formData.description);
    body.append("type", type);
    body.append("progress", "active");

    axios
      .post("/api/v1/projects", body)
      .then(res => {
        const project = res.data.project;
        navigate(`/dashboard/project/${project.id}-${project.name.replace(/\s+/g, "-").toLowerCase()}`);
      })
      .catch(err => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  };

  const classString: string = type + " padding-container-form-project";

  return (
    <Container className={classString}>
      <div className="container-form-project-create">
        <div className="img-card-types form-project-create">
          {!previewSrc ? (
            <>
              {" "}
              {type === "work" && <img src={work} alt="" />}
              {type === "study" && <img src={study} alt="" />}
              {type === "event" && <img src={event} alt="" />}
              {type === "free-time" && <img src={freeTime} alt="" />}
            </>
          ) : (
            <img src={previewSrc} alt="" className="img-prew-create-project" />
          )}
        </div>
        <div className="edit-create-project" onClick={handleImageClick}>
          <img src={edit} alt="edit" />
        </div>
        <h4 className="pt-5">{type}</h4>

        <form onSubmit={ev => createProject(ev)} noValidate>
          <input type="file" ref={fileInputRef} className="d-none" onChange={updateImageField} />
          <div className="label-create-project">
            <label className="mb-2">Name:</label>
            <input
              className="mb-5"
              type="text"
              name="name"
              onChange={ev => updateInputValue(ev)}
              value={formData.name}
            />
            <label>Description:</label>
            <textarea
              className=""
              name="description"
              onChange={ev => updateInputValue(ev)}
              value={formData.description}
            ></textarea>
          </div>
          <button type="submit" className="">
            Login
          </button>
        </form>
      </div>
    </Container>
  );
}
export default FormCreateProject;
