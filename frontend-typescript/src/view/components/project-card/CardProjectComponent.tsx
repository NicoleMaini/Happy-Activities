import { Col } from "react-bootstrap";
import {ProjectProps } from "../../../interfaces/Project";
import work from "../../../assets/img/work.svg";
import study from "../../../assets/img/study.svg";
import event from "../../../assets/img/event.svg";
import freeTime from "../../../assets/img/freetime.svg";
import trash from "../../../assets/img/trash.svg";
import edit from "../../../assets/img/edit.png";
import heartGrey from "../../../assets/img/heart-grey.svg";
import userImg from "../../../assets/img/user.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import ModalComponent from "../ModalComponent";
import ModalEditProjectComponent from "../ModalEditProjectComponent";
import { goProject } from "../../../includes/functions";
import { useAppDispatch } from "../../../redux/store";


function CardProjectComponent({ project }: ProjectProps) {
  console.log("step 3", project);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const classStyle = project.type + " p-3 overflow-hidden";
  const question = `Do you want delete ${project.name} project`;

  return (
    <Col md={4} lg={3} xl={2} className={classStyle}>
      <div className="bg-card-pro" style={{ height: "18rem" }}>
        <div className="img-card-types card-project p-2">
          <div className="text-start" onClick={()=>goProject(project, dispatch, navigate)}>
            <img
              src={
                project.cover_image
                  ? project.cover_image
                  : project.type === "work"
                  ? work
                  : project.type === "study"
                  ? study
                  : project.type === "event"
                  ? event
                  : project.type === "free-time"
                  ? freeTime
                  : ""
              }
              alt={project.type}
              width={50}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-start" onClick={()=>goProject(project, dispatch, navigate)}>{project.name}</div>
          <div>
            <img src={heartGrey} alt="" width={18} />
          </div>
        </div>
        <p className="mt-3" onClick={()=>goProject(project, dispatch, navigate)}>{project.description.substring(0, 50) + "..."}</p>
        <div className="card-project-bottom mt-auto pb-0">
          <div>
            {project.users.map((user) => (
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
            {showDelete && (
              <ModalComponent
                title="Move on trash"
                question={question}
                onclick={trashClick}
              />
            )}
            {showEdit && (
              <ModalEditProjectComponent
                title="Edit this project"
                project={project}
              />
            )}
          </div>
        </div>
      </div>
    </Col>
  );
}

export default CardProjectComponent;
