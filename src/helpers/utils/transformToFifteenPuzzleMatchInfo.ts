import {BaseMatchInfo} from "./../shared/interfaces/commonInterface";
import {MatchInfo} from "../shared/interfaces/commonInterface";
import {FifteenPuzzleDetail, FifteenPuzzleGameSetup} from "../shared/interfaces/games/fifteenPuzzleInterfaces";
import {FifteenPuzzleMatchInfo} from "../shared/types";

export const transformToFifteenPuzzleMatchInfo = (
    matchInfo: MatchInfo<FifteenPuzzleDetail, FifteenPuzzleGameSetup>,
    BaseMatchInfo: BaseMatchInfo
): FifteenPuzzleMatchInfo => {
    const {myInfo, opponentInfo} = BaseMatchInfo;
    const {hostInfo, game} = matchInfo;
    const {details} = game;
    const {hostBoardMatrix, joinerBoardMatrix} = details;

    return {
        game: {
            info: matchInfo.game.info,
            gameSetup: matchInfo.game.gameSetup,
            details,
            specialData: {
                myBoardMatrix: myInfo._id === hostInfo._id ? hostBoardMatrix : joinerBoardMatrix,
                opponentBoardMatrix: opponentInfo._id === hostInfo._id ? hostBoardMatrix : joinerBoardMatrix,
            },
        },
        ...BaseMatchInfo,
    };
};
