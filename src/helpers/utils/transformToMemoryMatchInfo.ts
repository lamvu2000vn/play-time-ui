import {BaseMatchInfo} from "./../shared/interfaces/commonInterface";
import {MatchInfo} from "../shared/interfaces/commonInterface";
import {MemoryMatchInfo} from "../shared/types";
import {MemoryDetails, MemoryGameSetup} from "../shared/interfaces/games/memoryInterfaces";

export const transformToMemoryMatchInfo = (
    matchInfo: MatchInfo<MemoryDetails, MemoryGameSetup>,
    BaseMatchInfo: BaseMatchInfo
): MemoryMatchInfo => {
    const {myInfo} = BaseMatchInfo;
    const {game} = matchInfo;
    const {details} = game;
    const {cards, firstTurnId} = details;

    return {
        game: {
            info: matchInfo.game.info,
            gameSetup: matchInfo.game.gameSetup,
            details,
            specialData: {
                cardStates: cards.map((card) => ({
                    card,
                    flipStatus: "none",
                    hidden: false,
                })),
                currentTurn: myInfo._id === firstTurnId ? "me" : "opponent",
                numOfMyCards: 0,
                numOfOpponentCards: 0,
            },
        },
        ...BaseMatchInfo,
    };
};
