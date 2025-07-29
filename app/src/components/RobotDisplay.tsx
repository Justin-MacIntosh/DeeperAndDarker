import { useContext } from 'react';

import Card from './Card';
import { GameStateContext, Robot } from '../game_state/GameState';

interface RobotDisplayProps {
  robot: Robot;
}

const RobotDisplay = (props: RobotDisplayProps) => {
  const robot = props.robot;
  const {state, dispatch} = useContext(GameStateContext);
  return (
    <div className="robot-container">
      <div className="robot-stats-container">
        <h2 className="robot-name">{robot.name}: {robot.count}</h2>
        <h2 className="robot-production">{robot.count * robot.baseProduction}/sec</h2>
      </div>
      <Card
        color={robot.color}
        iconName="fa-robot"
        contentElement={<>{robot.description}</>}
        suffixElement={<>{robot.currentCost}<i className="fa-solid fa-dollar-sign fa-xs"/></>}
        onClick={() => {dispatch({type: "purchaseRobot", robotId: robot.id})}}
        isClickDisabled={robot.currentCost > state.currentMoney}
      />
    </div>
  );
}
export default RobotDisplay;
