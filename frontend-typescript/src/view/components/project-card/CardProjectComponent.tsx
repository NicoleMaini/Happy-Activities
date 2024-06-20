import { Alert, Col, Modal } from "react-bootstrap";
import { ProjectProps } from "../../../interfaces/Project";
import work from "../../../assets/img/work.svg";
import trash from "../../../assets/img/trash.svg";
import edit from "../../../assets/img/edit.png";
import heartGrey from "../../../assets/img/heart-grey.svg";
import userImg from "../../../assets/img/user.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import ModalComponent from "../ModalComponent";
import ModalEditProjectComponent from "../ModalEditProjectComponent";

function CardProjectComponent({ project }: ProjectProps) {
  console.log("project", project);

  const [errors, setErrors] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const trashClick = () => {
    axios.put(`/api/v1/projects/delete/${project.id}`);
  };
  const editClick = () => {
    axios
      .put(`/api/v1/projects/delete/${project.id}`)
      .then(resp => {})
      .catch(err => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  };

  const classStyle = project.type + " p-3 overflow-hidden";
  const question = `Do you want delete ${project.name} project`;

  return (
    <Col md={4} lg={3} xl={2} className={classStyle}>
      <div className="bg-card-pro" style={{ height: "18rem" }}>
        <div className="img-card-types card-project p-2">
          <Link
            to={`/dashboard/project/${project.id}-${project.name.replace(/\s+/g, "-").toLowerCase()}`}
            className="text-start"
          >
            <img
              src={
                project.cover_image !== "http://localhost:8000/storage" && project.cover_image !== null
                  ? project.cover_image
                  : work
              }
              alt={project.type}
              width={50}
            />
          </Link>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <Link
            to={`/dashboard/project/${project.id}-${project.name.replace(/\s+/g, "-").toLowerCase()}`}
            className="text-start"
          >
            {project.name}
          </Link>
          <div>
            <img src={heartGrey} alt="" width={18} />
          </div>
        </div>
        <p className="mt-3">{project.description.substring(0, 50) + "..."}</p>
        <div className="card-project-bottom mt-auto pb-0">
          <div>
            {project.users.map(user => (
              <img
                key={user.id}
                src={user.profile_image ? user.profile_image : userImg}
                alt=""
                width={30}
                className="rounded-circle"
              />
            ))}
          </div>
          <div>
            <img
              src={edit}
              alt=""
              width={14}
              onClick={() => {
                setShowEdit(true);
              }}
            />
            <img
              src={trash}
              alt=""
              width={20}
              className="ms-3"
              onClick={() => {
                setShowDelete(true);
              }}
            />
            {showDelete && <ModalComponent title="Move on trash" question={question} onclick={trashClick} />}
            {showEdit && <ModalEditProjectComponent title="Edit this project" project={project} />}
          </div>
        </div>
      </div>
    </Col>
  );
}

export default CardProjectComponent;
