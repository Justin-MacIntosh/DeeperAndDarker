import { useEffect, useReducer, useRef } from 'react';

import {
  INITIAL_GAME_STATE, gameStateReducer, GameStateContext,
} from './game_state/GameState';
import { saveGameState, loadGameState } from './game_state/gameStateStorage';
import RobotDisplay from './components/RobotDisplay';
import { formatNumber } from './helpers/formatNumber';

const LOADED_GAME_STATE = loadGameState() || INITIAL_GAME_STATE;
if (LOADED_GAME_STATE.timeOfflineData) {
  alert(`You were offline for ${Math.floor(LOADED_GAME_STATE.timeOfflineData.timeElapsed / 1000)} seconds and earned ${formatNumber(LOADED_GAME_STATE.timeOfflineData.moneyEarned)} gems!`);
}

const App = () => {
  const [gameState, dispatch] = useReducer(gameStateReducer, LOADED_GAME_STATE);

  const saveCurrentGameData = () => {
    const timeSaved = Date.now();
    dispatch({ type: "updateTimeSaved", timeSaved: timeSaved });
    saveGameState({ ...gameStateRef.current, timeSaved: timeSaved });
  }

  // Effect to handle game ticks
  useEffect(() => {
    const tickIntervalId = setInterval(() => {
      dispatch({ type: "tick", milliseconds: 200 });
    }, 200);
    return () => clearInterval(tickIntervalId);
  }, []);

  // Ref to always have the latest gameState in the interval
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Effects to save game state periodically
  useEffect(() => {
    const saveStateIntervalId = setInterval(() => {
      saveCurrentGameData();
    }, 5000);
    return () => clearInterval(saveStateIntervalId);
  }, []);

  const lastDateTimeSaved = new Date(gameState.timeSaved).toLocaleString();

  return (
    <GameStateContext value={{state: gameState, dispatch: dispatch}}>
      <header className="header">
        <div className="header-left">
          <h1>PLANET BAJ</h1>
          <h3 style={{"paddingLeft": "5px"}}>SWAMP BIOME</h3>
        </div>
        <div className="header-middle"/>
        <div className="header-right">
          <h1>{formatNumber(gameState.currentMoney)}<i className="fa-regular fa-gem fa-xs"/></h1>
          <h3 className="global-production">{formatNumber(gameState.moneyPerSecond)}<i className="fa-regular fa-gem fa-xs"/>/sec</h3>
        </div>
      </header>
      <div className="main">
        <div className="content">
          <div className="content-planetary-row">
            <div className="planet-display"></div>
            <div className="planetary-data-display">
              <h3>PLANETARY DATA</h3>
            </div>
          </div>
          <div className="content-structures-row">
            <div className="structure-display">
              <h3>STRUCTURES</h3>
            </div>
          </div>
        </div>
        <div className="sidebar">
          <h1 className="bots-title">AUTOMATONS</h1>

          {Object.entries(gameState.robots).map(([_, robot]) => (
            robot.isBeingShown && <RobotDisplay robot={robot}/>
          ))}
        </div>
      </div>
      <footer className="footer">
        <div className="footer-middle"></div>
        <div className="footer-right">
          { lastDateTimeSaved && <span className="last-saved-display">Last saved {lastDateTimeSaved}</span> }
          <button className="save-button" onClick={saveCurrentGameData}>Save</button>
        </div>
      </footer>
    </GameStateContext>
  );
}
export default App;
