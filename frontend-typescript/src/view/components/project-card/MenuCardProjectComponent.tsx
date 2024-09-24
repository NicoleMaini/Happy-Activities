import { useState } from "react";
import ModalComponent from "../ModalComponent";
import ModalEditProjectComponent from "../ModalEditProjectComponent";
import { Project } from "../../../interfaces/Project";
import edit from "../../../assets/img/edit-minimal.svg";
import trash from "../../../assets/img/trash-minimal.svg";
import { changeStatus } from "../../../includes/functions";
import { SendData } from "../../../interfaces/User";

interface MenuCardProjectComponentProps {
  type: string;
  project: Project;
  open: boolean; // Aggiungi questa riga
  leave: () => void;
}

function MenuCardProjectComponent({
  type,
  project,
  open,
  leave,
}: MenuCardProjectComponentProps) {
  const [errors, setErrors] = useState<
    { [key: string]: any } | { general: string } | null
  >(null);

  const [showDelete, setShowDelete] = useState(false);
  const [showMoveOnTrash, setShowMoveOnTrash] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showRestore, setShowRestore] = useState(false);

  const handleClick = (set: (value: boolean) => void) => {
    set(true);
    leave();
  };

  const moveOnTrashClick = (id: number) => {
    const sendData: SendData = {
      id: id,
      action: "delete",
    };
    changeStatus("/api/v1/projects/update-status", sendData, setErrors);
    setShowDelete(false);
  };

  const restoreClick = (id: number) => {
    const sendData: SendData = {
      id: id,
      action: "active",
    };
    changeStatus("/api/v1/projects/update-status", sendData, setErrors);
    setShowRestore(false);
  };

  const deleteClick = (id: number) => {
    const sendData: SendData = {
      id: id,
      action: "active",
    };
    // changeStatus("/api/v1/projects/update-status", sendData, setErrors);
    // setShowRestore(false);
  };


  return (
    <div
      className={`menu-card-component ${open ? "visible" : "hidden"}`}
      onMouseLeave={leave}
    >
      {type === "edit" && (
        <>
          <div
            className="mb-2 press selected d-flex justify-content-between w-100"
            onClick={() => {
              handleClick(setShowEdit);
            }}
          >
            <p>Edit</p>
            <img src={edit} alt="" width={14} />
          </div>
          <div
            className="press selected d-flex justify-content-between"
            onClick={() => {
              handleClick(setShowMoveOnTrash);
            }}
          >
            <p>Move on trash</p>
            <img src={trash} alt="" width={14} />
          </div>
        </>
      )}

      {type === "delete" && (
        <>
          <div
            className="mb-2 press selected d-flex justify-content-between w-100"
            onClick={() => {
              handleClick(setShowRestore);
            }}
          >
            <p>Restore</p>
            <img src={edit} alt="" width={14} />
          </div>
          <div
            className="press selected d-flex justify-content-between"
            onClick={() => {
              handleClick(setShowDelete);
            }}
          >
            <p>Delete</p>
            <img src={trash} alt="" width={14} />
          </div>
        </>
      )}

      {showMoveOnTrash && (
        <ModalComponent
          question={`Do you want move on trash ${project.name} project?`}
          action={() => moveOnTrashClick(project.id)}
          click={() => setShowMoveOnTrash(false)}
        />
      )}
      {showEdit && (
        <ModalEditProjectComponent
          title={`Edit ${project.name}`}
          project={project}
          click={() => setShowEdit(false)}
        />
      )}

      {showRestore && (
        <ModalComponent
          question={`Do you want restore ${project.name} project?`}
          action={() => restoreClick(project.id)}
          click={() => setShowRestore(false)}
        />
      )}
      {showDelete && (
        <ModalComponent
          question={`Do you want delete ${project.name} project?`}
          action={() => deleteClick(project.id)}
          click={() => setShowRestore(false)}
        />
      )}
    </div>
  );
}

export default MenuCardProjectComponent;
