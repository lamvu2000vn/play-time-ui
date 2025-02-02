import {FifteenPuzzleBoardMatrix} from "../../types";
import {MatchStatistics} from "../wsInterface";

export interface FifteenPuzzleGameSetup {
    matchTime: number;
}

export interface FifteenPuzzleDetail {
    hostBoardMatrix: FifteenPuzzleBoardMatrix;
    joinerBoardMatrix: FifteenPuzzleBoardMatrix;
}

export interface FifteenPuzzleSpecialData {
    myBoardMatrix: FifteenPuzzleBoardMatrix;
    opponentBoardMatrix: FifteenPuzzleBoardMatrix;
}

export interface FifteenPuzzlePlayerMovePayload {
    roomId: string;
    playerId: string;
    boardMatrix: FifteenPuzzleBoardMatrix;
}

export interface FifteenPuzzleOpponentBoardUpdatedPayload {
    playerMovedId: string;
    boardMatrix: FifteenPuzzleBoardMatrix;
    isOpponentWin: boolean;
    matchStatistics: MatchStatistics | null;
}
