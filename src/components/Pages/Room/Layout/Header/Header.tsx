import {useRecoilValue} from "recoil";
import LeftPlayerInfo from "./LeftPlayerInfo";
import RightPlayerInfo from "./RightPlayerInfo";
import WinnerNotification from "./WinnerNotification";
import DrawNotification from "./DrawNotification";
import {baseMatchInfoState, memoryMatchInfoState, ticTacToeMatchInfoState} from "@/libs/recoil/atom";
import Timer from "./Timer";
import {useContext} from "react";
import {GameContext} from "@/helpers/contexts";

export default function Header() {
    const {seconds} = useContext(GameContext);

    const ticTacToeMatchInfo = useRecoilValue(ticTacToeMatchInfoState);
    const memoryMatchInfo = useRecoilValue(memoryMatchInfoState);
    const baseMatchInfo = useRecoilValue(baseMatchInfoState)!;
    const {myInfo, opponentInfo, winner, isDraw} = baseMatchInfo;

    const currentTurn =
        ticTacToeMatchInfo?.game.specialData.currentTurn || memoryMatchInfo?.game.specialData.currentTurn;

    const isMyTurn = currentTurn ? currentTurn === "me" : true;
    const isOpponentTurn = currentTurn ? currentTurn === "opponent" : true;

    return (
        <div className="relative w-full h-full bg-base-100 flex items-stretch">
            {winner ? (
                <WinnerNotification winner={winner} />
            ) : isDraw ? (
                <DrawNotification />
            ) : (
                <>
                    <LeftPlayerInfo playerInfo={myInfo} isPlayerTurn={isMyTurn} />
                    <Timer seconds={seconds} />
                    <RightPlayerInfo playerInfo={opponentInfo} isPlayerTurn={isOpponentTurn} />
                </>
            )}
        </div>
    );
}
