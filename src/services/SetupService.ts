import {DeviceInfo} from "@/helpers/shared/interfaces/commonInterface";
import {DeviceManager} from "@/helpers/utils/classes";
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
            const deviceInfo = DeviceManager.getDeviceInfo();
            return {status: true, data: deviceInfo};
        } catch (err) {
            console.log("🚀 ~ SetupService ~ err:", err);

            return {status: false, data: null};
        }
    };
}
