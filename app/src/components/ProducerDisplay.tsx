import { memo, useState } from 'react';
import { clsx } from 'clsx';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'

import GemIcon from '../icons/GemIcon';
import SidebarCard from './SidebarCard';

import { Producer } from '../types';
import { useGameStore } from '../game_state/GameStore';
import { formatNumber } from '../helpers/formatNumber';
import {
  calculatePriceForMultiplePurchases,
  calculateMaxPossiblePurchase
} from '../helpers/producerStateHelpers';
import TablerIconDisplay from '../icons/TablerIconDisplay';

type PurchaseAmount = 1 | 5 | 10 | 'Max';

const ProducerList = () => {
  // console.log("ProducerList render");
  const [numToPurchaseOption, setNumToPurchaseOption] = useState<PurchaseAmount>(1);

  const producers = useGameStore((state) => state.producers);
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
        {producers.map(
          (prod) => {
            if (!prod.isBeingShown) {
              return null;
            }
            return (
              <SingleProducerDisplay
                key={prod.id.toString()}
                producer={prod}
                numToPurchaseOption={numToPurchaseOption}
              />
            )
          }
        )}
      </div>
    </>
  );
};

const SingleProducerDisplay = memo(
  (props: { producer: Producer; numToPurchaseOption: PurchaseAmount; }) => {
    console.log("SingleProducerDisplay render");
    const producer = props.producer;

    // Actions and state from the game store
    const purchaseProducerAction = useGameStore((state) => state.purchaseProducer)
    const currentResources: BigInt = useGameStore((state) => state.currentResources);
    const stage = useGameStore((state) => state.stage);

    // Calculate the cost and number of producers to purchase
    let currentCost: BigInt = 0;
    let numToPurchase: number = 0;
    if (props.numToPurchaseOption === 'Max') {
      ({ cost: currentCost, maxPossiblePurchase: numToPurchase } = (
        calculateMaxPossiblePurchase(props.producer, currentResources, stage.upgradeSlots)
      ));
    } else {
      currentCost = (
        calculatePriceForMultiplePurchases(
          props.producer, props.numToPurchaseOption, stage.upgradeSlots
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
        "mb-5", producer.animateAppearance && "fade-in"
      )}>
        <div className="text-lg flex flex-row mb-2">
          <h2 className="uppercase flex-1">{producer.name}: {producer.count} (+{amountToPurchaseDisplay})</h2>
          <h2 className="flex-1 text-right">{formatNumber(producer.resourcesPerSecond)}<GemIcon size={18}/>/sec</h2>
        </div>
        <SidebarCard
          color={props.producer.color}
          icon={<TablerIconDisplay icon={props.producer.icon} size={55}/>}
          contentElement={<>{props.producer.description}</>}
          suffixElement={<>{formatNumber(currentCost)}<GemIcon size={18}/></>}
          onClick={() => {purchaseProducerAction(props.producer.id, numToPurchase)}}
          isClickDisabled={currentCost > currentResources}
        />
      </div>
    );
  }
);

export default ProducerList;
