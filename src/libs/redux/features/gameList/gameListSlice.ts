import {GameInfo} from "@/helpers/shared/interfaces/commonInterface";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../store";
import {logout} from "../auth/authSlice";

const initialState = [] as GameInfo[];

const gameListSlice = createSlice({
    name: "gameList",
    initialState,
    reducers: {
        setGameList: (_, action: PayloadAction<GameInfo[]>) => {
            return action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logout, () => {
            return [];
        });
    },
});

export const {setGameList} = gameListSlice.actions;

export const selectGameList = (state: RootState) => state.gameList;
export const selectGameInfoById = (gameId?: string) => (state: RootState) =>
    state.gameList.find((gameInfo) => gameInfo._id === gameId);
export const selectGameInfoByName = (gameName?: string) => (state: RootState) =>
    state.gameList.find((gameInfo) => gameInfo.alternativeName === gameName);

export const gameListReducer = gameListSlice.reducer;
