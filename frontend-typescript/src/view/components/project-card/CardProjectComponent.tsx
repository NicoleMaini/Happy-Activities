import { Col, ProgressBar } from "react-bootstrap";
import { Project } from "../../../interfaces/Project";
import workingAlone from "../../../assets/img/working-alone.jpg";
import collaboration from "../../../assets/img/collaboration.png";
import threePoints from "../../../assets/img/three-points.svg";
import heartGrey from "../../../assets/img/heart-grey.svg";
import heart from "../../../assets/img/heart.svg";
import userImg from "../../../assets/img/user.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { goProject } from "../../../includes/functions";
import { useAppDispatch } from "../../../redux/store";
import MenuCardProjectComponent from "./MenuCardProjectComponent";

interface cardProjectComponentProps {
  project: Project;
  click: (id: number, isFavorite: boolean) => void;
  favorite: number | null;
}

function CardProjectComponent({
  project,
  click,
  favorite,
}: cardProjectComponentProps) {


  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [openMenu, SetOpenMenu] = useState(false);
  

  // logica per la progress bar ---------------------------------

  const taskCompleted = project.tasks.filter(
    (task) => task.progress === "completed"
  );
  const progress = Math.round(
    (taskCompleted.length / project.tasks.length) * 100
  );

  // ------------------------------------------------------------

  return (
    <Col sm={6} md={6} lg={4} xl={3} className="card-project-component">
      {
        <div className={`card-container ${project.type}`}>
          <div className="d-flex justify-content-between align-items-center">
            <div
              className={`img-container ${project.type}`}
              onClick={() => goProject(project, dispatch, navigate)}
            >
              <img
                src={
                  !project.cover_image
                    ? `${
                        project.type === "together"
                          ? collaboration
                          : workingAlone
                      }`
                    : project.cover_image
                }
                alt={project.type}
                width={50}
              />
            </div>

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
              <MenuCardProjectComponent project={project} open={openMenu} leave={()=>SetOpenMenu(false)}/> 
           </div>

          </div>
          <div className="d-flex justify-content-between align-items-center">
            <h5
              className="mt-3"
              onClick={() => goProject(project, dispatch, navigate)}
            >
              {project.name}
            </h5>

            {/* Project favorite */}

            <div>
              {favorite === project.id ? (
                <img
                  src={heart}
                  alt=""
                  width={18}
                  className="favorite"
                  onClick={() => click(project.id, false)}
                />
              ) : (
                <img
                  src={heartGrey}
                  alt=""
                  width={18}
                  className="favorite"
                  onClick={() => click(project.id, true)}
                />
              )}
            </div>
          </div>

          <p
            className="mt-2"
            onClick={() => goProject(project, dispatch, navigate)}
          >
            {project.description}
          </p>
          <div className="w-100 d-flex flex-column mt-auto">
            <span className="text-progress">
              {isNaN(progress) ? 0 : progress}%
            </span>
            <ProgressBar now={progress} variant="warning" />
          </div>

          <div className="mt-2 d-flex">
            {project.users.length <= 1 ? (
              <img
                src={
                  project.users[0].profile_image
                    ? project.users[0].profile_image
                    : userImg
                }
                alt=""
                width={25}
                className="rounded-circle"
              />
            ) : (
              project.users.map((user) => (
                <img
                  key={user.id}
                  src={user.profile_image ? user.profile_image : userImg}
                  alt=""
                  width={20}
                  className="rounded-circle"
                />
              ))
            )}
          </div>
        </div>
      }
    </Col>
  );
}

export default CardProjectComponent;
