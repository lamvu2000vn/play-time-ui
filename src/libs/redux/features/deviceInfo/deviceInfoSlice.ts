import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DeviceInfo} from "@/helpers/shared/interfaces/commonInterface";
import {RootState} from "../../store";

const initialState: DeviceInfo = {
    userAgent: "",
    type: "Desktop",
    language: "vi",
    theme: "light",
    backgroundImage: "background-1.png",
    volume: {
        backgroundMusicVolume: 0,
        systemSoundVolume: 0,
    },
    screen: {
        width: 0,
        height: 0,
        availWidth: 0,
        availHeight: 0,
    },
};

const deviceInfoSlice = createSlice({
    name: "deviceInfo",
    initialState,
    reducers: {
        setDeviceInfo: (_, action: PayloadAction<DeviceInfo>) => {
            return action.payload;
        },
        updateDeviceInfo: (state, action: PayloadAction<Partial<DeviceInfo>>) => {
            return {...state, ...action.payload};
        },
    },
});

export const {setDeviceInfo, updateDeviceInfo} = deviceInfoSlice.actions;
export const selectDeviceInfo = (state: RootState) => state.deviceInfo;
export const selectDeviceVolume = (state: RootState) => state.deviceInfo.volume;
export const deviceInfoReducer = deviceInfoSlice.reducer;
