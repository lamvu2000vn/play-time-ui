import {RoomInfo} from "@/helpers/shared/interfaces/commonInterface";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = null as RoomInfo | null;

const roomInfoSlice = createSlice({
    name: "roomInfo",
    initialState,
    reducers: {
        setRoomInfo: (_, action: PayloadAction<RoomInfo>) => {
            return action.payload;
        },
        clearRoomInfo: () => {
            return initialState;
        },
    },
    selectors: {
        selectRoomInfo: (state) => state,
    },
});

export const {setRoomInfo, clearRoomInfo} = roomInfoSlice.actions;
export const {selectRoomInfo} = roomInfoSlice.selectors;
export const roomInfoReducer = roomInfoSlice.reducer;
