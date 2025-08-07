import { memo, useState } from 'react';
import { clsx } from 'clsx';
import { useShallow } from 'zustand/react/shallow'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'

import ResourceIcon from '../../icons/ResourceIcon';
import SidebarCard from './SidebarCard';
import { Producer } from '../../game_state/types';
import { useGameStore } from '../../game_state/GameStore';
import { formatNumber } from '../../helpers/formatNumber';
import {
  calculatePriceForMultiplePurchases,
  calculateProducerProduction,
  calculateMaxPossiblePurchase
} from '../../helpers/producerStateHelpers';
import TablerIconDisplay from '../../icons/TablerIconDisplay';


type PurchaseAmount = 1 | 5 | 10 | 'Max';

const ProducerList = memo(({ stageId }: { stageId: string }) => {
  const producerIds = useGameStore(
    useShallow((state) => Object.keys(state.stages[stageId].producers))
  );

  console.log("ProducerList render");
  const [numToPurchaseOption, setNumToPurchaseOption] = useState<PurchaseAmount>(1);

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
        {producerIds.map(
          (prodId) => {
            return (
              <SingleProducerDisplay
                key={prodId}
                producerId={prodId}
                stageId={stageId}
                numToPurchaseOption={numToPurchaseOption}
              />
            )
          }
        )}
      </div>
    </>
  );
});

const SingleProducerDisplay = memo(
  (props: { producerId: string; stageId: string; numToPurchaseOption: PurchaseAmount; }) => {
    // Actions and state from the game store
    const producer: Producer = useGameStore(
      (state) => state.stages[props.stageId].producers[props.producerId]
    );
    const producerIsActive = useGameStore(
      (state) => state.stages[props.stageId].producers[props.producerId].dynamic.isActive
    );
    const purchaseProducerAction = useGameStore((state) => state.purchaseProducer)

    // Get the current amount of the resource required to purchase this producer
    const relevantResource = producer.static.purchaseResource;
    const currentRelevantResources: bigint = useGameStore(
      (state) => state.resources[relevantResource].currentAmount
    );

    if (!producerIsActive) {
      return null; // If the producer is not active, do not render anything
    }
  
    const resourcesPerSecond = calculateProducerProduction(producer);

    // Calculate the cost and number of producers to purchase
    let currentCost: bigint = BigInt(0);
    let numToPurchase: number = 0;
    if (props.numToPurchaseOption === 'Max') {
      ({ cost: currentCost, maxPossiblePurchase: numToPurchase } = (
        calculateMaxPossiblePurchase(producer, currentRelevantResources)
      ));
    } else {
      currentCost = (
        calculatePriceForMultiplePurchases(
          producer, props.numToPurchaseOption
        )
      );
      numToPurchase = props.numToPurchaseOption;
    }

    let amountToPurchaseDisplay = numToPurchase.toString();
    if (props.numToPurchaseOption === 'Max' && currentCost > currentRelevantResources) {
      amountToPurchaseDisplay = "0";
    }
    return (
      <div
        className={clsx("mb-5", producer.static.animateAppearance && "fade-in-sidebar")}
      >
        <div className="text-lg flex flex-row mb-2">
          <h2 className="uppercase flex-1">
            {producer.static.name}: {producer.dynamic.count} (+{amountToPurchaseDisplay})
          </h2>
          <h2 className="flex-1 text-right">
            {formatNumber(resourcesPerSecond)}<ResourceIcon resource={producer.static.producedResource} size={18} />/sec
          </h2>
        </div>
        <SidebarCard
          color={producer.static.color as any} // TODO: Fix later
          icon={
            <TablerIconDisplay icon={producer.static.iconOption} size={55} />
          }
          contentElement={<>{producer.static.description}</>}
          suffixElement={
            <>{formatNumber(currentCost)}<ResourceIcon resource={producer.static.purchaseResource} size={18} /></>
          }
          onClick={() => {
            purchaseProducerAction(props.stageId, props.producerId, numToPurchase)
          }}
          isClickDisabled={currentCost > currentRelevantResources}
        />
      </div>
    );
  }
);

export default ProducerList;
