import {ChatContent} from "@/helpers/shared/interfaces/commonInterface";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type GameShowingScreen =
    | "loadingScreen"
    | "errorScreen"
    | "preparingRoomScreen"
    | "startTheGameScreen"
    | "matchCompletedScreen"
    | "waitingRoomScreen"
    | "joinRoomScreen";

interface InMatchData {
    screenShowing: GameShowingScreen;
    isStopTheMatch: boolean;
    messages: ChatContent[];
    seconds: number;
    error: string;
}

const initialState = {
    screenShowing: "loadingScreen",
    isStopTheMatch: false,
    messages: [],
    seconds: 0,
    error: "",
} as InMatchData;

const inMatchDataSlice = createSlice({
    name: "inMatchData",
    initialState,
    reducers: {
        changeShowingScreen: (state, action: PayloadAction<{screen: GameShowingScreen}>) => {
            state.screenShowing = action.payload.screen;
        },
        setStopTheMatch: (state, action: PayloadAction<{state: boolean}>) => {
            state.isStopTheMatch = action.payload.state;
        },
        pushMessage: (state, action: PayloadAction<{message: ChatContent}>) => {
            state.messages.push(action.payload.message);
        },
        clearMessage: (state) => {
            state.messages = [];
        },
        setSeconds: (state, action: PayloadAction<{seconds: number}>) => {
            state.seconds = action.payload.seconds;
        },
        setGameError: (state, action: PayloadAction<{error: string}>) => {
            state.error = action.payload.error;
        },
    },
    selectors: {
        selectShowingScreen: (state) => state.screenShowing,
        selectStopTheMatchState: (state) => state.isStopTheMatch,
        selectMessages: (state) => state.messages,
        selectSeconds: (state) => state.seconds,
        selectError: (state) => state.error,
    },
});

export const {changeShowingScreen, setStopTheMatch, pushMessage, clearMessage, setSeconds, setGameError} =
    inMatchDataSlice.actions;
export const {selectShowingScreen, selectStopTheMatchState, selectMessages, selectSeconds, selectError} =
    inMatchDataSlice.selectors;
export const inMatchDataReducer = inMatchDataSlice.reducer;
