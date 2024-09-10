import { Project } from "../../interfaces/Project";
import { RESET_PROJECT, PROJECT, ProjectActions } from "../actions";

interface ProjectState {
    project: Project | null;
  }
  
  const initialState: ProjectState ={
    project: null,
  };
  
  const ProjectReducer = (state: ProjectState = initialState, action: ProjectActions): ProjectState => {
    switch (action.type) {
      case PROJECT:
        return {
          ...state,
          project: action.payload.project,
        };
      case RESET_PROJECT:
        return {
          ...state,
          project: null,
        };
  
      default:
        return state;
    }
  };

  export default ProjectReducer;