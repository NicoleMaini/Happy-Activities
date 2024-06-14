import { Container } from "react-bootstrap";
import SidebarComponent from "../components/SidebarComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { Project } from "../../interfaces/Project";
import CreateProjectPage from "./CreateProjectPage";
import { Link, useNavigate } from "react-router-dom";

function DashboardPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Dashboard";
    axios
      .get("/api/v1/projects")
      .then(resp => setProjects(resp.data.data))
      .catch(err => {
        navigate("/dashboard/create-project");
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  }, []);

  useEffect(() => {
    if (projects !== null) {
      if (projects.length === 1) {
        projects.forEach(project => {
          navigate(`/dashboard/project/${project.id}-${project.name.replace(/\s+/g, "-").toLowerCase()}`);
        });
      }
    }
  }, [projects]);

  return (
    <Container fluid className="p-0 d-flex">
      {projects && projects.length > 1 && (
        <>
          <SidebarComponent />
          <div>
            {projects.map((project, i) => (
              <div key={i}>{project.name}</div>
            ))}
          </div>
        </>
      )}
    </Container>
  );
}

export default DashboardPage;
