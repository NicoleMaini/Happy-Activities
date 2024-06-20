import { Container } from "react-bootstrap";
import SidebarComponent from "../components/SidebarComponent";
import { useEffect, useState } from "react";
import { Project } from "../../interfaces/Project";
import axios from "axios";
import DeleteProjectComponent from "../components/delete-component/DeleteProjectComponent";

function DeletePlacePage() {
  const [projectsDelete, setProjectsDelete] = useState<Project[] | null>(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/v1/projects`)
      .then(resp => {
        const projs: Project[] = resp.data.data;
        const projsDelete = projs.filter(pro => {
          return pro.progress === "delete";
        });
        setProjectsDelete(projsDelete);
      })
      .catch(err => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  }, []);

  return (
    <Container fluid className="p-0 d-flex">
      <SidebarComponent />
      <div className="m-3 mt-0 w-100">
        {projectsDelete && projectsDelete.map((project, i) => <DeleteProjectComponent key={i} project={project} />)}
      </div>
    </Container>
  );
}
export default DeletePlacePage;
