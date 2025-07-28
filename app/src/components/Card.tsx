import './Card.css';

interface CardProperties {
  iconName: String,
  contentElement: React.ReactNode
  suffixElement: React.ReactNode,
  color: 'blue' | 'red' | 'green';
}

const Card = (props: CardProperties) => {
  const colorClass = `card-${props.color}`;
  return (
    <div className={`card noselect ${colorClass}`}>
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
