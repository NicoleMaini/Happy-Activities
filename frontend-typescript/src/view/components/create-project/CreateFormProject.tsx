import { Container } from "react-bootstrap";
import collaborationImg from "../../../assets/img/collaboration.png";
import aloneImg from "../../../assets/img/working-alone.jpg";
import refreshIcons from "../../../assets/img/refresh-icon.svg";
import edit from "../../../assets/img/edit.png";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import axios from "axios";
import { ProjectCreate } from "../../../interfaces/Project";
import { useAppDispatch } from "../../../redux/store";
import { goProject } from "../../../includes/functions";

interface CreateFormProjectProps {
  type: string;
  onclick: () => void;
}

function CreateFormProject(props: CreateFormProjectProps) {
 
const dispatch = useAppDispatch();

  const [errors, setErrors] = useState(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  console.log(props.type);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const initialFormData: ProjectCreate = {
    cover_image: "",
    name: "",
    description: "",
    type: "",
    progress: "",
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

  const createProject = (ev: FormEvent) => {
    ev.preventDefault();

    const body = new FormData();

    if (coverImage !== null) {
      body.append("cover_image", coverImage);
    }
    body.append("name", formData.name);
    body.append("description", formData.description);
    body.append("type", props.type);
    body.append("progress", "active");

    console.log(formData);

    axios
      .post("/api/v1/projects", body)
      .then((res) => { 
        goProject(res.data.project, dispatch)
      })
      .catch((err) => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  };

  const resetForm = () => {
    setFormData(initialFormData);  // Resetta i dati del form
    setCoverImage(null);           // Resetta l'immagine selezionata
    setPreviewSrc(null);           // Resetta l'anteprima dell'immagine
    fileInputRef.current!.value = '';  // Resetta il campo file input
  };

  return (
    <Container className={`create-form-project-component ${props.type}`}>
      <div className="position-relative">
        <div className={`img-project-container ${props.type}`}>
          {!previewSrc ? (
            <>
              {props.type === "together" && (
                <img src={collaborationImg} alt="alone-png" />
              )}
              {props.type === "alone" && <img src={aloneImg} alt="" />}
            </>
          ) : (
            <img src={previewSrc} alt="preview-img"/>
          )}
        </div>

        {/* per aggiungere l'immagine */}
        <div className={`edit-container ${props.type}`} onClick={handleImageClick}>
          <img src={edit} alt="edit" width={15}/>
        </div>
      </div>

      <h4 className="pt-3 text-center">type of project: {props.type}</h4>

      <form onSubmit={(ev) => createProject(ev)} noValidate>
        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          onChange={updateImageField}
        />
        <div className={`label color-${props.type}`}>
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
        <div className="d-flex align-items-center justify-content-between mt-3 mb-1">
          <img src={refreshIcons} alt="" width={24} className="opacity-75" onClick={resetForm}/>
          <button type="submit" className={`${props.type} ${!formData.name.trim() && 'disable'}`} onClick={props.onclick} disabled={!formData.name.trim()} >
            save
          </button>
        </div>
      </form>
    </Container>
  );
}
export default CreateFormProject;
