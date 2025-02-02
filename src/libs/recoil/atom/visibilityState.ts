import {atom} from "recoil";

export type ElementAvailable = "settingModal" | "historyModal" | "statisticsModal" | "sidebar" | "dropdown"; // Các component có thể ẩn/hiện.
type ShowState = Record<ElementAvailable, boolean>;

export default atom<ShowState>({
    key: "visibilityState",
    default: {
        settingModal: false,
        historyModal: false,
        statisticsModal: false,
        sidebar: false,
        dropdown: false,
    },
});
