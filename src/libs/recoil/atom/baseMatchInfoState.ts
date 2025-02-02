import {BaseMatchInfo} from "@/helpers/shared/interfaces/commonInterface";
import {atom} from "recoil";

export default atom<BaseMatchInfo | null>({
    key: "baseMatchInfoState",
    default: null,
});
