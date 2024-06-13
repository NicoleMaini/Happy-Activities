import { Container } from "react-bootstrap";
import SidebarComponent from "../components/SidebarComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../../redux/store";

function DashboardPage() {
  // const [projects, setProjects] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    axios
      .get("api/v1/projects")
      .then(resp => console.log("Progetto", resp))
      .catch(err => {
        setErrors(err.response?.data.errors || { general: "Unknown error" });
      });
  }, []);

  return (
    <Container fluid className="p-0 d-flex">
      <SidebarComponent />
    </Container>
  );
}

export default DashboardPage;
