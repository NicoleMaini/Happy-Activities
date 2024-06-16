import { Container } from "react-bootstrap";
import logo from "../../assets/img/logo.png";
import MicroCardTypeComponent from "../components/homepage/MicroCardTypeComponent";
import { MacroCardType } from "../../interfaces/HomeCard";
import work from "../../assets/img/work.svg";
import study from "../../assets/img/study.svg";
import event from "../../assets/img/event.svg";
import freetime from "../../assets/img/freetime.svg";

function HomePage() {
  const valuesTypesArray: MacroCardType[] = [
    { type: "work", image: work, bg: "bg-card-work-homepage", description: "" },
    { type: "study", image: study, bg: "bg-card-study-homepage", description: "" },
    { type: "event", image: event, bg: "bg-card-event-homepage", description: "" },
    { type: "free-time", image: freetime, bg: "bg-card-free-time-homepage", description: "" },
  ];

  return (
    <Container fluid>
      <div className="container-homepage">
        <div className="welcome-homepage">welcome to</div>
        <img src={logo} alt="logo" className="logo-homepage" />
        <div className="microcard-work">
          <MicroCardTypeComponent
            type={valuesTypesArray[0].type}
            image={valuesTypesArray[0].image}
            bg={valuesTypesArray[0].bg}
          />
        </div>
        <div className="microcard-study">
          <MicroCardTypeComponent
            type={valuesTypesArray[1].type}
            image={valuesTypesArray[1].image}
            bg={valuesTypesArray[1].bg}
          />
        </div>
        <div className="microcard-event">
          <MicroCardTypeComponent
            type={valuesTypesArray[2].type}
            image={valuesTypesArray[2].image}
            bg={valuesTypesArray[2].bg}
          />
        </div>
        <div className="microcard-free-time">
          <MicroCardTypeComponent
            type={valuesTypesArray[3].type}
            image={valuesTypesArray[3].image}
            bg={valuesTypesArray[3].bg}
          />
        </div>
      </div>
    </Container>
  );
}

export default HomePage;
