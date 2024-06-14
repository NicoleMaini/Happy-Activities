import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SidebarComponent from "../components/SidebarComponent";
import axios from "axios";
import { Project } from "../../interfaces/Project";
import { Container } from "react-bootstrap";

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
    console.log(id);
  }, []);

  const [errors, setErrors] = useState(null);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    axios
      .get(`/api/v1/projects/${id}`)
      .then(resp => setProject(resp.data.data))
      .catch(err => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  }, [id]);

  console.log(project);

  return (
    <Container fluid className="d-flex">
      <SidebarComponent />
      {project && <div>{project.name}</div>}
    </Container>
  );
}

export default ProjectPage;
