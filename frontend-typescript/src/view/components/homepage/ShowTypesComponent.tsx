import { Container, Row } from "react-bootstrap";
import CardTypeComponent from "./CardTypeComponent";
import { Link, useNavigate } from "react-router-dom";
import { valuesTypesArray } from "../../../includes/valuesTipesArray";
import { useState } from "react";
import { useAppSelector } from "../../../redux/store";
import FormCreateProject from "../create-project/FormCreateProject";

function ShowTypesComponent() {
  const navigate = useNavigate();
  const handleCardClick = (type: string) => {
    navigate("/dashboard/create-project", { state: { type: type } });
  };

  return (
    <Container fluid="md" className="margin-container">
      <h2 className="text-title-types-homepage">
        you can choise between
        <span className="span-types">
          4 types of categories:<span></span>
        </span>
      </h2>
      <Row className="center-create-project">
        {valuesTypesArray.map((value, i) => (
          <CardTypeComponent
            key={i}
            type={value.type}
            image={value.image}
            style={value.style}
            description={value.description}
            onClick={() => handleCardClick(value.type)}
          />
        ))}
      </Row>
      <h3 className="text-center mt-5">if our app has convinced you and you want to try using it </h3>
      <div className="d-flex justify-content-center mt-4 position-relative">
        <div className="subscribe-line"></div>
        <Link className="subscribe" to="/signin">
          SUBSCRIBE here!
        </Link>
      </div>
      <h3 className="text-center my-5">let the fun BEGIN!</h3>
    </Container>
  );
}
export default ShowTypesComponent;
