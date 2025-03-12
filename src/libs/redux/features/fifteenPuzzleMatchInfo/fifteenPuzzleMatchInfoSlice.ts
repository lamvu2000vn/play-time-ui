import {BaseMatchInfo, MatchInfo} from "@/helpers/shared/interfaces/commonInterface";
import {FifteenPuzzleDetail, FifteenPuzzleGameSetup} from "@/helpers/shared/interfaces/games/fifteenPuzzleInterfaces";
import {FifteenPuzzleMatchInfo} from "@/helpers/shared/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearRoomInfo} from "../roomInfo/roomInfoSlice";

const initialState = null as FifteenPuzzleMatchInfo | null;

const fifteenPuzzleMatchInfoSlice = createSlice({
    name: "fifteenPuzzleMatchInfo",
    initialState,
    reducers: {
        setFifteenPuzzleMatchInfo: (
            _,
            action: PayloadAction<{matchInfo: MatchInfo; baseMatchInfo: BaseMatchInfo}>
        ): FifteenPuzzleMatchInfo => {
            const {matchInfo, baseMatchInfo} = action.payload;
            const {game, hostInfo} = matchInfo;
            const {myInfo, opponentInfo} = baseMatchInfo;
            const details = game.details as FifteenPuzzleDetail;
            const {hostBoardMatrix, joinerBoardMatrix} = details;

            return {
                gameInfo: game.info,
                gameDetails: details,
                gameSetup: game.gameSetup as FifteenPuzzleGameSetup,
                gameSpecialData: {
                    myBoardMatrix: myInfo._id === hostInfo._id ? hostBoardMatrix : joinerBoardMatrix,
                    opponentBoardMatrix: opponentInfo._id === hostInfo._id ? hostBoardMatrix : joinerBoardMatrix,
                },
            };
        },
    },
    selectors: {
        selectFifteenPuzzleMatchInfo: (state) => state,
    },
    extraReducers: (builder) => {
        builder.addCase(clearRoomInfo, () => {
            return initialState;
        });
    },
});

export const {setFifteenPuzzleMatchInfo} = fifteenPuzzleMatchInfoSlice.actions;
export const {selectFifteenPuzzleMatchInfo} = fifteenPuzzleMatchInfoSlice.selectors;
export const fifteenPuzzleMatchInfoReducer = fifteenPuzzleMatchInfoSlice.reducer;
