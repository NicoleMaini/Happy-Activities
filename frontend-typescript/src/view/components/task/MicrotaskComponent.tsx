import { useState } from "react";
import checkSvg from "../../../assets/img/check.svg";
import { MicroTask } from "../../../interfaces/MicroTask";
import { changeStatus } from "../../../includes/functions";

interface MicroTaskComponentProps {
  microTask: MicroTask;
  progressType: string;
}

function MicroTaskComponent({
  microTask,
  progressType,
}: MicroTaskComponentProps) {
  const [check, setCheck] = useState(false);
  const [errors, setErrors] = useState<
    { [key: string]: any } | { general: string } | null
  >(null);

  const completeMicroTask = (id: number, action: string) => {
    const sendData = {
      id: id,
      action: action,
    };
    changeStatus("/api/v1/microtasks/update-status", sendData, setErrors);
    setCheck(!check);
  };

  

  return (
    <div
      className={`micro-task-component ${progressType} d-flex justify-content-between align-items-center`}
    >
      {check && <div className="check"></div>}
      <h5>{microTask.title}</h5>
      <div
        className="check-opacity press"
        onClick={() => {
          completeMicroTask(microTask.id, check ? "to do" : "completed");
        }}
      >
        {" "}
        <img src={checkSvg} alt="" width={15} />
      </div>
    </div>
  );
}

export default MicroTaskComponent;
