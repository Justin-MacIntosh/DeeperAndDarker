import { memo, useState } from 'react';
import { clsx } from 'clsx';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'

import GemIcon from '../icons/GemIcon';
import Card from './Card';

import { Robot } from '../game_state/GameStateTypes';
import { useGameStore } from '../game_state/GameStore';
import { formatNumber } from '../helpers/formatNumber';
import {
  calculatePriceForMultiplePurchases,
  calculateMaxPossiblePurchase
} from '../game_state/robotStateHelpers';

type PurchaseAmount = 1 | 5 | 10 | 'Max';

const RobotsList = () => {
  // console.log("RobotsList render");
  const [numToPurchase, setNumToPurchase] = useState<PurchaseAmount>(1);

  const robots = useGameStore((state) => state.robots);
  return (
    <>
      <div className="flex flex-row justify-between items-center mb-3">
        <h1 className="uppercase text-2xl font-bold">Automatons</h1>
        <div className="text-right">
          <Listbox value={numToPurchase} onChange={setNumToPurchase}>
            <ListboxButton
              className="
                btn-default w-20 rounded-lg text-xl text-center
                border-solid border-gray-300 border-2"
            >
                { numToPurchase === "Max" ? numToPurchase : `x${numToPurchase}` }
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              className="
                w-24 p-2 bg-med-purple
                border-solid border-gray-400 border-2 rounded-xl"
            >
              <ListboxOption className="list-box-option mb-2" key={"1"} value={1}>x1</ListboxOption>
              <ListboxOption className="list-box-option mb-2" key={"5"} value={5}>x5</ListboxOption>
              <ListboxOption className="list-box-option mb-2" key={"10"} value={10}>x10</ListboxOption>
              <ListboxOption className="list-box-option" key={"Max"} value={"Max"}>Max</ListboxOption>
            </ListboxOptions>
          </Listbox>
        </div>
      </div>
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
                numToPurchase={numToPurchase}
              />
            )
          }
        )}
      </div>
    </>
  );
};

const SingleRobotDisplay = memo(
  (props: { robot: Robot; numToPurchase: PurchaseAmount; }) => {
    // console.log("SingleRobotDisplay render");
    const currentResources = useGameStore((state) => state.currentResources);
    const planet = useGameStore((state) => state.planet);
    const purchaseRobotAction = useGameStore((state) => state.purchaseRobot)

    let currentCost = 0;
    let numToPurchase = 0;
    const robot = props.robot;
    if (props.numToPurchase === 'Max') {
      const { cost, maxPossiblePurchase } = calculateMaxPossiblePurchase(
        robot, currentResources, planet.structureSlots
      );
      currentCost = cost;
      numToPurchase = maxPossiblePurchase;
    } else {
      currentCost = calculatePriceForMultiplePurchases(robot, props.numToPurchase, planet.structureSlots);
      numToPurchase = props.numToPurchase;
    }

    const animateClass = robot.animateAppearance ? "fade-in" : "";
    return (
      <div className={clsx("mb-5", animateClass)}>
        <div className="text-lg flex flex-row mb-2">
          <h2 className="uppercase flex-1">{robot.name}: {robot.count}</h2>
          <h2 className="flex-1 text-right">{formatNumber(robot.resourcesPerSecond)}<GemIcon/>/sec</h2>
        </div>
        <Card
          color={robot.color}
          iconName="fa-robot"
          contentElement={<>{robot.description}</>}
          suffixElement={<>{formatNumber(currentCost)}<GemIcon/></>}
          onClick={() => {purchaseRobotAction(robot.id, numToPurchase)}}
          isClickDisabled={currentCost > currentResources}
        />
      </div>
    );
  }
);
export default RobotsList;
