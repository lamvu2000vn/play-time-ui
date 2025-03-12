import {BaseMatchInfo, MatchInfo} from "@/helpers/shared/interfaces/commonInterface";
import {TicTacToeDetails, TicTacToeGameSetup} from "@/helpers/shared/interfaces/games/ticTacToeInterfaces";
import {TicTacToeMatchInfo} from "@/helpers/shared/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearRoomInfo} from "../roomInfo/roomInfoSlice";

const initialState = null as TicTacToeMatchInfo | null;

const ticTacToeMatchInfoSlice = createSlice({
    name: "ticTacToeMatchInfo",
    initialState,
    reducers: {
        setTicTacToeMatchInfo: (
            _,
            action: PayloadAction<{matchInfo: MatchInfo; baseMatchInfo: BaseMatchInfo}>
        ): TicTacToeMatchInfo => {
            const {matchInfo, baseMatchInfo} = action.payload;
            const {game} = matchInfo;
            const {myInfo, opponentInfo} = baseMatchInfo;
            const details = matchInfo.game.details as TicTacToeDetails;
            const firstTurn = details.firstTurnId === myInfo._id ? "me" : "opponent";

            return {
                gameInfo: game.info,
                gameDetails: details,
                gameSetup: game.gameSetup as TicTacToeGameSetup,
                gameSpecialData: {
                    firstTurn,
                    currentTurn: firstTurn,
                    myType: details.xPlayerId === myInfo._id ? "XPlayer" : "OPlayer",
                    opponentType: details.xPlayerId === opponentInfo._id ? "XPlayer" : "OPlayer",
                },
            };
        },
        changeCurrentTurn: (state) => {
            if (state) {
                const newCurrentTurn = state.gameSpecialData.currentTurn === "me" ? "opponent" : "me";
                state.gameSpecialData.currentTurn = newCurrentTurn;
            }
        },
    },
    selectors: {
        selectTicTacToeMatchInfo: (state) => state,
    },
    extraReducers: (builder) => {
        builder.addCase(clearRoomInfo, () => {
            return initialState;
        });
    },
});

export const {setTicTacToeMatchInfo, changeCurrentTurn} = ticTacToeMatchInfoSlice.actions;
export const {selectTicTacToeMatchInfo} = ticTacToeMatchInfoSlice.selectors;
export const ticTacToeMatchInfoReducer = ticTacToeMatchInfoSlice.reducer;
