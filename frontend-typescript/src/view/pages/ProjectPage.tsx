import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import work from "../../assets/img/work.svg";
import study from "../../assets/img/study.svg";
import event from "../../assets/img/event.svg";
import freeTime from "../../assets/img/freetime.svg";
import axios from "axios";
import { Project } from "../../interfaces/Project";
import { Container, Row } from "react-bootstrap";
import SidebarComponent from "../components/SidebarComponent";
import TaskComponent from "../components/task/TaskComponent";
import NavbarComponent from "../components/NavbarComponent";

function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [id, setId] = useState<string>();

  useEffect(() => {
    if (projectId) {
      const numericPart = projectId.match(/^\d+/);
      if (numericPart) {
        setId(numericPart[0]);
      }
    }
  }, []);

  const [errors, setErrors] = useState(null);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    axios
      .get(`/api/v1/projects/${id}`)
      .then(resp => {
        console.log("resp", resp.data.data);
        setProject(resp.data.data);
      })
      .catch(err => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  }, [id]);

  console.log("progetto", project && project.tasks);

  return (
    <>
      <NavbarComponent project={project}/>
      <Container fluid className="d-flex p-0 h-100">
        <SidebarComponent />
        {project && (
          <div className="m-4 mt-3 container-project-page work wv">
            <div className="img-card-types card-project project-page p-2">
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
              />
            </div>
            <div className="text-left my-3 mx-3">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
            <div className="project-page-line"></div>
            <div>
              {project && project.tasks ? (
                <div className="mt-4 scroll-container">
                  {project.tasks.map(task => (
                    <TaskComponent task={task} key={task.id} />
                  ))}
                </div>
              ) : (
                "create task"
              )}
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

export default ProjectPage;
