import {GameInfo} from "@/helpers/shared/interfaces/commonInterface";
import {atom} from "recoil";

export default atom<Array<GameInfo>>({
    key: "gameListState",
    default: [],
});
