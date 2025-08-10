import { useState } from 'react';

import Drawer from 'react-modern-drawer'
import { useGameStore } from './game_state/GameStore';
import { useShallow } from 'zustand/react/shallow';


// GlobalDrawer component that provides a navigation drawer for stage selection
const GlobalDrawer = ({ setCurrentStage }: { setCurrentStage: (stageId: string) => void }) => {
  const stageIds = useGameStore(
    useShallow((state) => Object.keys(state.stages))
  );
  const numActiveStages = useGameStore(
    useShallow((state) => Object.values(state.stages).reduce(
      (count, stage) => {
        if (stage.isActive) {
          return count + 1;
        }
        return count;
      }, 0
    ))
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  if (numActiveStages < 2) {
    return null;
  }
  
  return (
    <>
      <Drawer
        open={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); }}
        direction="left"
        zIndex={1000}
        size={"200px"}
        duration={300}
        overlayColor={"rgba(0, 0, 0, 0.3)"}
        overlayClassName='transition-all duration-300 ease-in-out'
        className="border-right border-gray-300 border-r-solid border-r-[3px]"
      >
        <div className="h-full bg-gray-800 text-gray-300 flex flex-col p-5">
          {stageIds.map((stageId) => (
            <StageSelectButton
              key={stageId}
              stageId={stageId}
              setCurrentStage={setCurrentStage}
            />
          ))}
        </div>
        <button className="cursor-default fixed top-[120px] left-[200px] z-20 w-2 bg-gray-300 h-20 rounded-r-xl" />
      </Drawer>
      <button
        id="global-drawer-btn"
        className="cursor-default fixed top-[120px] z-20 w-2 bg-gray-300 h-20 rounded-r-xl"
        onMouseOver={() => { setIsDrawerOpen(true); }}
      />
    </>
  );
}

// StageSelectButton component that renders a button for navigating to each stage
const StageSelectButton = (
  { stageId, setCurrentStage }:
  { stageId: string; setCurrentStage: (stageId: string) => void }
) => {
  const stageName = useGameStore(
    (state) => state.stages[stageId].name
  );

  // Check if the stage is active before rendering the button
  const isStageActive = useGameStore(
    (state) => state.stages[stageId].isActive
  );
  if (!isStageActive) {
    return null; // Don't render inactive stages
  }

  return (
    <button
      className="btn-default bg-gray-600 mb-5"
      onClick={() => { setCurrentStage(stageId); }}
    >
      {stageName}
    </button>
  );
}

export default GlobalDrawer;
