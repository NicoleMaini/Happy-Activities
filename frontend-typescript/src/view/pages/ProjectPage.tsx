import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Project } from "../../interfaces/Project";
import { Container, Row } from "react-bootstrap";
import SidebarComponent from "../components/SidebarComponent";
import TaskComponent from "../components/task/TaskComponent";
import NavbarComponent from "../components/NavbarComponent";
import { goProject } from "../../includes/functions";
import { useAppDispatch } from "../../redux/store";
import { typesCardTaskProgress } from "../../includes/type-card-project";
import CardProgressTaskComponent from "../components/task/CardProgressTaskComponent";

function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [id, setId] = useState<string>();

  const dispatch = useAppDispatch();

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
    if (id) {
      axios
        .get(`/api/v1/projects/${id}`)
        .then((resp) => {
          goProject(resp.data.data, dispatch);
          setProject(resp.data.data);
          document.title = resp.data.data.name;
        })
        .catch((err) => {
          setErrors(err.response?.data.errors || { general: "Unknown error" });
        });
    }
  }, [id]);

  console.log(projectId)

  return (
    <>
      <NavbarComponent />
      <div className="d-flex page-component">
        <SidebarComponent />
        <div className="w-100 m-3">
          <Row>
            {typesCardTaskProgress.map((progress, i)=>
              <CardProgressTaskComponent key={i} progress={progress} tasks={project ? project.tasks : null}/>
            )}
          </Row>
        </div>
      </div>
    </>
  );
}

export default ProjectPage;
