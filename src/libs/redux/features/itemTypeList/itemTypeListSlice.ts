import {ItemType} from "@/helpers/shared/interfaces/commonInterface";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {logout} from "../auth/authSlice";

const initialState = [] as ItemType[];

const itemTypeListSlice = createSlice({
    name: "itemTypeList",
    initialState,
    reducers: {
        setItemTypeList: (_, action: PayloadAction<ItemType[]>) => {
            return action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logout, () => {
            return [];
        });
    },
});

export const {setItemTypeList} = itemTypeListSlice.actions;
export const itemTypeListReducer = itemTypeListSlice.reducer;
