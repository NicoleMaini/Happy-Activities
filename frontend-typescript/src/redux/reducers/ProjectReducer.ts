import { Project } from "../../interfaces/Project";
import { CurrentProject, PROJECT } from "../actions";

interface ProjectState {
    project: Project | null;
  }
  
  const initialState: ProjectState ={
    project: null,
  };
  
  const ProjectReducer = (state: ProjectState = initialState, action: CurrentProject): ProjectState => {
    switch (action.type) {
      case PROJECT:
        return {
          ...state,
          project: action.payload.project,
        };
  
      default:
        return state;
    }
  };

  export default ProjectReducer;