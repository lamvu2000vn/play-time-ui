import {Auth} from "@/helpers/shared/interfaces/commonInterface";
import {atom} from "recoil";

export default atom<Auth>({
    key: "authState",
    default: {
        isAuthenticated: false,
        user: null,
    },
});
