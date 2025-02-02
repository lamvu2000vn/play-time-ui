import {DeviceInfo, GameInfo, ItemType} from "@/helpers/shared/interfaces/commonInterface";
import {getDeviceInfo} from "@/helpers/utils/getDeviceInfo";
import GameService from "./GameService";
import {webSocketConnect} from "@/libs/socket.io/webSocketConnect";
import ItemTypeService from "./ItemTypeService";

interface SetupResult<D> {
    status: boolean;
    data: D;
}

export default class SetupService {
    static connectWebsocket = async (): Promise<SetupResult<object>> => {
        return (await webSocketConnect()) ? {status: true, data: {}} : {status: false, data: {}};
    };

    static initializeDeviceInfo = async (): Promise<SetupResult<DeviceInfo | null>> => {
        try {
            const deviceInfo = getDeviceInfo();
            return {status: true, data: deviceInfo};
        } catch (err) {
            console.log("🚀 ~ SetupService ~ err:", err);

            return {status: true, data: null};
        }
    };

    static fetchGameList = async (): Promise<SetupResult<GameInfo[] | null>> => {
        const response = await GameService.getAll();

        if (!response || response.status !== 200 || !response.data.length) {
            return {status: false, data: null};
        }

        return {
            status: true,
            data: response.data,
        };
    };

    static fetchItemTypeList = async (): Promise<SetupResult<ItemType[] | null>> => {
        const response = await ItemTypeService.getAll();

        if (!response || response.status !== 200 || !response.data.length) {
            return {status: false, data: null};
        }

        return {
            status: true,
            data: response.data,
        };
    };
}
