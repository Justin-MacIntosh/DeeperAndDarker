import { clsx } from "clsx"

interface CardProps {
  iconName: String;
  contentElement: React.ReactNode;
  suffixElement: React.ReactNode;
  color: 'blue' | 'red' | 'green';
  onClick: () => void;
  isClickDisabled: boolean;
}

const Card = (props: CardProps) => {
  const colorClassMapping: Record<string, string> = {
    blue: 'bg-crd-blue',
    red: 'bg-crd-red',
    green: 'bg-crd-green',
  };
  const colorClass = colorClassMapping[props.color] || 'bg-crd-blue';

  const cardActiveClasses = clsx(
    "cursor-pointer hover:brightness-[108%] hover:-translate-y-1 ",
    "active:brightness-[105%] active:-translate-y-0.5"
  );
  const cardDisabledClasses = "brightness-75 cursor-not-allowed";

  return (
    <div
      className={clsx(
        "flex h-[75px] max-h-[75px] overflow-hidden",
        "rounded-2xl bg-light-purple",
        "transition-all select-none card",
        props.isClickDisabled ? cardDisabledClasses : cardActiveClasses,
      )}
      onClick={
        (e) => {
          e.preventDefault();
          props.onClick();
        }
      }
    >
      <div className={clsx(
        "min-w-[100px] h-[75px] p-[10px]",
        "[clip-path:polygon(0_0,90px_0,75px_100%,0_100%)]",
        colorClass
      )}>
        <span className={clsx("fa-solid fa-3x leading-[55px]", props.iconName)}/>
      </div>
      <div className="flex flex-1 items-center">
        {props.contentElement}
      </div>
      <div
        className={clsx(
          "min-w-[110px] text-sm text-center content-center",
          "[clip-path:polygon(15px_0,100%_0,100%_100%,0_100%)]",
          colorClass
        )}
      >
        {props.suffixElement}
      </div>
    </div>
  )
}
export default Card;
