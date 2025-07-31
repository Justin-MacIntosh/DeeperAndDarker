import Card from './Card';
import { formatNumber } from '../helpers/formatNumber';
import { Robot, useGameStore } from '../game_state/GameStore';


const RobotsList = () => {
  const { robots } = useGameStore();
  return (
    <div className="flex flex-col">
      {robots.map(
        (robot) => (
          robot.isBeingShown &&
          <SingleRobotDisplay key={robot.id} robot={robot} />
        )
      )}
    </div>
  );
};

const SingleRobotDisplay = (props: { robot: Robot; }) => {
  const robot = props.robot;
  const { currentMoney } = useGameStore();
  const purchaseRobotAction = useGameStore((state) => state.purchaseRobot)

  const animateClass = robot.animateAppearance ? "fade-in" : "";
  return (
    <div className={`mb-5 ${animateClass}`}>
      <div className="text-lg flex flex-row mb-2">
        <h2 className="flex-1">{robot.name}: {robot.count}</h2>
        <h2 className="flex-1 text-right">{formatNumber(robot.count * robot.baseProduction)}<i className="fa-regular fa-gem fa-xs"/>/sec</h2>
      </div>
      <Card
        color={robot.color}
        iconName="fa-robot"
        contentElement={<>{robot.description}</>}
        suffixElement={<>{formatNumber(robot.currentCost)}<i className="fa-regular fa-gem fa-xs"/></>}
        onClick={() => {purchaseRobotAction(robot.id)}}
        isClickDisabled={robot.currentCost > currentMoney}
      />
    </div>
  );
}
export default RobotsList;
