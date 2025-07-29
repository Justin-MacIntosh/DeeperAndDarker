import './Card.css';

interface CardProps {
  iconName: String;
  contentElement: React.ReactNode;
  suffixElement: React.ReactNode;
  color: 'blue' | 'red' | 'green';
  onClick: () => void;
  isClickDisabled: boolean;
}

const Card = (props: CardProps) => {
  const colorClass = `card-${props.color}`;
  const dsiabledClass = props.isClickDisabled ? "card-disabled" : "";
  return (
    <div className={`card noselect ${colorClass} ${dsiabledClass}`} onClick={(e) => {e.preventDefault(); props.onClick();}}>
      <div className="card-icon">
        <span className={`fa-solid fa-3x ${props.iconName}`}></span>
      </div>
      <div className="card-content">
        {props.contentElement}
      </div>
      <div className="card-suffix">
        {props.suffixElement}
      </div>
    </div>
  )
}
export default Card;
