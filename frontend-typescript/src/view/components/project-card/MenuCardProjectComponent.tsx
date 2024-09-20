import { useState } from "react";
import ModalComponent from "../ModalComponent";
import ModalEditProjectComponent from "../ModalEditProjectComponent";
import axios from "axios";
import { Project } from "../../../interfaces/Project";
import edit from "../../../assets/img/edit-minimal.svg";
import trash from "../../../assets/img/trash-minimal.svg";

interface MenuCardProjectComponentProps {
  project: Project;
  open: boolean; // Aggiungi questa riga
  leave: () => void;
}

function MenuCardProjectComponent({
  project,
  open,
  leave,
}: MenuCardProjectComponentProps) {
  const [errors, setErrors] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const trashClick = () => {
    axios.put(`/api/v1/projects/delete/${project.id}`);
  };
  const editClick = () => {
    axios
      .put(`/api/v1/projects/delete/${project.id}`)
      .then((resp) => {})
      .catch((err) => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  };

  return (
    <div
      className={`menu-card-component ${open ? "visible" : "hidden"}`}
      onMouseLeave={leave}
    >
      <div
        className="mb-2 press selected d-flex justify-content-between w-100"
        onClick={() => {
          setShowEdit(true);
        }}
      >
        <p>Edit</p>
        <img src={edit} alt="" width={14} />
      </div>
      <div
        className="press selected d-flex justify-content-between"
        onClick={() => {
          setShowDelete(true);
        }}
      >
        <p>Delete</p>
        <img src={trash} alt="" width={14} />
      </div>

      {showDelete && (
        <ModalComponent
          title="Move on trash"
          question={`Do you want delete ${project.name} project?`}
          onclick={trashClick}
        />
      )}
      {showEdit && (
        <ModalEditProjectComponent
          title={`Edit ${project.name}`}
          project={project}
        />
      )}
    </div>
  );
}

export default MenuCardProjectComponent;
