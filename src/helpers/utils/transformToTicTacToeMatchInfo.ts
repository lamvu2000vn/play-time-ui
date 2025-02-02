import {BaseMatchInfo, MatchInfo} from "../shared/interfaces/commonInterface";
import {TicTacToeDetails, TicTacToeGameSetup} from "../shared/interfaces/games/ticTacToeInterfaces";
import {TicTacToeMatchInfo} from "../shared/types";

export const transformToTicTacToeMatchInfo = (
    matchInfo: MatchInfo<TicTacToeDetails, TicTacToeGameSetup>,
    baseMatchInfo: BaseMatchInfo
): TicTacToeMatchInfo => {
    const {myInfo, opponentInfo} = baseMatchInfo;
    const details = matchInfo.game.details;
    const firstTurn = details.firstTurnId === myInfo._id ? "me" : "opponent";

    return {
        game: {
            info: matchInfo.game.info,
            details,
            gameSetup: matchInfo.game.gameSetup,
            specialData: {
                firstTurn,
                currentTurn: firstTurn,
                myType: details.xPlayerId === myInfo._id ? "XPlayer" : "OPlayer",
                opponentType: details.xPlayerId === opponentInfo._id ? "XPlayer" : "OPlayer",
            },
        },
        ...baseMatchInfo,
    };
};
