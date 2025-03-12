import {MatchInfo} from "@/helpers/shared/interfaces/commonInterface";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearRoomInfo} from "../roomInfo/roomInfoSlice";
import {AppStartListening} from "../../listenerMiddleware";
import {initialBaseMatchInfo} from "../baseMatchInfo/baseMatchInfoSlice";
import {setTicTacToeMatchInfo} from "../ticTacToeMatchInfo/ticTacToeMatchInfoSlice";
import {setFifteenPuzzleMatchInfo} from "../fifteenPuzzleMatchInfo/fifteenPuzzleMatchInfoSlice";
import {setMemoryMatchInfo} from "../memoryMatchInfo/memoryMatchInfoSlice";
import {RootState} from "../../store";
import {setGameId, setVisibility} from "../ui/uiSlice";
import {clearMessage} from "../inMatchData/inMatchDataSlice";

const initialState = {
    roomId: "",
    hostInfo: {
        _id: "",
        name: "",
        avatarUrl: "",
        score: 0,
    },
    joinerInfo: {
        _id: "",
        name: "",
        avatarUrl: "",
        score: 0,
    },
    game: {
        details: {},
        gameSetup: {},
        info: {
            _id: "",
            name: "Tic Tac Toe",
            alternativeName: "",
            imageUrl: "",
        },
    },
} as MatchInfo;

const matchInfoSlice = createSlice({
    name: "MatchInfo",
    initialState,
    reducers: {
        setMatchInfo: (_, action: PayloadAction<MatchInfo>) => {
            return action.payload;
        },
    },
    selectors: {
        selectMatchInfo: (state) => state,
    },
    extraReducers: (builder) => {
        builder.addCase(clearRoomInfo, () => {
            return initialState;
        });
    },
});

export const {setMatchInfo} = matchInfoSlice.actions;
export const selectGameName = (state: RootState) => state.matchInfo?.game.info.name;
export const selectMatchInfo = (state: RootState) => state.matchInfo;

export const setMatchInfoListeners = (startAppListening: AppStartListening) => {
    startAppListening({
        actionCreator: setMatchInfo,
        effect: (action, listenerApi) => {
            const matchInfo = action.payload;
            const user = listenerApi.getState().auth.user;

            if (matchInfo && user) {
                listenerApi.dispatch(initialBaseMatchInfo({matchInfo, user}));
                listenerApi.dispatch(setGameId({gameId: matchInfo.game.info._id}));
                listenerApi.dispatch(setVisibility({element: "gameSetupModal", showState: false}));
                listenerApi.dispatch(clearMessage());

                const baseMatchInfo = listenerApi.getState().baseMatchInfo!;

                switch (matchInfo.game.info.name) {
                    case "Tic Tac Toe": {
                        listenerApi.dispatch(setTicTacToeMatchInfo({matchInfo, baseMatchInfo}));
                        break;
                    }
                    case "15 Puzzle": {
                        listenerApi.dispatch(setFifteenPuzzleMatchInfo({matchInfo, baseMatchInfo}));
                        break;
                    }
                    case "Memory": {
                        listenerApi.dispatch(setMemoryMatchInfo({matchInfo, baseMatchInfo}));
                        break;
                    }
                    default:
                        throw new Error("Invalid game name");
                }
            }
        },
    });
};

export const matchInfoReducer = matchInfoSlice.reducer;
