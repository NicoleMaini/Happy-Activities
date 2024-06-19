import { Container, Row } from "react-bootstrap";
import CardTypeComponent from "../components/homepage/CardTypeComponent";
import { valuesTypesArray } from "../../includes/valuesTipesArray";
import { useState } from "react";
import FormCreateProject from "../components/create-project/FormCreateProject";
import { useLocation } from "react-router-dom";

function CreateProjectPage() {
  const location = useLocation();
  const typeHome = location.state || null;

  // console.log("typehome", typeHome.type);
  const [type, setType] = useState<string | null>(null);

  const handleClick = (type: string) => {
    setType(type);
  };

  return (
    <Container className="container-create-project">
      {!typeHome &&
        (!type ? (
          <Row className="center-create-project">
            {valuesTypesArray.map((value, i) => (
              <CardTypeComponent
                key={i}
                type={value.type}
                image={value.image}
                style={value.style}
                description={value.description}
                onClick={() => {
                  handleClick(value.type);
                }}
              />
            ))}
          </Row>
        ) : (
          <FormCreateProject type={type} />
        ))}
      {typeHome && !type && <FormCreateProject type={typeHome.type} />}
    </Container>
  );
}

export default CreateProjectPage;
