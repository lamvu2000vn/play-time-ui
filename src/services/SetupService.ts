import {DeviceInfo} from "@/helpers/shared/interfaces/commonInterface";
import {getDeviceInfo} from "@/helpers/utils/getDeviceInfo";
import {webSocketConnect} from "@/libs/socket.io/webSocketConnect";

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
}
