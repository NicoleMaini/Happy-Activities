import { NavigateFunction, Location } from "react-router-dom";
import { Project } from "../interfaces/Project";
import { PROJECT, ProjectActions, RESET_PROJECT } from "../redux/actions";

// FUNZIONI PER LA GESTIONE DEL PROGETTO -------------------------------------------------

// link della pagina progetto
export const projectPageLink = (project: Project) => {
  return `/dashboard/project/${project.id}-${project.name
    .replace(/\s+/g, "-")
    .toLowerCase()}`;
};

// funzione salvataggio progetto nello stateRedux
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

// funzione che resetta a null lo stateRedux
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
