import { Project } from "../../../interfaces/Project";
import work from "../../../assets/img/work.svg";
import restore from "../../../assets/img/restore.svg";
import trash from "../../../assets/img/trash.svg";
import axios, { all } from "axios";
import { useState } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { title } from "process";
import ModalComponent from "../ModalComponent";
import { Alert } from "react-bootstrap";

interface DeleteProjectProps {
  project: Project;
}

// display none, display flex

function DeleteProjectComponent({ project }: DeleteProjectProps) {
  const [errors, setErrors] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [showRestore, setShowRestore] = useState(false);

  const trashClick = () => {
    axios.delete(`/api/v1/projects/${project.id}`);
  };

  const editClick = () => {
    axios.put(`/api/v1/projects/restore/${project.id}`);
  };

  return (
    <>
      <div className="delete-card-project d-flex w-100 align-items-center">
        <div className="delite-line"></div>
        <div className="img-card-types-special ms-3">
          <img
            src={
              project.cover_image !== "http://localhost:8000/storage" && project.cover_image !== null
                ? project.cover_image
                : work // renderlo dinamico
            }
            alt=""
          />
        </div>
        <div className="ms-3">
          <div>title: {project.name}</div>
          <div>description: {project.description}</div>
        </div>
        <div className="ms-auto">{project.type}</div>
        <div className="d-flex ms-auto delete-card-project-func">
          <img
            src={restore}
            alt=""
            width={25}
            className="me-3"
            onClick={() => {
              setShowRestore(true);
            }}
          />
          <img
            src={trash}
            alt=""
            width={25}
            onClick={() => {
              setShowDelete(true);
            }}
          />
          {showDelete && (
            <ModalComponent
              title="Delete Project"
              question="Are you sure you want to permanently delete the project?"
              onclick={trashClick}
            />
          )}
          {showRestore && (
            <ModalComponent title="Restore Project" question="Do you want restore project?" onclick={editClick} />
          )}
        </div>
      </div>
    </>
  );
}

export default DeleteProjectComponent;
