import { useState } from "react";
import checkSvg from "../../../assets/img/check.svg";
import trash from "../../../assets/img/trash-minimal.svg";
import { MicroTask } from "../../../interfaces/MicroTask";
import { changeStatus, deleteCard } from "../../../includes/functions";

interface MicroTaskComponentProps {
  microTask: MicroTask;
  progressType: string;
}

function MicroTaskComponent({
  microTask,
  progressType,
}: MicroTaskComponentProps) {
  const [check, setCheck] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [showAllText, setShowAllText] = useState(false);
  const [showInput, setShowInput] = useState(false);


  const [errors, setErrors] = useState<
    { [key: string]: any } | { general: string } | null
  >(null);

  const completeMicroTask = (id: number, action: string) => {
    const sendData = {
      id: id,
      action: action,
    };
    changeStatus("http://localhost:3000/api/v1/microtasks/update-status", sendData, setErrors);
    setCheck(!check);
  };

  const deleteMicroTask = (id: number) => {
    deleteCard(`http://localhost:3000/api/v1/microtasks/${id}`, setErrors)
  };

  return (
    <div className={`micro-task-component ${progressType}`}>
      <div
        className={`check ${isCheck && "isCheck"} ${check && "isCheck"}`}
      ></div>
      <h5
        className={`description-micro ${showAllText && "show-all-text"}`}
        onClick={() => setShowAllText(!showAllText)}
      >
        {microTask.description}
      </h5>
      <div
        className={`press ${isCheck ? "opacity-100" : "opacity-25"} ${
          check && "opacity-100"
        }`}
        onClick={() => {
          showAllText
            ? deleteMicroTask(microTask.id)
            : completeMicroTask(microTask.id, check ? "to do" : "completed");
        }}
        onMouseMove={() => setIsCheck(true)}
        onMouseLeave={() => setIsCheck(false)}
      >
        {showAllText ? (
          <img src={trash} alt="" width={15} />
        ) : (
          <img src={checkSvg} alt="" width={15} />
        )}
      </div>
    </div>
  );
}

export default MicroTaskComponent;
