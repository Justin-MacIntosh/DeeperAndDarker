import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow'
import { AnimatePresence, motion } from "motion/react"

import { useGameStore } from '../../../game_state/GameStore';
import UnlockCard from '../UnlockCard';


const UnlockList = memo(({ stageId }: { stageId: string }) => {
  const unlockIds = useGameStore(
    useShallow((state) => Object.keys(state.stages[stageId].unlocks))
  );
  const anyUnlocksActive = useGameStore(
    useShallow((state) => Object.values(state.stages[stageId].unlocks).some(
      (unlock) => unlock.dynamic.isActive
    ))
  );

  return (
    <AnimatePresence initial={false}>
      {
        anyUnlocksActive &&
        <motion.div
          transition={{ duration: .5 }}
          initial={{ opacity: 0, scale: 0, width: 0 }}
          animate={{ opacity: 1, scale: 1, width: "400px" }}
          exit={{ opacity: 0, scale: 0, width: 0, margin: 0 }}
          className='w-[400px] ml-6 origin-top text-nowrap'
        >
          <div className="flex flex-row justify-between items-center mb-3">
            <h1 className="uppercase text-2xl font-bold">Research</h1>
          </div>
          <div className="flex flex-col">
            {unlockIds.map(
              (unlockId) => {
                return (
                  <UnlockCard
                    key={unlockId}
                    unlockId={unlockId}
                    stageId={stageId}
                  />
                )
              }
            )}
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
});

export default UnlockList;
