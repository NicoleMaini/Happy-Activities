export interface Project {
  id: number;
  cover_image: string | null;
  name: string;
  type: string;
  description: string | null;
  progress: string;
}
