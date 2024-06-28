export interface MicroTask {
  id: number;
  task_id: number;
  title: string;
  description: string | null;
  assigned: string | null;
  enum: string;
}

export interface MicroTaskProps {
  microTask: MicroTask;
}
