import { Task } from "../../../interfaces/Task";
import arrow from "../../../assets/img/arrow-down.svg";
import MicroTaskComponent from "./MicrotaskComponent";

interface TaskProp {
  progressType: string;
  task: Task;
}

function TaskComponent({ progressType, task }: TaskProp) {
  return (
    <div className={`task ${progressType.replace(" ", "-")}`}>
      <div className="d-flex align-items-center mb-2">
        <h5>{task.title}</h5>
        <div className="press ms-auto z-0"><img src={arrow} alt="" width={20} /></div>
      </div>
      <p>{task.description && task.description}</p>
    </div>
  );
}
export default TaskComponent;
