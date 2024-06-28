import { MicroTaskProps } from "../../../interfaces/MicroTask";

function MicroTaskComponent({ microTask }: MicroTaskProps) {
  return <div className="d-flex flex-column ">{microTask.title}</div>;
}

export default MicroTaskComponent;
