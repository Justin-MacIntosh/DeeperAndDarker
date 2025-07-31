import Card from './Card';
import { Robot, useGameStore } from '../game_state/GameStore';
import { formatNumber } from '../helpers/formatNumber';
import GemIcon from '../icons/GemIcon';

const RobotsList = () => {
  const { robots } = useGameStore();
  return (
    <>
      <h1 className="uppercase text-2xl font-bold">Automatons</h1>
      <div className="flex flex-col">
        {robots.map(
          (robot) => (
            robot.isBeingShown &&
            <SingleRobotDisplay key={robot.id} robot={robot} />
          )
        )}
      </div>
    </>
  );
};

const SingleRobotDisplay = (props: { robot: Robot; }) => {
  const robot = props.robot;
  const { currentResources } = useGameStore();
  const purchaseRobotAction = useGameStore((state) => state.purchaseRobot)

  const animateClass = robot.animateAppearance ? "fade-in" : "";
  return (
    <div className={`mb-5 ${animateClass}`}>
      <div className="text-lg flex flex-row mb-2">
        <h2 className="uppercase flex-1">{robot.name}: {robot.count}</h2>
        <h2 className="flex-1 text-right">{formatNumber(robot.count * robot.baseProduction)}<GemIcon/>/sec</h2>
      </div>
      <Card
        color={robot.color}
        iconName="fa-robot"
        contentElement={<>{robot.description}</>}
        suffixElement={<>{formatNumber(robot.currentCost)}<GemIcon/></>}
        onClick={() => {purchaseRobotAction(robot.id)}}
        isClickDisabled={robot.currentCost > currentResources}
      />
    </div>
  );
}
export default RobotsList;
