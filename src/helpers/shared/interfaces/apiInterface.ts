import {GameInfo, GameRanking, History, UserInfo} from "./commonInterface";

export interface LoginPayload {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface RegisterPayload {
    username: string;
    password: string;
    name: string;
}

export interface ApiResponse<D> {
    status: number;
    message: string;
    data: D;
}

export interface LoginDataResponse {
    accessToken: string;
    user: UserInfo;
}

export interface RefreshTokenDataResponse {
    accessToken: string;
}

export interface UserInfoDateResponse {
    user: UserInfo;
}

export interface UserHistoryDataResponse {
    history: History[];
    currentPage: number;
    limit: number;
    totalPages: number;
    totalDocs: number;
}

export interface GameRankingDataResponse {
    gameInfo: GameInfo;
    ranking: GameRanking[];
}
