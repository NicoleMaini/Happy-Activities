import { useEffect, useState } from "react";
import TimelineComponent from "../components/homepage/TimelineComponent";
import HeaderComponent from "../components/homepage/HeaderComponent";
import { Col, Container, Row } from "react-bootstrap";
import LoginPage from "./LoginPage";
import SignInPage from "./SignInPage";
import { useAppSelector } from "../../redux/store";
import { Link } from "react-router-dom";

function HomePage() {
  const user = useAppSelector((state) => state.user.user);
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

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
            {user ? (
              <div className="text-center">
                <h4>
                  Welcome back <span className="orange">{user.name}</span>.
                </h4>
                <h4>Shall we get back to work?</h4>
                <Link to={"/dashboard"} className="btn-go-project">GO TO YOUR PROJECT</Link>
              </div>
            ) : (
              <h4 className="text-center">
                Now <span className="subscribe">SUBSCRIBE</span> and let the fun
                begin!
              </h4>
            )}
          </div>
        </Col>
        <Col md={{ span: 8, order: "first" }} className="left-side">
          {user ? (
            <></>
          ) : (
            <>
              <LoginPage open={open} click={handleClick} />
              <SignInPage open={open} click={handleClick} />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
