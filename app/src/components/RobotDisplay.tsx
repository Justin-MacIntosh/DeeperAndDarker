import { useContext } from 'react';

import Card from './Card';
import { GameStateContext, Robot } from '../game_state/GameState';
import { formatNumber } from '../helpers/formatNumber';

interface RobotDisplayProps {
  robot: Robot;
}

const RobotDisplay = (props: RobotDisplayProps) => {
  const robot = props.robot;
  const {state, dispatch} = useContext(GameStateContext);

  const animateClass = robot.animateAppearance ? "robot-fade-in" : "";
  return (
    <div className={`robot-container ${animateClass}`}>
      <div className="robot-stats-container">
        <h2 className="robot-name">{robot.name}: {robot.count}</h2>
        <h2 className="robot-production">{formatNumber(robot.count * robot.baseProduction)}<i className="fa-regular fa-gem fa-xs"/>/sec</h2>
      </div>
      <Card
        color={robot.color}
        iconName="fa-robot"
        contentElement={<>{robot.description}</>}
        suffixElement={<>{formatNumber(robot.currentCost)}<i className="fa-regular fa-gem fa-xs"/></>}
        onClick={() => {dispatch({type: "purchaseRobot", robotId: robot.id})}}
        isClickDisabled={robot.currentCost > state.currentMoney}
      />
    </div>
  );
}
export default RobotDisplay;
