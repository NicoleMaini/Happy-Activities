import CardTypeProjectComponent from "../components/create-project/CardTypeProjectComponent";
import { useEffect, useState } from "react";
import CreateFormProject from "../components/create-project/CreateFormProject";
import { typesCardProject } from "../../includes/type-card-project";
import { ProjectCardType } from "../../interfaces/Project";
import NavbarComponent from "../components/NavbarComponent";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import { projectPageLink } from "../../includes/functions";

function CreateProjectPage() {
  const project = useAppSelector((state) => state.project.project);

  const [type, setType] = useState<string | null>();

  const [slideIn, setSlideIn] = useState(false); // Stato per tracciare quale animazione eseguire
  const [slideOut, setSlideOut] = useState(false); // Stato per tracciare quale animazione eseguire

  useEffect(() => {
    document.title = "Create project";
  }, []);

  const handleClick = (type: string, fun: () => void) => {
    setType(type);
    fun();
  };

  const changeSlide = (hideSlideIn: boolean, hideSlideOut: boolean) => {
    setSlideIn(hideSlideIn);
    setSlideOut(hideSlideOut);
  };

  return (
    <>
      <NavbarComponent />
      <div className="create-project-first-component">
        <div
          className={`my-card ${slideIn && !slideOut && "slide-out"} ${
            slideIn && slideOut && "slide-out"
          }`}
        >
          <h4>
            <span>STEP 1 - </span> Choose your type of project
          </h4>
          <div className="container-cards">
            {typesCardProject.map((type: ProjectCardType, i) => (
              <CardTypeProjectComponent
                key={i}
                type={type.type}
                image={type.image}
                description={type.description}
                onClick={() => {
                  if (type) {
                    handleClick(type.type, () => {
                      changeSlide(true, false);
                    });
                  }
                }}
              />
            ))}
          </div>
        </div>
        <div
          className={`my-card ${!slideIn && !slideOut && "slide-in"} ${
            slideIn && !slideOut && ""
          } ${slideIn && slideOut && "slide-out"}`}
        >
          <h4> STEP 2 - Create Project Details</h4>
          {type && (
            <CreateFormProject
              type={type}
              onclick={() => {
                changeSlide(true, true);
              }}
            />
          )}
        </div>
        <div
          className={`my-card  ${!slideIn && !slideOut && "slide-in"} ${
            slideIn && !slideOut && "slide-in"
          } ${slideIn && slideOut && ""} ${type} p-4 third-slide`}
        >
          <h4 className="p-0">STEP 3 - Well done!</h4>
          <h4 className={`py-2 color-${type}`}>PROJECT CREATES SUCCESSFULLY</h4>
            {project && (
              <Link to={projectPageLink(project)} className={`link-go-to ${type} mb-3`}>go to the project</Link>
            )}
            <Link to={"/dashboard"} className={`link-go-to ${type}`}>back to the dashborad</Link>
        </div>
      </div>
    </>
  );
}

export default CreateProjectPage;
