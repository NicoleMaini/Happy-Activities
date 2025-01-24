import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataProject, Project } from "../../interfaces/Project";
import { Row } from "react-bootstrap";
import SidebarComponent from "../components/SidebarComponent";
import NavbarComponent from "../components/NavbarComponent";
import { goProject, useGetFetch } from "../../includes/functions";
import { useAppDispatch } from "../../redux/store";
import { typesCardTaskProgress } from "../../includes/type-card-project";
import CardProgressTaskComponent from "../components/task/CardProgressTaskComponent";
import MySpinner from "../components/my-component/MySpinner";

function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  
  // fetcha il progetto
  const { data, error } = useGetFetch<DataProject>(`/api/v1/projects/${projectId}`);

  const [project, setProject] = useState<Project | null>(null);
  const [load, setLoad] = useState(false);

  // salva il progetto
  useEffect(() => {
    if (data) {
      goProject(data.data, dispatch);
      setProject(data.data);
      document.title = data.data.name;
      setLoad(!load);
    }
  }, [projectId, data]);

 
  return (
    <>
      <NavbarComponent />
      <div className="d-flex page-component">
        <SidebarComponent />
        <div className="w-100 m-3">
          {load ? (
            <Row>
              {
                typesCardTaskProgress.map((progress, i) => (
                  <CardProgressTaskComponent
                    key={i}
                    progress={progress.type}
                    tasks={project ? project.tasks : []}
                  />
                ))
              }
            </Row>
          ) : (
            <MySpinner/>
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectPage;
