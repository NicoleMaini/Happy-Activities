import { MicroCardType } from "../../../interfaces/HomeCard";

function MicroCardTypeComponent({ type, image, bg }: MicroCardType) {
  return (
    <div className={bg}>
      <div className="img-micro-card-homepage">
        <img src={image} alt={type} />
      </div>
      <p>{type}</p>
    </div>
  );
}
export default MicroCardTypeComponent;
