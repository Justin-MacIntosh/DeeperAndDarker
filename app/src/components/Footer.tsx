import { resetGameState } from '../game_state/stateStorageHelpers';
import { useGameStore } from '../game_state/GameStore';

/* 
 * Footer component displays the footer with save and reset buttons,
 * and the last date and time the game was saved.
 */
const Footer = ({ saveCurrentGameData }: { saveCurrentGameData: () => void}) => {
  console.log("Footer render");

  const resetAction = useGameStore((state) => state.resetGame);
  const resetGame = () => {
    resetGameState();
    resetAction();
  }

  return (
    <footer className="h-full py-5 mx-8 flex content-center">
      <div className="flex-1"></div>
      <div className="min-w-[400px] text-right">
        <LastDateTimeSavedDisplay />
        <button className="btn-default mr-3" onClick={saveCurrentGameData}>Save</button>
        <button className="btn-default" onClick={resetGame}>Reset</button>
      </div>
    </footer>
  );
}

/* LastDateTimeSavedDisplay component displays the last date and time the game was saved. */
const LastDateTimeSavedDisplay = () => {
  console.log("LastDateTimeSavedDisplay render");

  const timeSaved = useGameStore((state) => state.timeSaved);
  if (!timeSaved) {
    // Render nothing if no data available
    return null;
  }

  const lastDateTimeSaved = new Date(timeSaved).toLocaleString();
  return (
    <span className="mr-3">Last saved {lastDateTimeSaved}</span>
  );
}

// Export the Footer component
export default Footer;
