import { TaskProp } from "../../../interfaces/Task";
import MicroTaskComponent from "./MicrotaskComponent";

function TaskComponent({ task }: TaskProp) {
  return (
    <div className="d-inline-block container-task">
      <div className="container-card-task">
        <h6>{task.title}</h6>
        <div className="project-page-line"></div>
        {task.microtasks.length > 0
          ? task.microtasks.map(microtask => <MicroTaskComponent microTask={microtask} key={microtask.id} />)
          : "aggiugi un task"}
      </div>
    </div>
  );
}
export default TaskComponent;
