import { Project } from "../../interfaces/Project";
import { User } from "../../interfaces/User";

export const LOGIN = "login" as const;
export const LOGOUT = "logout" as const;

interface LoginAction {
  type: typeof LOGIN;
  payload: {
    user: User;
  };
}

interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActions = LoginAction | LogoutAction;

export const PROJECT = "project" as const;
export const RESET_PROJECT = "reset_project" as const;

interface CurrentProject {
  type: typeof PROJECT;
  payload: {
    project: Project;
  };
}

interface ResetProject {
  type: typeof RESET_PROJECT;
}

export type ProjectActions = CurrentProject | ResetProject;

export const START_LOAD_PROJECTS = "start_reload_projects" as const;
export const STOP_LOAD_PROJECTS = "stop_load_projects" as const;

interface StartLoadProjects {
  type: typeof START_LOAD_PROJECTS;
}

interface StopLoadProjects {
  type: typeof STOP_LOAD_PROJECTS;
}

export type ReloadProjects = StartLoadProjects | StopLoadProjects;