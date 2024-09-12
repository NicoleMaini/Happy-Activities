import { ProjectCardType } from "../../../interfaces/Project";


interface CardTypeClick extends ProjectCardType {
  onClick: () => void;
}

function CardTypeProjectComponent({ type, image, description, onClick }: CardTypeClick) {
  return (
    <div className="choose-type-project" >
      <div className={`card-container ${type}`} onClick={onClick}>
        <div className={`img-container ${type}`}>
          <img src={image} alt={type}/>
        </div>
        <h3>{type === 'together' ? 'work in team' : 'work alone'}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
export default CardTypeProjectComponent;
