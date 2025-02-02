import {ChatType, GameAvailable, MatchStatus, PlayerTurn, Theme, WaitingRoomType} from "../types";

export interface HTMLElementOtherProps {
    "data-trigger-popup"?: string;
    "data-popup-element"?: string;
    "data-popup-id"?: string;
}

export interface HTMLElementPosition {
    left: number | null;
    top: number | null;
    right: number | null;
    bottom: number | null;
}

export interface DeviceInfo {
    userAgent: string;
    language: string;
    theme: Theme;
    backgroundMusicVolume: number;
    systemSoundVolume: number;
    screen: {
        width: number;
        height: number;
        availWidth: number;
        availHeight: number;
    };
}

export interface PlayerInfo {
    _id: string;
    name: string;
    avatarUrl: string;
    score: number;
}

export interface UserInfo {
    _id: string;
    name: string;
    avatarUrl: string;
    socketId: string | null;
    coin: number;
}

export interface Auth {
    isAuthenticated: boolean;
    user: UserInfo | null;
}

export interface GameInfo {
    _id: string;
    name: GameAvailable;
    alternativeName: string;
    imageUrl: string;
}

export interface GameRanking {
    user: UserInfo;
    totalScore: number;
    numOfWin: number;
    numOfLose: number;
    numOfDraw: number;
}

export interface TransitionStyles {
    entering: React.CSSProperties;
    entered: React.CSSProperties;
    exiting: React.CSSProperties;
    exited: React.CSSProperties;
    unmounted: React.CSSProperties;
}

export interface ItemType {
    _id: string;
    name: string;
    alternativeName: string;
    imageUrl: string;
}

export interface Item {
    _id: string;
    typeId: string;
    name: string;
    imageUrl: string;
    price: number;
}

export interface PaidItem {
    _id: string;
    userId: string;
    itemId: Item & {
        typeId: ItemType;
    };
}

export interface ChatContent {
    sender: UserInfo;
    type: ChatType;
    content: string;
}

export interface CreateNewRoom<G> {
    hostId: string;
    gameId: string;
    gameSetup: G;
    type: WaitingRoomType;
}

export interface RoomInfo {
    roomId: string;
    hostId: string;
    joinerId: string;
    gameId: string;
    gameSetup: string;
    type: WaitingRoomType;
    matchStatus: MatchStatus | null;
}

export interface MatchInfo<Details = object, GameSetup = object> {
    roomId: string;
    game: {
        info: GameInfo;
        details: Details;
        gameSetup: GameSetup;
    };
    hostInfo: PlayerInfo;
    joinerInfo: PlayerInfo;
}

export interface BaseMatchInfo {
    roomId: string;
    myInfo: PlayerInfo;
    opponentInfo: PlayerInfo;
    winner: PlayerTurn | null;
    isDraw: boolean;
    matchStatus: MatchStatus;
}

export interface MyMatchInfo<GameSetup, Details, Data> extends BaseMatchInfo {
    game: {
        info: GameInfo;
        gameSetup: GameSetup;
        details: Details;
        specialData: Data;
    };
}

export interface ScoreStatistics {
    currentLevel: number;
    scoreForNextLevel: number;
    scoreNeededToNextLevel: number;
}

export interface GameStatistics {
    gameInfo: GameInfo;
    totalScore: number;
    numOfWin: number;
    numOfLose: number;
    numOfDraw: number;
    scoreStatistics: ScoreStatistics;
}

export interface PlayerMatchStatistics {
    gameStatistics: GameStatistics;
    newCoin: number;
}

export interface Modal {
    show: boolean;
    onClose: () => void;
}

export interface History {
    _id: string;
    gameId: string;
    player1Id: UserInfo;
    player2Id: UserInfo;
    roomId: string;
    player1Score: number;
    player2Score: number;
    drawCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface TransformedHistory {
    _id: string;
    gameId: string;
    myInfo: UserInfo;
    opponentInfo: UserInfo;
    roomId: string;
    myScore: number;
    opponentScore: number;
    drawCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface GameContext {
    gameName: GameAvailable | "";
    stopTheMatch: boolean;
    messages: ChatContent[];
    seconds: number;
    onSetMyMatchStatistics: (matchStatistics: PlayerMatchStatistics) => void;
}
