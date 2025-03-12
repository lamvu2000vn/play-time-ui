import {localesAvailable} from "@/helpers/shared/data";
import {DeviceInfo} from "@/helpers/shared/interfaces/commonInterface";
import {BackgroundImageAvailable, DeviceType, Locales, Theme} from "@/helpers/shared/types";
import LocalStorage from "./LocalStorage";

export default class DeviceManager {
    private static getWebLanguage = (): Locales => {
        const language = navigator.language.slice(0, 2).toLowerCase();

        return localesAvailable.find((locale) => locale === language) || "en";
    };

    private static getDeviceType = (): DeviceType => {
        const userAgent = navigator.userAgent.toLowerCase();

        if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(userAgent)) {
            return "Mobile";
        } else if (/tablet|ipad/.test(userAgent)) {
            return "Tablet";
        } else {
            return "Desktop";
        }
    };

    static getDeviceInfo = (): DeviceInfo => {
        return {
            userAgent: navigator.userAgent,
            type: this.getDeviceType(),
            language: this.getWebLanguage(),
            theme: (LocalStorage.getTheme() as Theme) || "light",
            backgroundImage: (LocalStorage.getBackgroundImage() as BackgroundImageAvailable) || "background-1.png",
            volume: {
                backgroundMusicVolume: 0,
                systemSoundVolume: 0,
            },
            screen: {
                width: window.screen.width,
                height: window.screen.height,
                availWidth: document.body.clientWidth,
                availHeight: document.body.clientHeight,
            },
        };
    };
}
