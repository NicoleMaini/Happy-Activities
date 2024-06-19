import { Col } from "react-bootstrap";
import { CardType } from "../../../interfaces/HomeCard";

interface CardTypeClick extends CardType {
  onClick: () => void;
}

function CardTypeComponent({ type, image, style, description, onClick }: CardTypeClick) {
  return (
    <Col md={2} lg={3} className={style} onClick={onClick}>
      <div className="bg-card">
        <div className="shadow-card"></div>
        <div className="img-card-types">
          <img src={image} alt={type} width={50} />
        </div>
        <h3>{type}</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti error, consectetur voluptates, voluptate
          itaque pariatur
        </p>
      </div>
    </Col>
  );
}
export default CardTypeComponent;
