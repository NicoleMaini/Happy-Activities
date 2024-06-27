import { Col } from "react-bootstrap";
import { TaskProp } from "../../../interfaces/Task";

function TaskComponent({ task }: TaskProp) {
  return (
    <Col md={6} lg={4} xl={2}>
      <h6>{task.title}</h6>
      <p>{task.description}</p>
    </Col>
  );
}
export default TaskComponent;
