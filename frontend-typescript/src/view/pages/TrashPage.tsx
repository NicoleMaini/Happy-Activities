import { Container } from "react-bootstrap";
import SidebarComponent from "../components/SidebarComponent";
import { useEffect, useState } from "react";
import { Project } from "../../interfaces/Project";
import DeleteCardProjectComponent from "../components/delete-component/DeleteCardProjectComponent";
import NavbarComponent from "../components/NavbarComponent";
import { getProjects } from "../../includes/functions";

function TrashPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [projectsActive, setProjectsActive] = useState<Project[] | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: any } | { general: string } | null>(null);

  useEffect(() => {
    getProjects(setProjectsActive, setErrors, undefined, setProjects);
  }, [projects?.length]);

  return (
    <>
      <NavbarComponent />
      <Container fluid className="p-0 d-flex">
        <SidebarComponent />
        <div className="m-3 mt-0 w-100 py-3">
          {projects &&
            projects.map((project) => (
              <DeleteCardProjectComponent key={project.id} project={project} />
            ))}
        </div>
      </Container>
    </>
  );
}
export default TrashPage;
