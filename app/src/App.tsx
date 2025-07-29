import { useEffect, useReducer } from 'react';

import {
  INITIAL_GAME_STATE, gameStateReducer, GameStateContext,
} from './game_state/GameState';
import RobotDisplay from './components/RobotDisplay';

const App = () => {
  const [gameState, dispatch] = useReducer(gameStateReducer, INITIAL_GAME_STATE);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({ type: "tenthTick" });
    }, 100);

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
          <h4>{gameState.currentMoney}<i className="fa-solid fa-dollar-sign fa-xs"/></h4>
          <h4>{gameState.moneyPerTick}<i className="fa-solid fa-dollar-sign fa-xs"/>/sec</h4>
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
        </div>
        <div className="sidebar">
          <h1 className="bots-title">AUTOMATONS</h1>

          {Object.entries(gameState.robots).map(([_, robot]) => (
            <RobotDisplay robot={robot}/>
          ))}
        </div>
      </div>
    </GameStateContext>
  );
}
export default App;
