"use client";

import {FifteenPuzzleBoardMatrix, WSCallbackFunc} from "@/helpers/shared/types";
import {baseMatchInfoState, fifteenPuzzleMatchInfoState} from "@/libs/recoil/atom";
import socket from "@/libs/socket.io/socket";
import WebSocketService from "@/services/WebSocketService";
import {useContext, useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import MyBoard from "./Board/MyBoard";
import Instruction from "./Instruction";
import PlayerZoneNotification from "./PlayerZoneNotification";
import OpponentBoard from "./Board/OpponentBoard";
import {FifteenPuzzleOpponentBoardUpdatedPayload} from "@/helpers/shared/interfaces/games/fifteenPuzzleInterfaces";
import {finishTheMatch} from "@/helpers/utils/games/baseMatchInfoUtils";
import {GameContext} from "@/helpers/contexts";

export default function FifteenPuzzleGame() {
    const {onSetMyMatchStatistics, stopTheMatch} = useContext(GameContext);

    const [baseMatchInfo, setBaseMatchInfo] = useRecoilState(baseMatchInfoState);
    const myMatchInfo = useRecoilValue(fifteenPuzzleMatchInfoState)!;
    const [showPlayerZone, setShowPlayerZone] = useState<boolean>(false);
    const {myInfo, opponentInfo, roomId, game, matchStatus} = myMatchInfo;
    const {specialData} = game;
    const [myBoardMatrix, setMyBoardMatrix] = useState<FifteenPuzzleBoardMatrix>(specialData.myBoardMatrix);
    const [opponentBoardMatrix, setOpponentBoardMatrix] = useState<FifteenPuzzleBoardMatrix>(
        specialData.opponentBoardMatrix
    );

    const handleWSPlayerMove = async (boardMatrix: FifteenPuzzleBoardMatrix) => {
        const {status, data} = await WebSocketService.fifteenPuzzlePlayerMove({
            roomId,
            playerId: myInfo._id,
            boardMatrix,
        });

        if (status === "ok" && data.isWin && data.matchStatistics) {
            const {matchStatistics} = data;
            setBaseMatchInfo(finishTheMatch(baseMatchInfo!, myInfo._id));
            onSetMyMatchStatistics(matchStatistics[myInfo._id]);
        }
    };

    const handleUpdateBoardMatrix = (newBoardMatrix: FifteenPuzzleBoardMatrix) => {
        if (showPlayerZone || stopTheMatch || matchStatus === "completed") return;

        setMyBoardMatrix(newBoardMatrix);
        handleWSPlayerMove(newBoardMatrix);
    };

    // Listen to ws events
    useEffect(() => {
        const handleOpponentBoardUpdated = (
            payload: FifteenPuzzleOpponentBoardUpdatedPayload,
            callback: WSCallbackFunc<object>
        ) => {
            callback({status: "ok", message: "Success", data: {}});

            const {playerMovedId, boardMatrix, isOpponentWin, matchStatistics} = payload;

            if (playerMovedId === opponentInfo._id) {
                setOpponentBoardMatrix(boardMatrix);

                if (isOpponentWin && matchStatistics) {
                    setBaseMatchInfo(finishTheMatch(baseMatchInfo!, opponentInfo._id));
                    onSetMyMatchStatistics(matchStatistics[myInfo._id]);
                }
            }
        };

        socket.on("fifteenPuzzleOpponentBoardUpdated", handleOpponentBoardUpdated);

        return () => {
            socket.off("fifteenPuzzleOpponentBoardUpdated", handleOpponentBoardUpdated);
        };
    }, [baseMatchInfo, myInfo._id, opponentInfo._id, setBaseMatchInfo, onSetMyMatchStatistics]);

    // Handle show player's zone
    useEffect(() => {
        setShowPlayerZone(true);

        const timer = setTimeout(() => {
            setShowPlayerZone(false);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="w-full h-full flex items-stretch divide-x-2 pt-8">
            <div className="basis-1/2">
                <div className="relative w-full h-full">
                    <div className="w-full h-full flex justify-center items-stretch">
                        <div className="w-full h-full flex flex-col justify-center max-w-[25rem] gap-6 lg:gap-10 mx-8 py-6 lg:py-12">
                            <div className="w-full flex items-center justify-center">
                                <div className="aspect-square w-[15rem] lg:w-full h-auto">
                                    <MyBoard
                                        boardMatrix={myBoardMatrix}
                                        onUpdateBoardMatrix={handleUpdateBoardMatrix}
                                    />
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex items-end">
                                <Instruction />
                            </div>
                        </div>
                    </div>
                    <PlayerZoneNotification show={showPlayerZone} owner="me" />
                </div>
            </div>
            <div className="basis-1/2">
                <div className="relative w-full h-full">
                    <div className="w-full h-full flex justify-center items-stretch">
                        <div className="w-full h-full flex flex-col justify-center max-w-[25rem] gap-6 lg:gap-10 mx-8 py-6 lg:py-12">
                            <div className="w-full flex items-center justify-center">
                                <div className="aspect-square w-[15rem] lg:w-full h-auto">
                                    <OpponentBoard boardMatrix={opponentBoardMatrix} />
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex items-end">
                                <Instruction />
                            </div>
                        </div>
                    </div>
                    <PlayerZoneNotification show={showPlayerZone} owner="opponent" />
                </div>
            </div>
        </div>
    );
}
