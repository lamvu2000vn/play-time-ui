import {GameStatistics} from "@/helpers/shared/interfaces/commonInterface";
import {atom} from "recoil";

export default atom<GameStatistics[]>({
    key: "gameStatistics",
    default: [],
});
