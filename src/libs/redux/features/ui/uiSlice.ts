import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {logout} from "../auth/authSlice";

export type ElementAvailable =
    | "settingModal"
    | "historyModal"
    | "statisticsModal"
    | "sidebar"
    | "dropdown"
    | "gameSetupModal"
    | "lookingForGameModal"
    | "requireLargerScreenModal";
type ElementShowState = Record<ElementAvailable, boolean>;

interface UI {
    game: {
        gameId: string;
    };
    elementVisibility: ElementShowState;
}

const initialState: UI = {
    game: {
        gameId: "",
    },
    elementVisibility: {
        settingModal: false,
        historyModal: false,
        statisticsModal: false,
        sidebar: false,
        dropdown: false,
        gameSetupModal: false,
        lookingForGameModal: false,
        requireLargerScreenModal: false,
    },
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setGameId: (state, action: PayloadAction<{gameId: string}>) => {
            state.game.gameId = action.payload.gameId;
        },
        setVisibility: (state, action: PayloadAction<{element: ElementAvailable; showState: boolean}>) => {
            const {element, showState} = action.payload;

            state.elementVisibility[element] = showState;
        },
    },
    selectors: {
        selectElementVisibility: (state) => state.elementVisibility,
        selectGameId: (state) => state.game.gameId,
    },
    extraReducers: (builder) => {
        builder.addCase(logout, () => {
            return initialState;
        });
    },
});

export const {setGameId, setVisibility} = uiSlice.actions;
export const {selectElementVisibility, selectGameId} = uiSlice.selectors;
export const uiReducer = uiSlice.reducer;
