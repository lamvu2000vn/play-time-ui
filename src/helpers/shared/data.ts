import {FifteenPuzzleGameSetup} from "./interfaces/games/fifteenPuzzleInterfaces";
import {MemoryGameSetup} from "./interfaces/games/memoryInterfaces";
import {TicTacToeGameSetup} from "./interfaces/games/ticTacToeInterfaces";
import {Locales} from "./types";

export const localesAvailable: Locales[] = ["ar", "en", "es", "hi", "zh", "vi", "ru", "pt", "ja", "fr"];

export const ticTacToeDefaultSetup: TicTacToeGameSetup = {
    boardSize: "3x3",
    turnTime: 30,
    firstTurn: "random",
};

export const fifteenPuzzleDefaultSetup: FifteenPuzzleGameSetup = {
    matchTime: 300,
};

export const memoryDefaultSetup: MemoryGameSetup = {
    matchTime: 9000,
    theme: "fruit",
    numOfCards: 16,
};
