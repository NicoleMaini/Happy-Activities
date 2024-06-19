import { User } from "./User";

export interface Project {
  id: number;
  cover_image: string | null;
  name: string;
  type: string;
  description: string;
  progress: string;
  users: User[];
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
