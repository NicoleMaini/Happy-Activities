import { Col } from "react-bootstrap";
import { Project } from "../../../interfaces/Project";
import work from "../../../assets/img/work.svg";
import trash from "../../../assets/img/trash.svg";
import edit from "../../../assets/img/edit.png";
import heartGrey from "../../../assets/img/heart-grey.svg";
import userImg from "../../../assets/img/user.png";
import { useNavigate } from "react-router-dom";

interface CardProjectProps {
  project: Project;
}

function CardProjectComponent({ project }: CardProjectProps) {
  const navigate = useNavigate();
  console.log("project", project);

  const classStyle = project.type + " p-3 overflow-hidden";

  return (
    <Col
      md={4}
      lg={3}
      xl={2}
      className={classStyle}
      onClick={() => navigate(`/dashboard/project/${project.id}-${project.name.replace(/\s+/g, "-").toLowerCase()}`)}
    >
      <div className="bg-card-pro " style={{ height: "18rem" }}>
        <div className="img-card-types card-project p-2">
          <img
            src={
              project.cover_image !== "http://localhost:8000/storage" && project.cover_image !== null
                ? project.cover_image
                : work
            }
            alt={project.type}
            width={50}
          />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="text-start">{project.name}</h5>
          <div>
            <img src={heartGrey} alt="" width={18} />
          </div>
        </div>
        <p className="mt-3">{project.description.substring(0, 50) + "..."}</p>
        <div className="card-project-bottom mt-auto">
          <div>
            {project.users.map(user => (
              <img
                src={user.profile_image ? user.profile_image : userImg}
                alt=""
                width={30}
                className="rounded-circle"
              />
            ))}
          </div>
          <div>
            <img src={edit} alt="" width={14} />
            <img src={trash} alt="" width={20} className="ms-3" />
          </div>
        </div>
      </div>
    </Col>
  );
}

export default CardProjectComponent;
