import { Col } from "react-bootstrap";
import { Task, TaskProgress } from "../../../interfaces/Task";
import plus from "../../../assets/img/plus.svg";
import TaskComponent from "./TaskComponent";
import { useEffect, useState } from "react";
import axios from "axios";

interface CardProgressTaskComponentProps {
  progress: string;
  tasks: Task[] | [];
}

function CardProgressTaskComponent({
  progress,
  tasks,
}: CardProgressTaskComponentProps) {

  const [filteredTasks, setFilteredTasks] = useState<Task[] | []>([]);

  
  // filtra i task per progetto

  const getfilterTasks = (tasks: Task[]) => {
    console.log('tasks', tasks);
    const filtered = tasks.filter((task) => task.progress === progress);
    setFilteredTasks([...filtered]);
  };

  const updateTaskProgress = (prId: number) => {
    axios
      .get(`/api/v1/tasks/${prId}/get-tasks-project/`)
      .then((resp) => {
        getfilterTasks(resp.data.data);
      
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log('stato arr filtr',filteredTasks);

  useEffect(() => {
    if (tasks) {
      getfilterTasks(tasks);
    }
  }, [tasks]);

  // ----------------------------------------------------

  return (
    <Col className="card-task-progress-component h-100 mt-0">
      <div className="card-task-container">
        <div className="scroll">
          <div className={`hat ${progress.replace(" ", "-")}`}>
            {progress}
          </div>
          <div className="task-container">
            {filteredTasks.length >= 1 ? (
              filteredTasks.map((task) => (
                <TaskComponent
                  key={task.id}
                  task={task}
                  onRefresh={updateTaskProgress}
                />
              ))
            ) : (
              <h6 className={`task ${progress.replace(" ", "-")}`}>
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
