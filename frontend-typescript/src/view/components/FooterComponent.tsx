import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import instagram from "../../assets/img/instagram.png";
import linkedin from "../../assets/img/linkedin.png";
import github from "../../assets/img/github.png";

function FooterComponent() {
  return (
    <Container fluid className="container-footer">
      <div className="com-footer">
        happy<span>activities.com</span>
      </div>
      <ul className="d-flex justify-content-center align-items-center ul-footer mb-0">
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li className="ms-2">
          <Link to={"/support-us"}>Support Us</Link>
        </li>
      </ul>
      <div className="d-flex justify-content-center align-items-center my-4">
        <img src={instagram} alt="" width={30} />
        <img src={linkedin} alt="" width={30} className="mx-3" />
        <img src={github} alt="" width={30} />
      </div>
      <div className="line-footer"></div>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <div>&copy; 2024 nicolemaini</div>
        <div>
          Terms of Use <span className="ms-2">Privacy Policy</span> <span className="ms-2">Cookie Policy</span>
        </div>
      </div>
    </Container>
  );
}

export default FooterComponent;
