import {UserHistoryDataResponse} from "@/helpers/shared/interfaces/apiInterface";
import {GameStatistics, PaidItem} from "@/helpers/shared/interfaces/commonInterface";
import requestHandler from "@/libs/axios/requestHandler";

export default class UserService {
    private static path = "/user";

    static async getPaidItems(userId: string, typeId: string) {
        return requestHandler<PaidItem[]>({url: `${this.path}/${userId}/paid-items`, params: {typeId}});
    }

    static async getGameStatistics(userId: string, gameId: string) {
        return requestHandler<GameStatistics>({url: `${this.path}/${userId}/game/${gameId}/statistics`});
    }

    static async getAllGameStatistics(userId: string) {
        return requestHandler<GameStatistics[]>({url: `${this.path}/${userId}/game/statistics`});
    }

    static async getHistory(userId: string, gameId: string, params: {page: number; limit: number}) {
        return requestHandler<UserHistoryDataResponse>({
            url: `${this.path}/${userId}/game/${gameId}/history`,
            params,
        });
    }
}
