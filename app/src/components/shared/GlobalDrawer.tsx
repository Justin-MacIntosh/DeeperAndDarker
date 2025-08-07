import { useState } from 'react';

import Drawer from 'react-modern-drawer'


const GlobalDrawer = ({ setCurrentStage }: { setCurrentStage: (stageId: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDrawer = () => {
      setIsOpen((prevState) => !prevState)
  }

  return (
    <>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction='left'
        zIndex={1000}
        size={'200px'}
        duration={300}
        className="border-right border-gray-300 border-r-solid border-r-[3px]"
      >
        <div className="h-full bg-gray-800 text-gray-300 flex flex-col p-5">
          <button
            className="btn-default bg-gray-600 mb-5"
            onClick={() => setCurrentStage("stage_1")}
          >
            Deep space
          </button>
          <button
            className="btn-default bg-gray-600"
            onClick={() => setCurrentStage("stage_2")}
          >
            Planet Yan
          </button>
        </div>
        <button
          className="cursor-default fixed top-[120px] left-[200px] z-20 w-2 bg-gray-300 h-20 rounded-r-xl"
        />
      </Drawer>
      <button
        className="cursor-default fixed top-[120px] z-20 w-2 bg-gray-300 h-20 rounded-r-xl"
        onMouseOver={toggleDrawer}
      />
    </>
  );
}

export default GlobalDrawer;
