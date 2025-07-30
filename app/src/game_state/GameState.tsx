import { createContext, Dispatch } from 'react';

// Game State typing
export interface GameState {
    robots: Robot[];
    currentMoney: number;
    moneyPerSecond: number;
    timeSaved: number; // Optional field to track last save time
    timeOfflineData?: {
        moneyEarned: number;
        timeElapsed: number;
    }; // Optional field to track offline earnings
}
export interface Robot {
    // Robot identification
    id: number;
    name: string;
    description: string;
    color: 'blue' | 'red' | 'green';

    // Production stats
    count: number;
    currentCost: number
    baseCost: number;
    baseRate: number;
    baseProduction: number;

    // Whether to be shown
    minMoneyToShow: number;
    isBeingShown: boolean;
    animateAppearance: boolean;
}

// Initial State
export const INITIAL_GAME_STATE: GameState = {
    currentMoney: 100,
    moneyPerSecond: 0,
    timeSaved: 0,
    robots: [
        {
            id: 1,
            name: "MNR-N1",
            description: "Basic mining robot",
            color: 'blue',
            count: 0,
            currentCost: 100,
            baseCost: 100,
            baseRate: 1.15,
            baseProduction: 150,
            minMoneyToShow: 0,
            isBeingShown: true,
            animateAppearance: false,
        },
        {
            id: 2,
            name: "MNR-X1",
            description: "Supercharged mining robot",
            color: 'red',
            count: 0,
            currentCost: 5000,
            baseCost: 5000,
            baseRate: 1.15,
            baseProduction: 2500,
            minMoneyToShow: 10000,
            isBeingShown: false,
            animateAppearance: true,
        }
    ]
};

type GameStateAction =
 | { type: 'tick', milliseconds: number }
 | { type: 'purchaseRobot', robotId: number }
 | { type: 'updateTimeSaved', timeSaved: number };

// Reducer to define the ways that the game state can be updated
export const gameStateReducer = (state: GameState, action: GameStateAction): GameState => {
    switch (action.type) {
        case 'tick': {
            const tickRate = action.milliseconds / 1000;
            const updatedMoney = state.currentMoney + (state.moneyPerSecond * tickRate);
            const updatedRobots = state.robots.map(robot => {
                if (!robot.isBeingShown && robot.minMoneyToShow < updatedMoney) {
                    return { ...robot, isBeingShown: true };
                }
                return robot;
            });
            return {
                ...state,
                currentMoney: updatedMoney,
                robots: updatedRobots,
            };
        }
        case 'purchaseRobot': {
            const robotIndex = state.robots.findIndex(robot => robot.id === action.robotId);
            if (robotIndex === -1) {
                console.log(`ERROR: Robot not found for ID ${action.robotId}`);
                return state;
            }
            const robot = state.robots[robotIndex];
            if (state.currentMoney < robot.currentCost) {
                console.log(`ERROR: Not enough money to purchase Robot with ID ${action.robotId}`);
                return state;
            }

            // Update the robot in the Robots array
            const updatedRobots = [
                ...state.robots.slice(0, robotIndex),
                updateRobotStateAfterPurchase(robot, 1), // TODO: Allow multiple purchases at once
                ...state.robots.slice(robotIndex + 1),
            ];
            return {
                ...state,
                currentMoney: state.currentMoney - robot.currentCost,
                moneyPerSecond: state.moneyPerSecond + robot.baseProduction, // TODO: Retroactively take upgrades into account
                robots: updatedRobots,
            };
        }
        case 'updateTimeSaved': {
            return {
                ...state,
                timeSaved: action.timeSaved,
            };
        }
        default:
            console.log("ERROR: Action type not found");
            return state;
    }
}

const updateRobotStateAfterPurchase = (robotToUpdate: Robot, numPurchased: number): Robot => {
    /* Update the robot's count and cost */
    const updatedCount = robotToUpdate.count + 1;
    let updatedCost = robotToUpdate.currentCost + (robotToUpdate.baseCost * (robotToUpdate.baseRate ** updatedCount));
    updatedCost = Math.round(updatedCost);
    return {
        ...robotToUpdate,
        count: updatedCount,
        currentCost: updatedCost,
    };
}

// Contexts for passing the game state to components
interface GameStateStore {
  state: GameState,
  dispatch: Dispatch<GameStateAction>,
}
export const GameStateContext: React.Context<GameStateStore> = createContext({} as GameStateStore);
