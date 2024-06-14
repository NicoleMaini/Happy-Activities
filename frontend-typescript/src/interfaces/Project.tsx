import { User } from "./User";

export interface Project {
  id: number;
  cover_image: string | null;
  name: string;
  type: string;
  description: string | null;
  progress: string;
  users: User[];
}

export interface ProjectDetailsParam {
  projectId: string;
  projectName: string;
}
