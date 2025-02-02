import {
    LoginDataResponse,
    LoginPayload,
    RegisterPayload,
    UserInfoDateResponse,
} from "@/helpers/shared/interfaces/apiInterface";
import requestHandler from "@/libs/axios/requestHandler";

export default class AuthService {
    private static path = "/auth";

    static async login(payload: LoginPayload) {
        return requestHandler<LoginDataResponse>({url: this.path + "/login", method: "POST", data: {...payload}});
    }

    static async register(payload: RegisterPayload) {
        return requestHandler({url: this.path + "/register", method: "POST", data: {...payload}});
    }

    static async logout() {
        return requestHandler({url: this.path + "/logout", method: "POST"});
    }

    static async getUserInfo() {
        return requestHandler<UserInfoDateResponse>({url: this.path + "/user"});
    }
}
