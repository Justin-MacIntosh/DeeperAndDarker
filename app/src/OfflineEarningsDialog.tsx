import { memo, useState } from 'react';

import {
  Description, Dialog, DialogBackdrop,
  DialogPanel, DialogTitle
} from '@headlessui/react'

import { useGameStore } from './game_state/GameStore2';
import { formatNumber } from './helpers/formatNumber';

const OfflineEarningsDialog = memo(() => {
  const timeOfflineData = useGameStore((state) => state.offlineData);

  let [isOpen, setIsOpen] = useState(timeOfflineData !== undefined);
  if (timeOfflineData === undefined) {
    return null; // No offline data to display
  }
  console.log("offline render");

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50"/>
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          className="
            max-w-lg p-12
            bg-dark-purple
            border-gray-300 border-solid border-2 rounded-xl"
        >
          <DialogTitle className="text-2xl mb-3">Offline earnings</DialogTitle>
          <Description>
            You were offline for {(timeOfflineData.timeElapsed / 1000).toFixed(2)} second(s) and
            earned:
            <li className="ml-2">{formatNumber(timeOfflineData.resourcesEarned['copper'])} copper</li>
            <li className="ml-2">{formatNumber(timeOfflineData.resourcesEarned['silver'])} silver</li>
          </Description>
        </DialogPanel>
      </div>
    </Dialog>
  );
});
export default OfflineEarningsDialog;
