import { memo, useState } from 'react';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useShallow } from 'zustand/react/shallow'

import { useGameStore } from '../../../game_state/GameStore';
import { ProducerCard } from '../ProducerCard';


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
                w-24 p-2 bg-primary
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
              <ProducerCard
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

export default ProducerList;
