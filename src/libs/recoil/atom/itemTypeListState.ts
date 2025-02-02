import {ItemType} from "@/helpers/shared/interfaces/commonInterface";
import {atom} from "recoil";

export default atom<ItemType[]>({
    key: "itemTypeListState",
    default: [],
});
