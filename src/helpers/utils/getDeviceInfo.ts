import {DeviceInfo} from "../shared/interfaces/commonInterface";
import {Theme} from "../shared/types";
import LocalStorage from "./LocalStorage";

export const getDeviceInfo = (): DeviceInfo => ({
    userAgent: navigator.userAgent,
    language: navigator.language,
    theme: (LocalStorage.getTheme() as Theme) || "myLightTheme",
    backgroundMusicVolume: 0,
    systemSoundVolume: 0,
    screen: {
        width: window.screen.width,
        height: window.screen.height,
        availWidth: document.body.clientWidth,
        availHeight: document.body.clientHeight,
    },
});
