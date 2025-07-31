import Card from './Card';

import { memo } from 'react';
import { Robot, useGameStore } from '../game_state/GameStore';
import { formatNumber } from '../helpers/formatNumber';
import GemIcon from '../icons/GemIcon';

const RobotsList = () => {
  // console.log("RobotsList render");

  const robots = useGameStore((state) => state.robots);
  return (
    <>
      <h1 className="uppercase text-2xl font-bold">Automatons</h1>
      <div className="flex flex-col">
        {robots.map(
          (robot) => {
            if (!robot.isBeingShown) {
              return null;
            }
            return (
              <SingleRobotDisplay
                key={robot.id.toString()}
                robot={robot}
              />
            )
          }
        )}
      </div>
    </>
  );
};

const SingleRobotDisplay = memo((props: { robot: Robot; }) => {
  // console.log("SingleRobotDisplay render");

  const robot = props.robot;
  const currentResources = useGameStore((state) => state.currentResources);
  const purchaseRobotAction = useGameStore((state) => state.purchaseRobot)

  const animateClass = robot.animateAppearance ? "fade-in" : "";
  return (
    <div className={`mb-5 ${animateClass}`}>
      <div className="text-lg flex flex-row mb-2">
        <h2 className="uppercase flex-1">{robot.name}: {robot.count}</h2>
        <h2 className="flex-1 text-right">{formatNumber(robot.resourcesPerSecond)}<GemIcon/>/sec</h2>
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
});
export default RobotsList;
