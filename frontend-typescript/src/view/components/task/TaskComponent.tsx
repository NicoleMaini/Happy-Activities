import { Task } from "../../../interfaces/Task";
import arrow from "../../../assets/img/arrow-down.svg";
import check from "../../../assets/img/check.svg";
import MicroTaskComponent from "./MicrotaskComponent";
import { useEffect, useState } from "react";
import { changeStatus, disappeardAnimation } from "../../../includes/functions";

interface TaskProp {
  progressType: string;
  task: Task;
}

function TaskComponent({ progressType, task }: TaskProp) {
  const [openDescription, setOpenDescription] = useState(false);
  const [errors, setErrors] = useState<
    { [key: string]: any } | { general: string } | null
  >(null);

  const [showCard, setShowCard] = useState(true);
  const [isMounted, setIsMounted] = useState<string>("");

  useEffect(() => {
    disappeardAnimation({ showCard, setIsMounted });
  }, [showCard]);

  // cambiare progresso al task

  const updateStatusTaks = (id: number, action: string) => {
    const sendData = {
      id: id,
      action: action,
    };
    changeStatus("/api/v1/tasks/update-status", sendData, setErrors);
    setShowCard(false)
  };

  console.log('task', task);

  // ------------------------------------------------------

  const classProgress = progressType.replace(" ", "-");

  return (
    <div className={`task ${classProgress}  ${showCard ? "" : `disappeared ${isMounted}`}`}>
      <div className="d-flex align-items-center ">
        <h5>{task.title}</h5>
        {task.description && (
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
        {task.description && task.description}
      </p>
      {task.microtasks && task.microtasks.map((microTask)=> <MicroTaskComponent microTask={microTask} progressType={classProgress}/>)}
      {progressType === "completed" ? (
        <div className="finished">finished</div>
      ) : (
        <>
          {/* <div className={`line ${classProgress}`}></div> */}
          <div
            className={`btn-done ${classProgress}`}
            onClick={() =>
              progressType === "to do"
                ? updateStatusTaks(task.id, "in progress")
                : progressType === "in progress"
                ? updateStatusTaks(task.id, "in review")
                : progressType === "in review" &&
                  updateStatusTaks(task.id, "completed")
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
