"use client";

import {FifteenPuzzleBoardMatrix, WSCallbackFunc} from "@/helpers/shared/types";
import socket from "@/libs/socket.io/socket";
import WebSocketService from "@/services/WebSocketService";
import {useEffect, useState} from "react";
import MyBoard from "./Board/MyBoard";
import Instruction from "./Instruction";
import PlayerZoneNotification from "./PlayerZoneNotification";
import OpponentBoard from "./Board/OpponentBoard";
import {FifteenPuzzleOpponentBoardUpdatedPayload} from "@/helpers/shared/interfaces/games/fifteenPuzzleInterfaces";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {finishTheMatch, selectBaseMatchInfo} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import {selectFifteenPuzzleMatchInfo} from "@/libs/redux/features/fifteenPuzzleMatchInfo/fifteenPuzzleMatchInfoSlice";
import {selectStopTheMatchState} from "@/libs/redux/features/inMatchData/inMatchDataSlice";

export default function FifteenPuzzleGame() {
    const isStopTheMatch = useAppSelector(selectStopTheMatchState);
    const baseMatchInfo = useAppSelector(selectBaseMatchInfo);
    const myMatchInfo = useAppSelector(selectFifteenPuzzleMatchInfo)!;

    const {myInfo, opponentInfo, roomId, matchStatus} = baseMatchInfo;
    const {gameSpecialData} = myMatchInfo;

    const [showPlayerZone, setShowPlayerZone] = useState<boolean>(false);
    const [myBoardMatrix, setMyBoardMatrix] = useState<FifteenPuzzleBoardMatrix>(gameSpecialData.myBoardMatrix);
    const [opponentBoardMatrix, setOpponentBoardMatrix] = useState<FifteenPuzzleBoardMatrix>(
        gameSpecialData.opponentBoardMatrix
    );

    const dispatch = useAppDispatch();

    const handleWSPlayerMove = async (boardMatrix: FifteenPuzzleBoardMatrix) => {
        const {status, data} = await WebSocketService.fifteenPuzzlePlayerMove({
            roomId,
            playerId: myInfo._id,
            boardMatrix,
        });

        if (status === "ok" && data.isWin && data.matchStatistics) {
            const {matchStatistics} = data;
            dispatch(finishTheMatch({winnerId: myInfo._id, myMatchStatistics: matchStatistics[myInfo._id]}));
        }
    };

    const handleUpdateBoardMatrix = (newBoardMatrix: FifteenPuzzleBoardMatrix) => {
        if (showPlayerZone || isStopTheMatch || matchStatus === "completed") return;

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
                    dispatch(
                        finishTheMatch({winnerId: opponentInfo._id, myMatchStatistics: matchStatistics[myInfo._id]})
                    );
                }
            }
        };

        socket.on("fifteenPuzzleOpponentBoardUpdated", handleOpponentBoardUpdated);

        return () => {
            socket.off("fifteenPuzzleOpponentBoardUpdated", handleOpponentBoardUpdated);
        };
    }, [baseMatchInfo, myInfo._id, opponentInfo._id, dispatch]);

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
        <div className="w-full h-full flex items-stretch divide-x-2 divide-gray-300 pt-8">
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
                            <div className="shrink-0 flex items-end">
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
                            <div className="shrink-0 flex items-end">
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
