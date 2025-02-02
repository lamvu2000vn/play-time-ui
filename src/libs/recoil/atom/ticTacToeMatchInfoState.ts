import {TicTacToeMatchInfo} from "@/helpers/shared/types";
import {atom} from "recoil";

export default atom<TicTacToeMatchInfo | null>({
    key: "ticTacToeMatchInfo",
    default: null,
});
