import {Item, ItemType} from "@/helpers/shared/interfaces/commonInterface";
import requestHandler from "@/libs/axios/requestHandler";

export default class ItemTypeService {
    private static path = "/item-type";

    static async getAll() {
        return requestHandler<ItemType[]>({url: this.path + "/get-all"});
    }

    static async getAllItems(typeId: string) {
        return requestHandler<Item[]>({url: `${this.path}/${typeId}/item/get-all`});
    }
}
