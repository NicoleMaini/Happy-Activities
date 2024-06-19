import { Container } from "react-bootstrap";
import check from "../../../assets/img/check.svg";

function TimelineComponent() {
  return (
    <>
      <Container fluid className="my-3 timeline-container-homepage">
        <h2>
          <span className="span-forget"> forget about pens, sheets and calendars.</span>
          <br />
          let yourself be carried away by the <span className="span-flow"> FLOW</span>
        </h2>

        <div className="timeline">
          <div className="event-timeline">
            <div className="ball"></div>
            <div className="text up">Sign In or Login</div>
          </div>
          <div className="event-timeline">
            <div className="ball"></div>
            <div className="text down">Create your project</div>
          </div>
          <div className="event-timeline">
            <div className="ball"></div>
            <div className="text up">Check your task</div>
          </div>
          <div className="event-timeline">
            <div className="ball"></div>
            <div className="text down">Complete your goals!</div>
          </div>
          <div className="event-timeline-alone">
            <div className="ball goal">
              <img src={check} alt="" />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
export default TimelineComponent;
