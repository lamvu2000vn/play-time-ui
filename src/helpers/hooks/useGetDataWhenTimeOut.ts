import {selectBaseMatchInfo} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import {selectGameName} from "@/libs/redux/features/matchInfo/matchInfoSlice";
import {selectMemoryMatchInfo} from "@/libs/redux/features/memoryMatchInfo/memoryMatchInfoSlice";
import {selectTicTacToeMatchInfo} from "@/libs/redux/features/ticTacToeMatchInfo/ticTacToeMatchInfoSlice";
import {useAppSelector} from "@/libs/redux/hooks";

export default function useGetDataWhenTimeOut() {
    const gameName = useAppSelector(selectGameName)!;
    const baseMatchInfo = useAppSelector(selectBaseMatchInfo);
    const ticTacToeMatchInfo = useAppSelector(selectTicTacToeMatchInfo);
    const memoryMatchInfo = useAppSelector(selectMemoryMatchInfo);
    const {myInfo, opponentInfo} = baseMatchInfo;

    const get = () => {
        switch (gameName) {
            case "Tic Tac Toe": {
                const currentTurnId =
                    ticTacToeMatchInfo!.gameSpecialData.currentTurn === "me" ? myInfo._id : opponentInfo._id;

                return {
                    gameName,
                    data: {
                        currentTurnId,
                    },
                };
            }
            case "Memory": {
                return {
                    gameName,
                    data: {
                        playerId: memoryMatchInfo!.gameSpecialData.currentTurn === "me" ? myInfo._id : opponentInfo._id,
                        numOfMyCards: memoryMatchInfo!.gameSpecialData.numOfMyCards,
                        numOfOpponentCards: memoryMatchInfo!.gameSpecialData.numOfOpponentCards,
                    },
                };
            }
            case "15 Puzzle":
            default:
                return {
                    gameName,
                    data: {},
                };
        }
    };

    return get;
}
