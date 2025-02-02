import {MatchStatus, PlayerTurn, TicTacToeBoardSize, TicTacToePlayerType} from "../../types";
import {PlayerInfo} from "../commonInterface";

export interface TicTacToePlayerInfo extends PlayerInfo {
    playerType: TicTacToePlayerType;
}

export interface TicTacToeGameSetup {
    boardSize: TicTacToeBoardSize;
    turnTime: number;
    firstTurn: PlayerTurn;
}

export interface TicTacToeDetails {
    xPlayerId: string;
    oPlayerId: string;
    firstTurnId: string;
}

export interface TicTacToeSpecialData {
    firstTurn: PlayerTurn;
    currentTurn: PlayerTurn;
    myType: TicTacToePlayerType;
    opponentType: TicTacToePlayerType;
}

export interface ITicTacToeMatchInfo {
    roomId: string;
    boardSize: TicTacToeBoardSize;
    turnTime: number;
    myInfo: TicTacToePlayerInfo;
    opponentInfo: TicTacToePlayerInfo;
    drawCount: number;
    firstTurn: PlayerTurn;
    currentTurn: PlayerTurn;
    winner: PlayerTurn | null;
    isDraw: boolean;
    matchStatus: MatchStatus;
}
