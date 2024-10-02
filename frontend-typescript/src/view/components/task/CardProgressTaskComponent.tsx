import { Col } from "react-bootstrap";
import { Task, TaskProgress } from "../../../interfaces/Task";
import plus from "../../../assets/img/plus.svg";
import TaskComponent from "./TaskComponent";
import { useEffect, useState } from "react";

interface CardProgressTaskComponentProps {
  progress: TaskProgress;
  tasks: Task[] | null;
}

function CardProgressTaskComponent({
  progress,
  tasks,
}: CardProgressTaskComponentProps) {
  const [typeTasks, setTypeTasks] = useState<Task[] | []>([]);

  // filtra i task per progetto

  useEffect(() => {
    if (tasks) {
      const filterTasks = tasks.filter(
        (task) => task.progress === progress.type
      );
      setTypeTasks(filterTasks);
    }
  }, [tasks ]);

  // ----------------------------------------------------

  return (
    <Col className="card-task-progress-component h-100 mt-0">
      <div className="card-task-container">
        <div className="scroll">
          <div className={`hat ${progress.type.replace(" ", "-")}`}>
            {progress.type}
          </div>
          <div className="task-container">
            {typeTasks.length >= 1 ? (
              typeTasks.map((task) => (
                <TaskComponent progressType={progress.type} task={task} />
              ))
            ) : (
              <h6 className={`task ${progress.type.replace(" ", "-")}`}>
                There are no tasks here
              </h6>
            )}
            <div className="img-container">
              <img src={plus} alt="" width={18} />
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
}
export default CardProgressTaskComponent;
