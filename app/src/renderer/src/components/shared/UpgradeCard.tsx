import { useContext } from "react";
import { motion } from "motion/react"
import { clsx } from "clsx"

import { useGameStore } from '../../game_state/GameStore';
import TablerIconDisplay from '../icons/TablerIconDisplay';
import ResourceIcon from '../icons/ResourceIcon';
import { formatNumber } from '../../number_helpers/formatNumber';
import { multiplyBigIntByNumber } from "../../number_helpers/bigIntUtils";
import { CommonSoundsContext } from "../../audio/CommonSoundsContext";


const upgradeCardVariant = {
  initial: { opacity: 0, scale: 0, height: 0 },
  animate: { opacity: 1, scale: 1, height: "85px" },
  exit: { opacity: 0, scale: 0, height: 0 },
};

export const UpgradeCard = (
  { stageId, upgradeId }:
  { stageId: string, upgradeId: string }
) => {
  const upgrade = useGameStore(
    (state) => state.stages[stageId].upgrades[upgradeId]
  );
  const purchaseUpgradeAction = useGameStore(
    (state) => state.purchaseUpgrade
  );

  const commonSounds = useContext(CommonSoundsContext);
  const pressButton = () => {
    commonSounds.buttonPress.play();
    purchaseUpgradeAction(stageId, upgradeId);
  }

  const relevantResource = upgrade.static.purchaseResource;
  const resourceAmount = useGameStore(
    (state) => state.resources[relevantResource].currentAmount
  );

  const currentCost = multiplyBigIntByNumber(
    upgrade.static.baseCost,
    upgrade.static.baseRateOfCostIncrease ** (upgrade.dynamic.count)
  );

  const cardActiveClasses = clsx(
    "cursor-pointer hover:brightness-[108%] hover:-translate-y-1",
    "active:brightness-[105%] active:-translate-y-0.5"
  );
  const cardDisabledClasses = "opacity-50 cursor-not-allowed";
  const isClickDisabled = currentCost > resourceAmount;

  return (
    <motion.div
      key={stageId + " " + upgradeId}
      variants={upgradeCardVariant}
      transition={{ duration: .5 }}
      className='mb-2 origin-top'
    >
      <li
        key={upgradeId}
        className={clsx(
          "select-none bg-accent p-3 rounded-xl transition-all flex flex-row items-center gap-3 opacity-",
          isClickDisabled ? cardDisabledClasses : cardActiveClasses,
        )}
        onClick={() => {
          if (!isClickDisabled) {
            pressButton();
          }
        }}
      >
        <div className="flex-1">
          <TablerIconDisplay icon={upgrade.static.iconOption} size={60} />
        </div>
        <div className="flex-[3]">
          <span className="text-sm"><span className="underline">{upgrade.static.name}</span> ({upgrade.dynamic.count})</span>
          <p className="text-sm">{upgrade.static.description}</p>
        </div>
        <div className="flex-[1]">
          {formatNumber(currentCost)}<ResourceIcon resource={upgrade.static.purchaseResource} size={18} />
        </div>
      </li>
    </motion.div>
  );
}

export default UpgradeCard;