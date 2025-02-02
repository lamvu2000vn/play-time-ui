import {MatchStatus, Position, WaitingRoomType, GameAvailable, TicTacToeBoardMatrix} from "../types";
import {PlayerMatchStatistics, UserInfo} from "./commonInterface";

export interface JoinRoomPayload {
    roomId: string;
    userId: string;
    availWidth: number;
}

export interface LeaveRoomPayload {
    roomId: string;
    leaverId: string;
}

export interface TicTacToePlayerMovePayload {
    roomId: string;
    playerId: string;
    position: Position;
    playerMoves: Position[];
    newBoardMatrix: TicTacToeBoardMatrix;
}

export interface WSResponse<D> {
    status: "ok" | "not ok";
    message: string;
    data: D;
}

export interface TicTacToeMatchResults {
    results: "win" | "draw" | null;
    moves: Position[];
}

export interface TicTacToePlayerMovedData {
    playerId: string;
    position: Position;
    matchResults: TicTacToeMatchResults;
    matchStatistics: MatchStatistics | null;
    newBoardMatrix: TicTacToeBoardMatrix;
}

export interface CreateRoomData {
    _id: string;
    hostId: string;
    joinerId: string;
    gameId: string;
    gameSetup: string;
    type: WaitingRoomType;
    matchStatus: MatchStatus | null;
}

export interface MatchStatistics {
    [key: string]: PlayerMatchStatistics;
}

export interface OpponentLeavedMatchPayload {
    leaverId: string;
    matchStatistics: MatchStatistics | null;
}

export interface RequestPlayAgainPayload {
    requesterId: string;
    roomId: string;
}

export interface WantToPlayAgainPayload {
    requester: UserInfo;
}

export interface AcceptPlayAgainRequestPayload {
    requesterId: string;
    requesteeId: string;
    roomId: string;
}

export interface RejectPlayAgainRequestPayload {
    rejecterId: string;
    requesterId: string;
    roomId: string;
}

export interface DataWhenTimeOut {
    gameName: GameAvailable;
    data: {
        currentTurnId?: string;
        playerId?: string;
        numOfMyCards?: number;
        numOfOpponentCards?: number;
    };
}
