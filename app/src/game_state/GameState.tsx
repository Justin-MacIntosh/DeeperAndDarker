import { createContext, Dispatch } from 'react';

// Game State typing
export interface GameState {
    robots: Robot[];
    currentMoney: number;
    moneyPerTick: number;
}
export interface Robot {
    // Robot identification
    id: number;
    name: string;
    description: string;
    tier: number;

    // Production stats
    count: number;
    currentCost: number
    baseCost: number;
    baseRate: number;
    baseProduction: number;

    // Whether to be shown
    minMoneyToShow: number;
    isBeingShown: boolean;
}

// Initial State
export const INITIAL_GAME_STATE: GameState = {
    currentMoney: 10000,
    moneyPerTick: 0,
    robots: [
        {
            id: 1,
            name: "MNR-N1",
            description: "Basic mining robot",
            tier: 1,
            count: 0,
            currentCost: 100,
            baseCost: 100,
            baseRate: 1.15,
            baseProduction: 100,
            minMoneyToShow: 0,
            isBeingShown: true,
        }
    ]
};

type GameStateAction =
 | { type: 'tenthTick' }
 | { type: 'purchaseRobot', robotId: number };

// Reducer to define the ways that the state can be updated
export const gameStateReducer = (state: GameState, action: GameStateAction): GameState => {
    /* TODO: Allow use of StrictMode, stop mutating state */
    switch (action.type) {
    case 'tenthTick':
        const updatedMoney = state.currentMoney + (state.moneyPerTick / 10);
        state.robots.forEach(robot => {
            if(!robot.isBeingShown && robot.minMoneyToShow < updatedMoney) {
                robot.isBeingShown = true;
            }
        });
        state.currentMoney = updatedMoney;
        return {...state};
    case 'purchaseRobot':
        const robot = state.robots.find(robot => robot.id == action.robotId);
        if (robot === undefined) {
            console.log(`ERROR: Robot not found for ID ${action.robotId}`);
            return state;
        }
        if (state.currentMoney < robot.currentCost) {
            console.log(`ERROR: Not enough money to purchase Robot with ID ${action.robotId}`);
            return state;
        }

        // Update global game state
        const moneyAfterPurchase = state.currentMoney - robot.currentCost;
        state.currentMoney = moneyAfterPurchase;
        state.moneyPerTick = state.moneyPerTick + robot.baseProduction; /* TODO: retroactively take upgrades inbto account */

        // Update robot state
        let newCost = robot.currentCost + (robot.baseCost * (robot.baseRate ** robot.count));
        newCost = Math.round(newCost);
        robot.currentCost = newCost;
        robot.count = robot.count + 1;

        return {...state};
    }

    console.log("ERROR: Action type not found");
    return state;
}

const updateRobotStateAfterPurchase = (initialRobotState: Robot): Robot => {
    /* TODO */
    
    return initialRobotState;
}

// Contexts for passing the game state to components
interface GameStateStore {
  state: GameState,
  dispatch: Dispatch<GameStateAction>,
}
export const GameStateContext: React.Context<GameStateStore> = createContext({} as GameStateStore);
