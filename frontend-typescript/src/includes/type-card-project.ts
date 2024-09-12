import { ProjectCardType } from "../interfaces/Project";
import collaboration from "../assets/img/collaboration.png";
import workingkAlone from "../assets/img/working-alone.jpg";

export const typesCardProject: ProjectCardType[] = [
  { type: "together", image: collaboration, description: "Create projects, assign tasks, schedule appointments, and collaborate with your colleagues through chat to successfully achieve your objectives!" },
  { type: "alone", image: workingkAlone, description: "Start your project, break it down into tasks, complete them, and make sure to mark your important appointments!" },
];
