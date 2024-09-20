import { Container, Row } from "react-bootstrap";
import SidebarComponent from "../components/SidebarComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { Project } from "../../interfaces/Project";
import CreateProjectPage from "./CreateProjectPage";
import { Link, useNavigate } from "react-router-dom";
import CardProjectComponent from "../components/project-card/CardProjectComponent";
import NavbarComponent from "../components/NavbarComponent";
import { getProjects, projectPageLink } from "../../includes/functions";
import { useAppSelector } from "../../redux/store";

function DashboardPage() {
  const navigate = useNavigate();
  const user = useAppSelector(state=>state.user.user)

  const [projects, setProjects] = useState<Project[] | []>([]);
  const [errors, setErrors] = useState<{ [key: string]: any } | { general: string } | null>(null);
  
  useEffect(() => {
    document.title = "Dashboard";
    getProjects(setProjects, setErrors, navigate);
  }, [projects.length]);

  useEffect(() => {
    if (projects.length === 1) {
      projects.forEach((project) => {
        navigate(projectPageLink(project));
      });
    }
  }, [projects.length]);
  
  // favorite project ------------------------------------------------------
  
  const favoriteProject = user && user.favorite_project

  const [favorite, setFavorite] = useState<number | null>(favoriteProject);

  const favoriteClick = (id: number, isFavorite: boolean) => {
    const sendData = {
      project_id: id,
      isFavorite: isFavorite,
    };

    axios
      .put("/api/v1/user/isFavorite", sendData)
      .then((resp) => {
        const newFavorite = resp.data.user.favorite_project;
        console.log("ok siamo dentro", newFavorite);
        setFavorite(newFavorite);
      })

      .catch((err) => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  };

  return (
    <Container fluid className="p-0">
      <NavbarComponent />
      {projects.length > 1 && (
        <div className="d-flex">
          <SidebarComponent />
          <Row className="mx-4 py-3 w-100 h-100">
            {projects.map((project, i) => (
              <CardProjectComponent
                key={i}
                project={project}
                click={favoriteClick}
                favorite={favorite}
              />
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
}

export default DashboardPage;
