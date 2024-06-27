export interface Task {
  id: number;
  project_id: number;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  title: string;
  description: string;
  appointment: string;
  progress: string;
  assigned: string;
  microtasks: string;
}

export interface TaskProp {
  task: Task;
}
