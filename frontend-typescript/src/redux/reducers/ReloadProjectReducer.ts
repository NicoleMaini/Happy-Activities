import {
  ReloadProjects,
  START_LOAD_PROJECTS,
  STOP_LOAD_PROJECTS,
} from "./../actions/index";

interface ReloadState {
  reload: boolean;
}

const initialState: ReloadState = {
  reload: false,
};

const ReloadProjectReducer = (
  state: ReloadState = initialState,
  action: ReloadProjects
): ReloadState => {
  switch (action.type) {
    case START_LOAD_PROJECTS:
      return {
        ...state,
        reload: true, // Inverte il valore booleano
      };
    case STOP_LOAD_PROJECTS:
      return {
        ...state,
        reload: false, // Inverte il valore booleano
      };
    default:
      return state;
  }
};

export default ReloadProjectReducer;
