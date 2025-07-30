import { useContext } from 'react';

import Card from './Card';
import { GameStateContext, Robot } from '../game_state/GameState';
import { formatNumber } from '../helpers/formatNumber';

const RobotDisplay = (props: { robot: Robot; }) => {
  const robot = props.robot;
  const {state, dispatch} = useContext(GameStateContext);

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
        onClick={() => {dispatch({type: "purchaseRobot", robotId: robot.id})}}
        isClickDisabled={robot.currentCost > state.currentMoney}
      />
    </div>
  );
}
export default RobotDisplay;
