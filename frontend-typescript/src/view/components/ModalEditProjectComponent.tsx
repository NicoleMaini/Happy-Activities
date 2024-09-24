import { ChangeEvent, FormEvent, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Project, ProjectCreate } from "../../interfaces/Project";
import axios from "axios";
import { Container } from "react-bootstrap";
import collaborationImg from "../../assets/img/collaboration.png";
import aloneImg from "../../assets/img/working-alone.jpg";
import refreshIcons from "../../assets/img/refresh-icon.svg";
import edit from "../../assets/img/edit.png";
import { ReloadProjects, START_LOAD_PROJECTS } from "../../redux/actions";
import { useAppDispatch } from "../../redux/store";

interface ModalProps {
  project: Project;
  title: string;
  click: () => void;
}

function ModalEditProjectComponent({ project, title, click }: ModalProps) {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(true);

  const [errors, setErrors] = useState(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const initialFormData: ProjectCreate = {
    cover_image: project.cover_image,
    name: project.name,
    description: project.description,
    type: project.type,
    progress: "active",
  };

  const [formData, setFormData] = useState<ProjectCreate>(initialFormData);

  const updateInputValue = (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((oldFormData) => ({
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
    // Log ogni append
    body.append("name", formData.name);
    body.append("description", formData.description);
    body.append("type", formData.type);
    body.append("progress", formData.progress);

    if (body) {
      axios
        .post(`/api/v1/projects/${project.id}`, body)
        .then((res) => {
          console.log("fetch andata", res.data.project);
          const action: ReloadProjects = { type: START_LOAD_PROJECTS } as const;
          dispatch(action)
          click();
        })
        .catch((err) => {
          setErrors(err.response?.data.errors || { general: "Unknown error" });
        });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData); // Resetta i dati del form
    setCoverImage(null); // Resetta l'immagine selezionata
    setPreviewSrc(project.cover_image); // Resetta l'anteprima dell'immagine
    fileInputRef.current!.value = ""; // Resetta il campo file input
  };

  return (
    <>
      <Modal show={show} onHide={click} className="modal-edit-project">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Container className="create-form-project-component">
            <div className="position-relative">
              <h4 className="border-bottom mb-4 pb-2">{title}</h4>
              <div className={`img-project-container ${project.type}`}>
                <img
                  src={
                    previewSrc
                      ? previewSrc
                      : project.cover_image
                      ? project.cover_image
                      : project.type === "together"
                      ? collaborationImg
                      : aloneImg
                  }
                  alt="preview-img"
                />
              </div>

              {/* per aggiungere l'immagine */}
              <div
                className={`edit-container ${project.type}`}
                onClick={handleImageClick}
              >
                <img src={edit} alt="edit" width={15} />
              </div>
            </div>

            <h4 className="pt-3 text-center">
              type of project: {project.type}
            </h4>

            <form onSubmit={(ev) => editProject(ev)} noValidate>
              <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                onChange={updateImageField}
              />
              <div className={`label color-${project.type}`}>
                <label className="mb-2">Name of your project:</label>
                <input
                  type="text"
                  name="name"
                  onChange={(ev) => updateInputValue(ev)}
                  value={formData.name}
                  required
                />
                <label>Brief description of your project:</label>
                <textarea
                  rows={2}
                  name="description"
                  onChange={(ev) => updateInputValue(ev)}
                  value={formData.description}
                ></textarea>
              </div>
              <div className="d-flex align-items-center justify-content-between mt-3 mb-1 modal-footer">
                <img
                  src={refreshIcons}
                  alt=""
                  width={24}
                  className="opacity-75"
                  onClick={resetForm}
                />
                <button
                  type="submit"
                  className={`${project.type} ${
                    !formData.name.trim() && "disable"
                  }`}
                  disabled={!formData.name.trim()}
                >
                  save
                </button>
              </div>
            </form>
          </Container>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default ModalEditProjectComponent;
