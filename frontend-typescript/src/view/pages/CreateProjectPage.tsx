import CardTypeProjectComponent from "../components/create-project/CardTypeProjectComponent";
import { useState } from "react";
import CreateFormProject from "../components/create-project/CreateFormProject";
import { typesCardProject } from "../../includes/type-card-project";
import { ProjectCardType } from "../../interfaces/Project";
import NavbarComponent from "../components/NavbarComponent";

function CreateProjectPage() {
  const [type, setType] = useState<string | null>();

  const [slideIn, setSlideIn] = useState(false); // Stato per tracciare quale animazione eseguire
  const [slideOut, setSlideOut] = useState(false); // Stato per tracciare quale animazione eseguire

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
          <h3 className="step-title">
            <span>STEP 1 - </span> Choose your type of project
          </h3>
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
          <h3 className="step-title"> STEP 2 - Create Project Details</h3>
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
          } ${slideIn && slideOut && ""}`}
        >
          <h3 className="step-title">STEP 3 - Finalize Project</h3>
        </div>
      </div>
    </>
  );
}

export default CreateProjectPage;

// import React, { useRef } from 'react';
// import './App.css';  // Assicurati che i tuoi stili CSS siano importati

// const App: React.FC = () => {
//   // Usa useRef per ottenere riferimenti agli elementi che vuoi animare
//   const elementUpRef = useRef<HTMLDivElement>(null);
//   const elementDownRef = useRef<HTMLDivElement>(null);

//   // Funzione per avviare l'animazione
//   const startAnimation = () => {
//     if (elementUpRef.current) {
//       elementUpRef.current.style.animation = 'moveUp 1.5s ease forwards';
//     }
//     if (elementDownRef.current) {
//       elementDownRef.current.style.animation = 'moveUpFromBottom 1.5s ease forwards';
//     }
//   };

//   return (
//     <div className="container">
//       <div ref={elementUpRef} className="element-up">
//         Sposta verso l'alto
//       </div>
//       <div ref={elementDownRef} className="element-down">
//         Entra dal basso
//       </div>
//       <button onClick={startAnimation}>Inizia Animazione</button>
//     </div>
//   );
// };

// export default App;
