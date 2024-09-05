import { useEffect, useState } from "react";
import TimelineComponent from "../components/homepage/TimelineComponent";
import HeaderComponent from "../components/homepage/HeaderComponent";
import { Col, Container, Row } from "react-bootstrap";
import LoginPage from "./LoginPage";
import SignInPage from "./SignInPage";

function HomePage() {

  const [open, setOpen] = useState(true);

const handleClick = ()=>{setOpen(!open)};

  useEffect(() => {
    document.title = "Happy Activities";
  }, []);

  return (
    <Container fluid className="homepage">
      <Row>
        <Col md={4} className="right-side">
          <HeaderComponent />
          <TimelineComponent />
          {/* <ShowTypesComponent /> */}
          <div className="let-fun-begin">
            <h4 className="text-center">
              Now <span>SUBSCRIBE</span> and let the fun begin!
            </h4>
          </div>
        </Col>
        <Col md={{ span: 8, order: "first" }} className="left-side">
        <LoginPage open={open} click={handleClick}/>
        <SignInPage open={open} click={handleClick}/>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
