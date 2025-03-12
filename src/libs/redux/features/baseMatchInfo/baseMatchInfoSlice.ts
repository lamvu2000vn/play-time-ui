import {BaseMatchInfo, MatchInfo, PlayerMatchStatistics, UserInfo} from "@/helpers/shared/interfaces/commonInterface";
import {PlayerTurn} from "@/helpers/shared/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearRoomInfo} from "../roomInfo/roomInfoSlice";

const initialState = {
    roomId: "",
    myInfo: {
        _id: "",
        avatarUrl: "",
        name: "",
        score: 0,
    },
    opponentInfo: {
        _id: "",
        avatarUrl: "",
        name: "",
        score: 0,
    },
    isDraw: false,
    matchStatus: "completed",
    isLeaved: false,
    myMatchStatistics: null,
    winner: null,
} as BaseMatchInfo;

const baseMatchInfoSlice = createSlice({
    name: "baseMatchInfo",
    initialState,
    reducers: {
        setBaseMatchInfo: (_, action: PayloadAction<BaseMatchInfo>) => {
            return action.payload;
        },
        initialBaseMatchInfo: (_, action: PayloadAction<{matchInfo: MatchInfo; user: UserInfo}>) => {
            const {matchInfo, user} = action.payload;
            const {hostInfo, joinerInfo, roomId} = matchInfo;
            const hostId = hostInfo._id;
            const isHost = hostId === user._id;

            return {
                roomId: roomId,
                myInfo: isHost ? hostInfo : joinerInfo,
                opponentInfo: isHost ? joinerInfo : hostInfo,
                winner: null,
                isDraw: false,
                matchStatus: "progressing",
                myMatchStatistics: null,
                isLeaved: false,
            };
        },
        finishTheMatch: (
            state,
            action: PayloadAction<{
                winnerId?: string;
                myMatchStatistics: PlayerMatchStatistics | null;
                isLeaved?: boolean;
            }>
        ) => {
            const {winnerId, myMatchStatistics, isLeaved} = action.payload;

            if (winnerId) {
                const winner = (winnerId === state.myInfo._id ? "me" : "opponent") as PlayerTurn;
                state.winner = winner;
            } else {
                state.isDraw = true;
            }

            state.myMatchStatistics = myMatchStatistics;
            state.matchStatus = "completed";
            state.isLeaved = isLeaved || false;
        },
    },
    selectors: {
        selectBaseMatchInfo: (state) => state,
        selectPlayerMatchStatistics: (state) => state.myMatchStatistics,
    },
    extraReducers: (builder) => {
        builder.addCase(clearRoomInfo, () => {
            return initialState;
        });
    },
});

export const {setBaseMatchInfo, initialBaseMatchInfo, finishTheMatch} = baseMatchInfoSlice.actions;
export const {selectBaseMatchInfo, selectPlayerMatchStatistics} = baseMatchInfoSlice.selectors;
export const baseMatchInfoReducer = baseMatchInfoSlice.reducer;
