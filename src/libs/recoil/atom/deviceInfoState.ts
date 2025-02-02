import {DeviceInfo} from "@/helpers/shared/interfaces/commonInterface";
import {atom} from "recoil";

export default atom<DeviceInfo | null>({
    key: "deviceInfoState",
    default: null,
});
