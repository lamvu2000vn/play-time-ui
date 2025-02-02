import {BackgroundImageAvailable} from "@/helpers/shared/types";
import {atom} from "recoil";

export default atom<BackgroundImageAvailable>({
    key: "backgroundImageState",
    default: "background-1.png",
});
