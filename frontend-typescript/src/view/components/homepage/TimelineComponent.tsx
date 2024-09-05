import { Container } from "react-bootstrap";
import check from "../../../assets/img/check.svg";
import { Link } from "react-router-dom";

function TimelineComponent() {
  return (
    <>
      <Container fluid className="timeline-component">
        <h2>
          <span className="span-forget"> forget about pens, sheets and calendars.</span>
          <br />
          let yourself be carried away by the <span className="span-flow"> FLOW</span>
        </h2>

        <div className="timeline">
          <div className="event">
            <div className="ball"></div>
            <Link to="/login" className="text left">
              Login
            </Link>
          </div>
          <div className="event">
            <div className="ball"></div>
            <Link to="/dashboard/create-project" className="text right">
              Create your project
            </Link>
          </div>
          <div className="event">
            <div className="ball"></div>
            <div className="text left">Check your tasks</div>
          </div>
          <div className="event">
            <div className="ball"></div>
            <div className="text right">Complete your goals!</div>
          </div>
        </div>
      </Container>
    </>
  );
}
export default TimelineComponent;
