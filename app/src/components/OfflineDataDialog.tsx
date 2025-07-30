import { memo, useContext, useState } from 'react';

import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

import { GameStateContext } from '../game_state/GameState';
import { formatNumber } from '../helpers/formatNumber';

const OfflineDataDialog = memo(() => {
  const { state: gameState } = useContext(GameStateContext);
  const offlineData = gameState.timeOfflineData;

  let [isOpen, setIsOpen] = useState(offlineData !== undefined);
  if (offlineData === undefined) {
    return null; // No offline data to display
  }

  console.log("offline render");

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          className="
            max-w-lg p-12
            bg-dark-purple
            border-gray-300 border-solid border-2 rounded-xl"
        >
          <DialogTitle className="text-2xl mb-3">Offline earnings</DialogTitle>
          <Description>
            You were offline for {Math.round(offlineData.timeElapsed / 1000)} second(s) and
            earned {formatNumber(offlineData.moneyEarned)} resources!
          </Description>
        </DialogPanel>
      </div>
    </Dialog>
  );
});
export default OfflineDataDialog;
