import { memo, useState } from 'react';
import { clsx } from 'clsx';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'

import GemIcon from '../icons/GemIcon';
import Card from './Card';

import { Robot } from '../types';
import { useGameStore } from '../game_state/GameStore';
import { formatNumber } from '../helpers/formatNumber';
import {
  calculatePriceForMultiplePurchases,
  calculateMaxPossiblePurchase
} from '../helpers/robotStateHelpers';

type PurchaseAmount = 1 | 5 | 10 | 'Max';

const RobotsList = () => {
  // console.log("RobotsList render");
  const [numToPurchaseOption, setNumToPurchaseOption] = useState<PurchaseAmount>(1);

  const robots = useGameStore((state) => state.robots);
  return (
    <>
      <div className="flex flex-row justify-between items-center mb-3">
        <h1 className="uppercase text-2xl font-bold">Automatons</h1>
        <div className="text-right">
          <Listbox value={numToPurchaseOption} onChange={setNumToPurchaseOption}>
            <ListboxButton
              className="
                btn-default w-20 rounded-lg text-xl text-center
                border-solid border-gray-300 border-2"
            >
                {
                  numToPurchaseOption === "Max" ?
                  numToPurchaseOption :
                  `x${numToPurchaseOption}`
                }
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
                numToPurchaseOption={numToPurchaseOption}
              />
            )
          }
        )}
      </div>
    </>
  );
};

const SingleRobotDisplay = memo(
  (props: { robot: Robot; numToPurchaseOption: PurchaseAmount; }) => {
    console.log("SingleRobotDisplay render");
    const robot = props.robot;

    // Actions and state from the game store
    const purchaseRobotAction = useGameStore((state) => state.purchaseRobot)
    const currentResources: number = useGameStore((state) => state.currentResources);
    const planet = useGameStore((state) => state.planet);

    // Calculate the cost and number of robots to purchase
    let currentCost: number = 0;
    let numToPurchase: number = 0;
    if (props.numToPurchaseOption === 'Max') {
      ({ cost: currentCost, maxPossiblePurchase: numToPurchase } = (
        calculateMaxPossiblePurchase(props.robot, currentResources, planet.structureSlots)
      ));
    } else {
      currentCost = (
        calculatePriceForMultiplePurchases(
          props.robot, props.numToPurchaseOption, planet.structureSlots
        )
      );
      numToPurchase = props.numToPurchaseOption;
    }

    let amountToPurchaseDisplay = numToPurchase.toString();
    if (props.numToPurchaseOption === 'Max' && currentCost > currentResources) {
      amountToPurchaseDisplay = "0";
    }
    return (
      <div className={clsx(
        "mb-5", robot.animateAppearance && "fade-in"
      )}>
        <div className="text-lg flex flex-row mb-2">
          <h2 className="uppercase flex-1">{robot.name}: {robot.count} (+{amountToPurchaseDisplay})</h2>
          <h2 className="flex-1 text-right">{formatNumber(robot.resourcesPerSecond)}<GemIcon/>/sec</h2>
        </div>
        <Card
          color={props.robot.color}
          iconName="fa-robot"
          contentElement={<>{props.robot.description}</>}
          suffixElement={<>{formatNumber(currentCost)}<GemIcon/></>}
          onClick={() => {purchaseRobotAction(props.robot.id, numToPurchase)}}
          isClickDisabled={currentCost > currentResources}
        />
      </div>
    );
  }
);

export default RobotsList;
