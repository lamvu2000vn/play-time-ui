import {RootState} from "./../../store";
import {Auth, GameStatistics, UserInfo} from "@/helpers/shared/interfaces/commonInterface";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Auth = {
    isAuthenticated: false,
    user: {
        _id: "",
        avatarUrl: "",
        name: "",
        coin: 0,
        gameStatistics: [],
        socketId: "",
    },
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{user: UserInfo}>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        logout: () => {
            return initialState;
        },
        updateUserCoin: (state, action: PayloadAction<{coin: number}>) => {
            if (state.user) {
                state.user.coin = action.payload.coin;
            }
        },
        updateUserGameStatistics: (state, action: PayloadAction<{newGameStatistics: GameStatistics}>) => {
            const {newGameStatistics} = action.payload;

            if (state.user) {
                state.user.gameStatistics = state.user.gameStatistics.map((gameStatistics) =>
                    gameStatistics.gameId === newGameStatistics.gameId ? {...newGameStatistics} : gameStatistics
                );
            }
        },
    },
    selectors: {
        selectAuthState: (state) => state.isAuthenticated,
        selectUser: (state) => state.user,
        selectUserCoin: (state) => state.user.coin || 0,
        selectAllGameStatistics: (state) => state.user.gameStatistics ?? [],
    },
});

export const {login, logout, updateUserCoin, updateUserGameStatistics} = authSlice.actions;
export const {selectAuthState, selectUser, selectUserCoin, selectAllGameStatistics} = authSlice.selectors;
export const selectGameStatisticsById = (gameId?: string) => (state: RootState) =>
    state.auth.user.gameStatistics.find((gameStatistics) => gameStatistics.gameId === gameId);
export const selectAuth = (state: RootState) => state.auth;
export const authReducer = authSlice.reducer;
