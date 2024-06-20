import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import { Project } from "../../interfaces/Project";
import { Container } from "react-bootstrap";
import SidebarComponent from "../components/SidebarComponent";

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

  console.log(id);

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

  console.log(project);

  return (
    <>
      <Container fluid className="d-flex p-0 h-100">
        <SidebarComponent />
        {project && (
          <div>
            {project.name}
            {project.description}
          </div>
        )}
      </Container>
    </>
  );
}

export default ProjectPage;
