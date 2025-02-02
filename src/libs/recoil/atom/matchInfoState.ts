import {MatchInfo} from "@/helpers/shared/interfaces/commonInterface";
import {atom} from "recoil";

export default atom<MatchInfo | null>({
    key: "matchInfoState",
    default: null,
});
