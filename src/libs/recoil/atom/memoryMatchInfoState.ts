import {MemoryMatchInfo} from "@/helpers/shared/types";
import {atom} from "recoil";

export default atom<MemoryMatchInfo | null>({
    key: "memoryMatchInfoState",
    default: null,
});
