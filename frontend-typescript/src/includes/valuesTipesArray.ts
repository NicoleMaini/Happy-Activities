import { CardType } from "../interfaces/HomeCard";
import work from "../assets/img/work.svg";
import study from "../assets/img/study.svg";
import event from "../assets/img/event.svg";
import freetime from "../assets/img/freetime.svg";

export const valuesTypesArray: CardType[] = [
  { type: "work", image: work, style: "work", description: "" },
  { type: "study", image: study, style: "study", description: "" },
  { type: "event", image: event, style: "event", description: "" },
  { type: "free-time", image: freetime, style: "free-time", description: "" },
];
