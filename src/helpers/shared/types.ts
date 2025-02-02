import {MyMatchInfo} from "./interfaces/commonInterface";
import {
    FifteenPuzzleDetail,
    FifteenPuzzleSpecialData,
    FifteenPuzzleGameSetup,
} from "./interfaces/games/fifteenPuzzleInterfaces";
import {MemoryDetails, MemoryGameSetup, MemorySpecialData} from "./interfaces/games/memoryInterfaces";
import {TicTacToeDetails, TicTacToeGameSetup, TicTacToeSpecialData} from "./interfaces/games/ticTacToeInterfaces";
import {WSResponse} from "./interfaces/wsInterface";

export type Theme = "myLightTheme" | "myDarkTheme";
export type Locales = "ar" | "en" | "es" | "fr" | "hi" | "ja" | "pt" | "ru" | "vi" | "zh";
export type GameAvailable = "Tic Tac Toe" | "15 Puzzle" | "Memory";
export type PlayerTurn = "random" | "me" | "opponent";
export type SubmitGameSetup<G> = (game: GameAvailable, gameSetup: G) => Promise<void>;
export type ItemType = "avatar" | "sticker";
export type WebSocketTransport = "N/A" | "polling" | "websocket";
export type ChatType = "message" | "sticker";
export type WSCallbackFunc<D> = (response: WSResponse<D>) => void;
export type Concrete<Type> = {
    [Property in keyof Type]-?: Type[Property];
};
export type TicTacToePlayerType = "XPlayer" | "OPlayer";
export type Position = {
    x: number;
    y: number;
};
export type TicTacToeBoardSize = "3x3" | "5x5";
export type MatchStatus = "progressing" | "completed";
export type MatchResult = "win" | "lose" | "draw";
export type WaitingRoomType = "PlayWithFriend" | "Random";
export type SettingType = "system" | "sound" | "language";
export type BackgroundImageAvailable =
    | "background-1.png"
    | "background-2.png"
    | "background-3.png"
    | "background-4.png"
    | "background-5.png";
export type Direction = "up" | "down" | "left" | "right";

export type FifteenPuzzleBoardMatrix = Array<Array<number>>;
export type TicTacToeBoardMatrix = Array<Array<TicTacToePlayerType | null>>;

export type TicTacToeMatchInfo = MyMatchInfo<TicTacToeGameSetup, TicTacToeDetails, TicTacToeSpecialData>;
export type FifteenPuzzleMatchInfo = MyMatchInfo<FifteenPuzzleGameSetup, FifteenPuzzleDetail, FifteenPuzzleSpecialData>;

// Memory Game
export type MemoryMatchInfo = MyMatchInfo<MemoryGameSetup, MemoryDetails, MemorySpecialData>;
export type MemoryCardFlipStatus = "none" | "flipping" | "flipped";
