import {BaseMatchInfo, MatchInfo} from "@/helpers/shared/interfaces/commonInterface";
import {MemoryDetails, MemoryGameSetup} from "@/helpers/shared/interfaces/games/memoryInterfaces";
import {MemoryMatchInfo} from "@/helpers/shared/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearRoomInfo} from "../roomInfo/roomInfoSlice";

const initialState = null as MemoryMatchInfo | null;

const memoryMatchInfoSlice = createSlice({
    name: "memoryMatchInfo",
    initialState,
    reducers: {
        setMemoryMatchInfo: (
            _,
            action: PayloadAction<{matchInfo: MatchInfo; baseMatchInfo: BaseMatchInfo}>
        ): MemoryMatchInfo => {
            const {matchInfo, baseMatchInfo} = action.payload;
            const {game} = matchInfo;
            const {myInfo} = baseMatchInfo;
            const details = game.details as MemoryDetails;
            const {cards, firstTurnId} = details;

            return {
                gameInfo: game.info,
                gameDetails: details,
                gameSetup: game.gameSetup as MemoryGameSetup,
                gameSpecialData: {
                    cardStates: cards.map((card) => ({
                        card,
                        flipStatus: "none",
                        hidden: false,
                    })),
                    currentTurn: myInfo._id === firstTurnId ? "me" : "opponent",
                    numOfMyCards: 0,
                    numOfOpponentCards: 0,
                },
            };
        },
        changeCurrentTurn: (state) => {
            if (state) {
                const newTurn = state.gameSpecialData.currentTurn === "me" ? "opponent" : "me";
                state.gameSpecialData.currentTurn = newTurn;
            }
        },
        increaseNumOfCardsOwned: (state) => {
            if (state) {
                const currentTurn = state.gameSpecialData.currentTurn;

                if (currentTurn === "me") {
                    state.gameSpecialData.numOfMyCards++;
                } else if (currentTurn === "opponent") {
                    state.gameSpecialData.numOfOpponentCards++;
                }
            }
        },
    },
    selectors: {
        selectMemoryMatchInfo: (state) => state,
    },
    extraReducers: (builder) => {
        builder.addCase(clearRoomInfo, () => {
            return initialState;
        });
    },
});

export const {setMemoryMatchInfo, changeCurrentTurn, increaseNumOfCardsOwned} = memoryMatchInfoSlice.actions;
export const {selectMemoryMatchInfo} = memoryMatchInfoSlice.selectors;
export const memoryMatchInfoReducer = memoryMatchInfoSlice.reducer;
