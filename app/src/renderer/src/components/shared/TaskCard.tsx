import { motion } from "motion/react"
import { useShallow } from 'zustand/react/shallow';

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

const TaskCard = (props: { taskId: string; stageId: string }) => {
  // Actions and state from the game store
  const task: Task = useGameStore(
    (state) => state.stages[props.stageId].tasks[props.taskId]
  );
  const runningTaskIds = useGameStore(
    useShallow((state) => state.runningTasks.map((task) => task.taskId))
  );
  const taskIsRunning = runningTaskIds.includes(props.taskId);

  const startTaskAction = useGameStore((state) => state.startTask);

  // Get the current amount of the resource required to purchase this producer
  const relevantResource = task.static.purchaseResource;
  const currentRelevantResources: bigint = useGameStore(
    (state) => state.resources[relevantResource].currentAmount
  );

  // Calculate the cost and number of producers to purchase
  const currentCostStr: string = formatNumber(task.static.cost);
  return (
    <motion.div
      key={props.stageId + " " + props.taskId}
      variants={taskCardVariant}
      transition={{ duration: .8 }}
      className='origin-top'
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
          startTaskAction(props.stageId, props.taskId);
        }}
        isClickDisabled={taskIsRunning || task.static.cost > currentRelevantResources}
      />
    </motion.div>
  );
};

export default TaskCard;
