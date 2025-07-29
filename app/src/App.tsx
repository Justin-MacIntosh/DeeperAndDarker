import { useEffect, useReducer } from 'react';

import {
  INITIAL_GAME_STATE, gameStateReducer, GameStateContext,
} from './game_state/GameState';
import RobotDisplay from './components/RobotDisplay';
import { formatNumber } from './helpers/formatNumber';

const App = () => {
  const [gameState, dispatch] = useReducer(gameStateReducer, INITIAL_GAME_STATE);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({ type: "fifthTick" });
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

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
          <h3 className="global-production">{formatNumber(gameState.moneyPerTick)}<i className="fa-regular fa-gem fa-xs"/>/sec</h3>
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
    </GameStateContext>
  );
}
export default App;
