import { Project } from "./../interfaces/Project";
import { NavigateFunction, Location } from "react-router-dom";
import { PROJECT, ProjectActions, RESET_PROJECT } from "../redux/actions";
import axios from "axios";

// FUNZIONI PER LA GESTIONE DEL PROGETTO -------------------------------------------------

// link della pagina progetto
export const projectPageLink = (project: Project) => {
  return `/dashboard/project/${project.id}-${project.name
    .replace(/\s+/g, "-")
    .toLowerCase()}`;
};
// ----------------------------------------------------------------------------------------

// funzione salvataggio progetto nello stateRedux -----------------------------------------
export const goProject = (
  project: Project,
  dispatch: (action: ProjectActions) => void,
  navigate?: NavigateFunction
) => {
  const action: ProjectActions = {
    type: PROJECT,
    payload: { project },
  };

  dispatch(action);

  if (navigate) {
    navigate(projectPageLink(project));
  }
};
// ----------------------------------------------------------------------------------------

// funzione che resetta a null lo stateRedux ----------------------------------------------
export const resetProject = (
  project: Project,
  dispatch: (action: ProjectActions) => void,
  location: Location
) => {
  if (location.pathname !== projectPageLink(project)) {
    const action: ProjectActions = { type: RESET_PROJECT } as const;
    dispatch(action);
  }
};
// ----------------------------------------------------------------------------------------

// FUNZIONI PER LE FETCH DEI PROGETTI -----------------------------------------------------

// fetch per recuperare i progetti e dividerli in active e delete -------------------------
export const getProjects = (
  setProjectsActive: (projects: Project[]) => void,
  setErrors: (errors: { [key: string]: any } | { general: string }) => void,
  navigate?: NavigateFunction,
  setProjectsDelete?: (projects: Project[]) => void
) => {
  axios
    .get("/api/v1/projects")
    .then((resp) => {
      const projs: Project[] = resp.data.data;
      const projsActive = projs.filter((pro) => {
        return pro.progress === "active";
      });
      setProjectsActive(projsActive);
      const projsDelete = projs.filter((pro) => {
        return pro.progress === "delete";
      });
      if (setProjectsDelete) {
        setProjectsDelete(projsDelete);
      }
    })
    .catch((err) => {
      if (navigate) {
        navigate("/dashboard/create-project");
      }
      setErrors(err.response?.data.errors || { general: "Unknown error" });
    });
};
// ----------------------------------------------------------------------------------------

// CHANGE STATUS FUNCTION -----------------------------------------------------------------

export interface SendData {
  id: number;
  action: string;
}

export const changeStatus = (
  url: string,
  sendData: SendData,
  setErrors: (errors: { [key: string]: any } | { general: string }) => void
) => {
  axios
    .put(url, sendData)
    .then((resp) => {
      console.log("tutto ok", resp.data);
    })
    .catch((err) => {
      setErrors(err.response?.data.errors || { general: "Unknown error" });
      // Gestisci l'errore, ad esempio mostrando un messaggio all'utente
    });
};

// DISAPPEARD ANIMATION FOR MOVE OR DELETE ------------------------------------------------

interface DisappeardAnimationParam {
  showCard: boolean;
  setIsMounted: (value: string) => void;
}

export const disappeardAnimation = ({
  showCard,
  setIsMounted,
}: DisappeardAnimationParam) => {
  if (!showCard) {
    const timer = setTimeout(() => {
      setIsMounted("d-none");
    }, 200); // Durata dell'animazione (0.5 secondi)
    return () => clearTimeout(timer);
  } else {
    // Quando `showCard` diventa true, rimuoviamo la classe `d-none`
    setIsMounted("");
  }
  return () => {};
};

// disappeardAnimation(showCard, setIsMounted)

//FUNZIONE ELIMINA - DISTRUGGI

export const deleteCard = (
  url: string,
  setErrors: (errors: { [key: string]: any } | { general: string }) => void
) => {
  axios
    .delete(url)
    .then((resp) => {
      console.log("tutto ok", resp.data);
    })
    .catch((err) => {
      setErrors(err.response?.data.errors || { general: "Unknown error" });
    });
};
