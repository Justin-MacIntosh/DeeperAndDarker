import { memo } from 'react';
import { AnimatePresence, motion } from "motion/react"

import ResourceIcon from '../icons/ResourceIcon';
import SidebarCard from './Card';

import { Task } from '../../game_state/types';
import { useGameStore } from '../../game_state/GameStore';
import { formatNumber } from '../../number_helpers/formatNumber';
import TablerIconDisplay from '../icons/TablerIconDisplay';


const taskCardVariant = {
  initial: { opacity: 0, scale: 0, height: 0 },
  animate: { opacity: 1, scale: 1, height: "111px" },
  exit: { opacity: 0, scale: 0, height: 0 },
};


const TaskCard = memo(
  (props: { taskId: string; stageId: string; optionalCallback?: () => void }) => {
    // Actions and state from the game store
    const task: Task = useGameStore(
      (state) => state.stages[props.stageId].tasks[props.taskId]
    );
    const taskIsActive = useGameStore(
      (state) => state.stages[props.stageId].tasks[props.taskId].dynamic.isActive
    );
    // const beginTaskAction = useGameStore((state) => state.beginTask);

    // Get the current amount of the resource required to purchase this producer
    const relevantResource = task.static.purchaseResource;
    const currentRelevantResources: bigint = useGameStore(
      (state) => state.resources[relevantResource].currentAmount
    );

    // Calculate the cost and number of producers to purchase
    const currentCostStr: string = formatNumber(task.static.cost);
    return (
      <AnimatePresence initial={false}>
        {
          taskIsActive &&
          <motion.div
            transition={{ duration: .8 }}
            variants={taskCardVariant}
            className='[&:not(:last-child)]:mb-5 origin-top'
          >
            <div className="text-lg flex flex-row mb-2">
              <h2 className="uppercase flex-1">
                {task.static.name}
              </h2>
            </div>
            <SidebarCard
              color={"red"} // Assuming tasks are always red
              icon={
                <TablerIconDisplay icon={task.static.iconOption} size={55} />
              }
              contentElement={<>{task.static.description}</>}
              suffixElement={
                <span>{currentCostStr}<ResourceIcon resource={task.static.purchaseResource} size={18} /></span>
              }
              onClick={() => {
                return; // TODO: Implement task purchase logic
              }}
              isClickDisabled={task.static.cost > currentRelevantResources}
            />
          </motion.div>
        }
      </AnimatePresence>
    );
  }
);

export default TaskCard;
