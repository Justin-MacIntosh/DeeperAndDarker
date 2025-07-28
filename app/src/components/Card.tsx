import './Card.css';

interface CardProperties {
  iconName: String,
  content: React.ReactNode
  suffix: React.ReactNode,
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
        {props.content}
      </div>
      <div className="card-suffix">
        {props.suffix}
      </div>
    </div>
  )
}

export default Card;
