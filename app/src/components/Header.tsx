import { memo } from 'react';

import { useGameStore } from '../game_state/GameStateZustand';
import { formatNumber } from '../helpers/formatNumber';

const CurrentMoneyDisplay = () => {
  console.log("CurrentMoneyDisplay render");
  const currentMoney = useGameStore((state) => state.currentMoney);
  return (
    <h1 className="text-3xl font-bold">
      {formatNumber(currentMoney)}<i className="fa-regular fa-gem fa-xs"/>
    </h1>
  );
};
const MoneyPerSecondDisplay = () => {
  console.log("MoneyPerSecondDisplay render");
  const moneyPerSecond = useGameStore((state) => state.moneyPerSecond);
  return (
    <h3 className="text-lg">
      {formatNumber(moneyPerSecond)}<i className="fa-regular fa-gem fa-xs"/>/sec
    </h3>
  );
};

const Header = memo(() => {
  console.log("Header render");
  return (
    <header
      id="header"
      className="
        min-w-[1100px] sticky top-0 z-10 p-5 mb-7 bg-med-purple
        border-gray-300 border-solid border-2 border-l-0 border-r-0
        flex flex-row shadow-[0_5px_10px_rgba(0,0,0,0.5)]"
    >
      <div
        id="planet-title"
        className="min-w-[400px]"
      >
        <h1 className='text-3xl font-bold'>PLANET BAJ</h1>
        <h3 className="text-lg">SWAMP BIOME</h3>
      </div>
      <div className="flex-grow"/>
      <div id="production-stats" className="min-w-[400px] text-right">
        <CurrentMoneyDisplay />
        <MoneyPerSecondDisplay />
      </div>
    </header>
  )
});
export default Header;
