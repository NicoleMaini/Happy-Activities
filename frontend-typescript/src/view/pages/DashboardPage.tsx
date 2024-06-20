import { Container, Row } from "react-bootstrap";
import SidebarComponent from "../components/SidebarComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { Project } from "../../interfaces/Project";
import CreateProjectPage from "./CreateProjectPage";
import { Link, useNavigate } from "react-router-dom";
import CardProjectComponent from "../components/project-card/CardProjectComponent";

function DashboardPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Dashboard";
    axios
      .get("/api/v1/projects")
      .then(resp => {
        console.log("resp.data", resp.data.data);
        const projs: Project[] = resp.data.data;
        const projsActive = projs.filter(pro => {
          return pro.progress === "active";
        });
        setProjects(projsActive);
      })
      .catch(err => {
        navigate("/dashboard/create-project");
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  }, [projects]);

  useEffect(() => {
    if (projects !== null) {
      if (projects.length === 1) {
        projects.forEach(project => {
          navigate(`/dashboard/project/${project.id}-${project.name.replace(/\s+/g, "-").toLowerCase()}`);
        });
      }
    }
  }, []);

  return (
    <Container fluid className="p-0 d-flex">
      {projects && projects.length > 1 && (
        <>
          <SidebarComponent />
          <Row className="mx-4 py-3 w-100">
            {projects.map((project, i) => (
              <CardProjectComponent key={i} project={project} />
            ))}
          </Row>
        </>
      )}
    </Container>
  );
}

export default DashboardPage;
