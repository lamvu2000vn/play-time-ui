import {MemoryCardFlipStatus, PlayerTurn} from "../../types";
import {MatchStatistics} from "../wsInterface";

export interface MemoryCard {
    id: string;
    imageUrl: string;
}

export interface MemoryGameSetup {
    theme: "fruit" | "animal";
    numOfCards: number;
    matchTime: number;
}

export interface MemoryDetails {
    cards: MemoryCard[];
    firstTurnId: string;
}

export interface MemorySpecialData {
    cardStates: MemoryCardState[];
    currentTurn: PlayerTurn;
    numOfMyCards: number;
    numOfOpponentCards: number;
}

export interface MemoryCardState {
    card: MemoryCard;
    hidden: boolean;
    flipStatus: MemoryCardFlipStatus;
}

export interface MemoryContext {
    playFlipCardSound: () => void;
    playCollectCardSound: () => void;
}

export interface MemoryFlipCardUpPayload {
    roomId: string;
    playerId: string;
    cardStateIndex: number;
}

export interface MemoryFinishTheMatchPayload {
    roomId: string;
    playerId: string;
    numOfMyCards: number;
    numOfOpponentCards: number;
}

export interface MemoryMatchResultsPayload {
    winnerId: string | undefined;
    matchStatistics: MatchStatistics;
}
