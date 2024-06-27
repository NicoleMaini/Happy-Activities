import { ChangeEvent, FormEvent, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Project, ProjectCreate } from "../../interfaces/Project";
import axios from "axios";
import { Container } from "react-bootstrap";

import work from "../../assets/img/work.svg";
import study from "../../assets/img/study.svg";
import event from "../../assets/img/event.svg";
import freeTime from "../../assets/img/freetime.svg";
import edit from "../../assets/img/edit.png";

interface ModalProps {
  project: Project;
  title: string;
}

function ModalEditProjectComponent({ project, title }: ModalProps) {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  const [errors, setErrors] = useState(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProjectCreate>({
    cover_image: project.cover_image,
    name: project.name,
    description: project.description,
    type: project.type,
    progress: "active",
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

  const editProject = (ev: FormEvent) => {
    ev.preventDefault();

    const body = new FormData();

    body.append("_method", "put");

    if (coverImage !== null) {
      body.append("cover_image", coverImage);
    }
    body.append("name", formData.name);
    body.append("description", formData.description);
    body.append("type", formData.type);
    body.append("progress", formData.progress);

    axios
      .post(`/api/v1/projects/${project.id}`, body)
      .then(res => {
        console.log("fetch andata", res.data.project);
      })
      .catch(err => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  };

  const classString: string = project.type + " padding-container-form-project mt-5";

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className={classString}>
            <div className="container-form-project-create">
              <div className="img-card-types form-project-create">
                {!previewSrc ? (
                  <>
                    {" "}
                    {project.type === "work" && <img src={work} alt="" />}
                    {project.type === "study" && <img src={study} alt="" />}
                    {project.type === "event" && <img src={event} alt="" />}
                    {project.type === "free-time" && <img src={freeTime} alt="" />}
                  </>
                ) : (
                  <img src={previewSrc} alt="" className="img-prew-create-project" />
                )}
              </div>
              <div className="edit-create-project" onClick={handleImageClick}>
                <img src={edit} alt="edit" />
              </div>

              <form onSubmit={ev => editProject(ev)} noValidate>
                <input type="file" ref={fileInputRef} className="d-none" onChange={updateImageField} />
                <div className="label-create-project">
                  <label className="mb-2 mt-5">Name:</label>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalEditProjectComponent;
