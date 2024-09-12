import { Task } from "./Task";
import { User } from "./User";

// interfacce progetto

export interface Project {
  id: number;
  cover_image: string | null;
  name: string;
  type: string;
  description: string;
  progress: string;
  users: User[];
  tasks: Task[];
}

// tipo di progetto

export interface ProjectCardType {
  type: string;
  image: string;
  description: string;
}

export interface ProjectCreate {
  cover_image: string | null;
  name: string;
  type: string;
  description: string;
  progress: string;
}

export interface ProjectDetailsParam {
  projectId: string;
  projectName: string;
}

export interface ProjectProps {
  project: Project;
}
