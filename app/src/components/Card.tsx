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
  const colorClass = `bg-card-${props.color}`;
  const disabledClass = props.isClickDisabled ? "card-disabled" : "";
  return (
    <div
      className={
        `flex h-[75px] max-h-[75px] overflow-hidden 
        rounded-2xl bg-light-purple
        transition-all noselect
        card ${disabledClass}`
      }
      onClick={
        (e) => {
          e.preventDefault();
          props.onClick();
        }
      }
    >
      <div className={`p-[10px] min-w-[100px] h-[75px] card-icon ${colorClass}`}>
        <span className={`fa-solid fa-3x leading-[55px] ${props.iconName}`}/>
      </div>
      <div className="flex flex-1 items-center">
        {props.contentElement}
      </div>
      <div
        className={
          `min-w-[110px] text-sm
          text-center content-center
          card-suffix ${colorClass}`
        }
      >
        {props.suffixElement}
      </div>
    </div>
  )
}
export default Card;
