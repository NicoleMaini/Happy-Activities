import { DataTask, Task } from "../../../interfaces/Task";
import arrow from "../../../assets/img/arrow-down.svg";
import check from "../../../assets/img/check.svg";
import MicroTaskComponent from "./MicrotaskComponent";
import { useEffect, useState } from "react";
import {
  changeStatus,
  disappeardAnimation,
  useGetFetch,
} from "../../../includes/functions";

interface TaskProp {
  task: Task;
  // onFilterChange: (newFilter: string) => void;
  onRefresh: (prId: number) => void;
}

function TaskComponent({ task, 
  onRefresh 
}: TaskProp) {
  // const { data, error }  = useGetFetch<DataTask>(`/api/v1/tasks/${task.id}`);

  const [newTask, setNewTask] = useState<Task>(task);
  const [openDescription, setOpenDescription] = useState(false);
  const [errors, setErrors] = useState<
    { [key: string]: any } | { general: string } | null
  >(null);

  const [showCard, setShowCard] = useState(true);
  const [isMounted, setIsMounted] = useState<string>("");

  // useEffect(()=>{
  //  if(data){
  //    setNewTask(data.data)
  //  }
  // }, [data, task.progress])

  useEffect(() => {
    disappeardAnimation({ showCard, setIsMounted });
  }, [showCard]);

  // fetch per richiamare il task specifico

  // cambiare progresso al task

  const updateStatusTaks = (id: number, action: string, prId: number) => {
    const sendData = {
      id: id,
      action: action,
    };
    changeStatus("/api/v1/tasks/update-status", sendData, setErrors);
    // onRefresh(prId);
    setShowCard(false);
  };

  // ------------------------------------------------------

  const classProgress = newTask.progress.replace(" ", "-");

  return (
    <div
      className={`task ${classProgress}  
    ${showCard ? "" : `disappeared ${isMounted}`}
      `}
    >
      <div className="d-flex align-items-center ">
        <h5>{newTask.title}</h5>
        {newTask.description && (
          <div
            className={`press ms-auto z-0 open-arrow ${
              openDescription ? "rotate" : ""
            } `}
            onClick={() => setOpenDescription(!openDescription)}
          >
            <img src={arrow} alt="" width={20} />
          </div>
        )}
      </div>
      <p className={`description ${openDescription && "open"}`}>
        {newTask.description && newTask.description}
      </p>
      <ul className="ps-0">
        {newTask.microtasks &&
          newTask.microtasks.map((microTask) => (
            <MicroTaskComponent
              key={microTask.id}
              microTask={microTask}
              progressType={classProgress}
            />
          ))}
      </ul>
      {newTask.progress === "completed" ? (
        <div className="finished">finished</div>
      ) : (
        <>
          <div
            className={`btn-done ${classProgress}`}
            onClick={() =>
              newTask.progress === "to do"
                ? updateStatusTaks(task.id, "in progress", task.project_id)
                : newTask.progress === "in progress"
                ? updateStatusTaks(task.id, "in review", task.project_id)
                : newTask.progress === "in review" &&
                  updateStatusTaks(task.id, "completed", task.project_id)
            }
          >
            <img src={check} alt="" width={12} />
          </div>
        </>
      )}
    </div>
  );
}
export default TaskComponent;
