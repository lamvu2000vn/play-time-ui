import {RoomInfo} from "@/helpers/shared/interfaces/commonInterface";
import {atom} from "recoil";

export default atom<RoomInfo | null>({
    key: "roomInfoState",
    default: null,
});
