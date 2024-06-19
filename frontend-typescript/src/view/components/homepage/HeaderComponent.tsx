import { Col, Container, Row } from "react-bootstrap";
import logo from "../../../assets/img/logo.png";

function HeaderComponent() {
  return (
    <Container fluid="md" className="padding-container">
      <Row className="my-5 d-flex align-items-center">
        <Col className="">
          <p className="welcome-homepage">welcome to</p>
          <h1 className="mt-4">
            <span className="happy-homepage">
              Happy <span className="circle-homepage happy-circle"></span>
            </span>
            <span className="activities-homepage">
              ACTIVITIES <span className="circle-homepage activities-circle"></span>
            </span>
          </h1>
          <p className="task-management-homepage">
            your trusted tasks <span className="d-block">management application</span>
          </p>
          <div className="line-homepage"></div>
        </Col>
        <Col className="position-relative">
          <div className="shadow-logo-homepage"></div>
          <div className="text-center container-logo-homepage">
            <img src={logo} alt="logo" />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
export default HeaderComponent;
