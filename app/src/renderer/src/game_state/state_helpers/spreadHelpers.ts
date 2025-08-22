import { Producer, Stage, Task, Unlockable, Upgrade } from '../types';

export const updateProducerInStages = (
  stages: { [key: string]: Stage }, stageId: string, producerId: string, newProducerState: Producer
) => {
  const updatedStages = { ...stages };
  updatedStages[stageId] = {
    ...stages[stageId],
    producers: {
      ...stages[stageId].producers,
      [producerId]: { ...newProducerState },
    },
  };
  return updatedStages;
};


export const updateUpgradeInStages = (
  stages: { [key: string]: Stage }, stageId: string, upgradeId: string, newUpgradeState: Upgrade
) => {
  const updatedStages = { ...stages };
  updatedStages[stageId] = {
    ...stages[stageId],
    upgrades: {
      ...stages[stageId].upgrades,
      [upgradeId]: { ...newUpgradeState },
    },
  };
  return updatedStages;
};


export const updateUnlockInStages = (
  stages: { [key: string]: Stage }, stageId: string, unlockId: string, newUnlockState: Unlockable
) => {
  const updatedStages = { ...stages };
  updatedStages[stageId] = {
    ...stages[stageId],
    unlocks: {
      ...stages[stageId].unlocks,
      [unlockId]: { ...newUnlockState },
    },
  };
  return updatedStages;
};

export const updateTaskInStages = (
  stages: { [key: string]: Stage }, stageId: string, taskId: string, newTaskState: Task
) => {
  const updatedStages = { ...stages };
  updatedStages[stageId] = {
    ...stages[stageId],
    tasks: {
      ...stages[stageId].tasks,
      [taskId]: { ...newTaskState },
    },
  };
  return updatedStages;
}
