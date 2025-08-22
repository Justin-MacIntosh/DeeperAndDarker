import { memo, useState } from 'react';

import {
  Description, Dialog, DialogBackdrop,
  DialogPanel, DialogTitle
} from '@headlessui/react'

import { useGameStore } from '../../game_state/GameStore';
import { INITIAL_GAME_STATE } from '../../game_state/InitialGameState';
import { resetGameState } from '../../game_state/stateStorageHelpers';



const SettingsButton = memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  const resetAction = useGameStore((state) => state.resetGame);
  const resetGame = () => {
    console.log(INITIAL_GAME_STATE);
    resetGameState();
    resetAction();
  }

  // Use the Electron API defined in preload.ts script
  // @ts-ignore
  const electronApi: any = window.electronApi;

  return (
    <>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50"/>
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            className="
              max-w-lg p-12
              bg-gray-800
              border-gray-300 border-solid border-2 rounded-xl"
          >
            <DialogTitle className="text-2xl mb-3">Settings</DialogTitle>
            <Description>
              <div className="flex flex-row gap-7">
                <div className="flex flex-col gap-3">
                  <button
                    className="btn-default bg-gray-600"
                    onClick={
                      () => { electronApi.fullscreen(); }
                    }
                  >
                    Fullscreen
                  </button>
                  <button
                    className="btn-default bg-gray-600"
                    onClick={
                      () => { electronApi.windowed(); }
                    }
                  >
                    Windowed
                  </button>
                  <button
                    className="btn-default bg-gray-600 mb-5"
                    onClick={
                      () => { electronApi.devtools(); }
                    }
                  >
                    Devtools
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    className="btn-default bg-gray-600 mb-5"
                    onClick={
                      () => {
                        setIsOpen(false);
                        resetGame();
                      }
                    }
                  >
                    Reset game
                  </button>
                </div>
              </div>
            </Description>
          </DialogPanel>
        </div>
      </Dialog>
      <button
        className="btn-default bg-primary"
        onClick={() => setIsOpen(true)}
      >
        Settings
      </button>
    </>
  );
});
export default SettingsButton;
