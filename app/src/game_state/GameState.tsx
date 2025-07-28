import { createContext } from 'react';

// Game State typing
interface GameState {
    robots: Robot[];
    currentMoney: number;
    moneyPerTick: number;
}
interface Robot {
    // Robot identification
    id: number;
    robotName: string;
    robotTier: number;

    // Production stats
    robotCount: number;
    robotCost: number;

    // Whether to be shown
    minMoneyToShow: number;
    isBeingShown: boolean;
}

// Initial State
export const INITIAL_GAME_STATE: GameState = {
    currentMoney: 1,
    moneyPerTick: 0,
    robots: [
        {
            id: 1,
            robotName: "MNR-N1",
            robotTier: 1,
            robotCount: 0,
            robotCost: 1,
            minMoneyToShow: 0,
            isBeingShown: true,
        }
    ]
};

type GameStateAction =
 | { type: 'tick' }
 | { type: 'purchaseRobot', robotId: number };

// Reducer to define the ways that the state can be updated
export const gameStateReducer = (state: GameState, action: GameStateAction): GameState => {
    switch (action.type) {
    case 'tick':
        const updatedMoney = state.currentMoney + state.moneyPerTick;
        state.robots.forEach(robot => {
            if(!robot.isBeingShown && robot.minMoneyToShow < updatedMoney) {
                robot.isBeingShown = true;
            }
        });
        return {
            ...state,
            currentMoney: updatedMoney
        };
    case 'purchaseRobot':
        const robotToPurchase = state.robots.find(robot => robot.id == action.robotId);
        if (robotToPurchase === undefined) {
            console.log(`ERROR: Robot not found for ID ${action.robotId}`);
            return state;
        }
        if (state.currentMoney < robotToPurchase.robotCost) {
            console.log(`ERROR: Not enough money to purchase Robot with ID ${action.robotId}`);
            return state;
        }
        const moneyAfterPurchase = state.currentMoney - robotToPurchase.robotCost;
        const updatedRobotState = updateRobotStateAfterPurchase(robotToPurchase);
        return {
            ...state,
            currentMoney: moneyAfterPurchase
        };
    }

    console.log("ERROR: Action type not found");
    return state;
}

const updateRobotStateAfterPurchase = (initialRobotState: Robot): Robot => {
    /* TODO */
    return initialRobotState;
}

// Contexts for passing the game state to components
export const GameStateContext = createContext(null);
export const GameStateDispatchContext = createContext(null);
