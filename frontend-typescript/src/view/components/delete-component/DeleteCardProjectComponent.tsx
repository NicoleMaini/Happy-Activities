import { Project } from "../../../interfaces/Project";
import threePoints from "../../../assets/img/three-points.svg";

import axios, { all } from "axios";
import { useState } from "react";
import workingAlone from "../../../assets/img/working-alone.jpg";
import collaboration from "../../../assets/img/collaboration.png";
import { Col, Row } from "react-bootstrap";
import MenuCardProjectComponent from "../project-card/MenuCardProjectComponent";

interface DeleteCardProjectProps {
  project: Project;
}

// display none, display flex

function DeleteCardProjectComponent({ project }: DeleteCardProjectProps) {
  const [errors, setErrors] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [showRestore, setShowRestore] = useState(false);

  const [openMenu, SetOpenMenu] = useState(false);

  return (
    <Row
      className={`delete-card-project-component align-items-center p-2 mb-3 card-${project.type}`}
    >
      <Col sm={1}>
        <div className="img-container">
          <img
            src={
              !project.cover_image
                ? `${
                    project.type === "together" ? collaboration : workingAlone
                  }`
                : project.cover_image
            }
            alt={project.type}
          />
        </div>
      </Col>
      <Col sm={2}>
        <div>title: {project.name}</div>{" "}
      </Col>
      <Col>
        <div>description: {project.description}</div>
      </Col>
      <Col sm={1}>
        <div className="text-center">{project.type}</div>
      </Col>
      <Col sm={1} className="text-end">
        {/* menù delete edit progect */}
        <div className="position-relative">
          <img
            src={threePoints}
            alt="menù-icon"
            width={20}
            className={
              openMenu
                ? "opacity-50 press icons-rotate rotate"
                : "opacity-50 press icons-rotate"
            }
            onClick={() => {
              SetOpenMenu(!openMenu);
            }}
          />
          <MenuCardProjectComponent
            type="delete"
            project={project}
            open={openMenu}
            leave={() => SetOpenMenu(false)}
          />
        </div>
      </Col>
    </Row>
  );
}

export default DeleteCardProjectComponent;
