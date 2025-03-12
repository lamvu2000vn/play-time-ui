import LeftPlayerInfo from "./LeftPlayerInfo";
import RightPlayerInfo from "./RightPlayerInfo";
import WinnerNotification from "./WinnerNotification";
import DrawNotification from "./DrawNotification";
import Timer from "./Timer";
import {useAppSelector} from "@/libs/redux/hooks";
import {selectBaseMatchInfo} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import {selectTicTacToeMatchInfo} from "@/libs/redux/features/ticTacToeMatchInfo/ticTacToeMatchInfoSlice";
import {selectMemoryMatchInfo} from "@/libs/redux/features/memoryMatchInfo/memoryMatchInfoSlice";
import {selectSeconds} from "@/libs/redux/features/inMatchData/inMatchDataSlice";
import {useEffect, useState} from "react";

export default function Header() {
    const seconds = useAppSelector(selectSeconds);
    const ticTacToeMatchInfo = useAppSelector(selectTicTacToeMatchInfo);
    const memoryMatchInfo = useAppSelector(selectMemoryMatchInfo);
    const baseMatchInfo = useAppSelector(selectBaseMatchInfo)!;

    const [playerTurn, setPlayerTurn] = useState<{isMyTurn: boolean; isOpponentTurn: boolean}>({
        isMyTurn: true,
        isOpponentTurn: true,
    });

    const {myInfo, opponentInfo, winner, isDraw} = baseMatchInfo;

    useEffect(() => {
        setPlayerTurn(() => {
            if (ticTacToeMatchInfo) {
                const {currentTurn} = ticTacToeMatchInfo.gameSpecialData;

                return {
                    isMyTurn: currentTurn === "me",
                    isOpponentTurn: currentTurn === "opponent",
                };
            }

            if (memoryMatchInfo) {
                const {currentTurn} = memoryMatchInfo.gameSpecialData;

                return {
                    isMyTurn: currentTurn === "me",
                    isOpponentTurn: currentTurn === "opponent",
                };
            }

            return {
                isMyTurn: true,
                isOpponentTurn: true,
            };
        });
    }, [memoryMatchInfo, ticTacToeMatchInfo]);

    return (
        <div className="relative w-full h-full bg-base-100 flex items-stretch">
            {winner ? (
                <WinnerNotification winner={winner} />
            ) : isDraw ? (
                <DrawNotification />
            ) : (
                <>
                    <LeftPlayerInfo playerInfo={myInfo} isPlayerTurn={playerTurn.isMyTurn} />
                    <Timer seconds={seconds} />
                    <RightPlayerInfo playerInfo={opponentInfo} isPlayerTurn={playerTurn.isOpponentTurn} />
                </>
            )}
        </div>
    );
}
