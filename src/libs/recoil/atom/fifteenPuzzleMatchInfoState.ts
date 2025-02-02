import {FifteenPuzzleMatchInfo} from "@/helpers/shared/types";
import {atom} from "recoil";

export default atom<FifteenPuzzleMatchInfo | null>({
    key: "fifteenPuzzleMatchInfoState",
    default: null,
});
