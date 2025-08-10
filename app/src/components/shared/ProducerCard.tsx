import { memo, useState } from 'react';

import { AnimatePresence, motion } from "motion/react"

import ResourceIcon from '../../icons/ResourceIcon';
import SidebarCard from './Card';
import { Producer } from '../../game_state/types';
import { useGameStore } from '../../game_state/GameStore';
import { formatNumber } from '../../helpers/formatNumber';
import {
  calculatePriceForMultiplePurchases,
  calculateProducerProduction,
  calculateMaxPossiblePurchase,
} from '../../helpers/producerStateHelpers';
import TablerIconDisplay from '../../icons/TablerIconDisplay';

type PurchaseAmount = 1 | 5 | 10 | 'Max';


export const ProducerCard = memo(
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
      <AnimatePresence initial={false}>
        {
        producerIsActive &&
          <motion.div
            transition={{ duration: .8 }}
            initial={{ opacity: 0, scale: 0, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: "111px" }}
            className='mb-5 origin-top'
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
          </motion.div>
        }
      </AnimatePresence>
    );
  }
);

export default ProducerCard;