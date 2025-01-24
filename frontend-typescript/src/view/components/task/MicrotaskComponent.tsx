import { ChangeEvent, KeyboardEvent, useState } from "react";
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
  const [description, setDescription] = useState<string | null>(
    microTask.description
  );

  const [errors, setErrors] = useState<
    { [key: string]: any } | { general: string } | null
  >(null);

  const completeMicroTask = (id: number, action: string) => {
    const sendData = {
      id: id,
      action: action,
    };
    changeStatus(
      "http://localhost:3000/api/v1/microtasks/update-status",
      sendData,
      setErrors
    );
    setCheck(!check);
  };

  const deleteMicroTask = (id: number) => {
    deleteCard(`http://localhost:3000/api/v1/microtasks/${id}`, setErrors);
  };

  const handleChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(ev.target.value);
  };

  // Funzione per gestire l'evento di submit
  const editMicroTask = (
    ev: KeyboardEvent<HTMLTextAreaElement>,
    id: number,
    description: string
  ) => {
    const sendData = {
      id: id,
      description: description,
    };

    if (ev.key === "Enter") {
      if (ev.shiftKey) {
        return;
      }
      ev.preventDefault();
      changeStatus("http://localhost:3000/api/v1/microtasks/update-status", sendData, setErrors);
      setDescription(description)
      setShowInput(false);
    } else if (ev.key === "Escape") {
      setDescription(microTask.description); // Ripristina la descrizione originale
      setShowInput(false); // Chiudi l'editing
    }
  };
  return (
    <li className={`micro-task-component ${progressType}`}>
      {!showInput ? (
        <>
          <div
            className={`check ${
              isCheck || check || microTask.progress === "completed"
                ? "isCheck"
                : ""
            }`}
          ></div>
          <h5
            className={`description-micro ${showAllText && "show-all-text"}`}
            onClick={() => setShowAllText(!showAllText)}
            onDoubleClick={() => setShowInput(!showInput)}
          >
            {description}
          </h5>
        </>
      ) : (
        <textarea
          name="description"
          className="w-100"
          onChange={(ev) => handleChange(ev)}
          // controlliamo il problema null
          value={description ? description : ""}
          onKeyDown={(ev)=>editMicroTask(ev, microTask.id, description ? description : "")}
          onBlur={() => setShowInput(false)}
        ></textarea>
      )}

      <div
        className={`press ${
          isCheck || microTask.progress === "completed"
            ? "opacity-100"
            : "opacity-25"
        } ${check && "opacity-100"}`}
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
    </li>
  );
}

export default MicroTaskComponent;
