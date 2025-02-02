import {GameRankingDataResponse} from "@/helpers/shared/interfaces/apiInterface";
import {GameInfo} from "@/helpers/shared/interfaces/commonInterface";
import requestHandler from "@/libs/axios/requestHandler";

export default class GameService {
    private static path = "/game";

    static async getAll() {
        return requestHandler<GameInfo[]>({url: this.path + "/get-all"});
    }

    static async getGameByName(name: string) {
        return requestHandler<GameInfo>({url: this.path + "/get-info", params: {name}});
    }

    static async getRanking(gameId: string) {
        return requestHandler<GameRankingDataResponse>({url: `${this.path}/${gameId}/ranking`});
    }
}
