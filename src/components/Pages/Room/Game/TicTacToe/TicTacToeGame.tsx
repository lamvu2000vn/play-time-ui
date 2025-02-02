"use client";

import {useRecoilState} from "recoil";
import Board from "./Board/Board";
import {baseMatchInfoState, ticTacToeMatchInfoState} from "@/libs/recoil/atom";
import {useCallback, useContext, useEffect, useState} from "react";
import {showToast} from "@/helpers/utils/utils";
import socket from "@/libs/socket.io/socket";
import {Position, TicTacToeBoardMatrix, WSCallbackFunc} from "@/helpers/shared/types";
import {TicTacToePlayerMovedData} from "@/helpers/shared/interfaces/wsInterface";
import WebSocketService from "@/services/WebSocketService";
import {useTranslations} from "next-intl";
import {finishTheMatch} from "@/helpers/utils/games/baseMatchInfoUtils";
import {markCell} from "@/helpers/utils/games/ticTacToeUtils";
import {GameContext} from "@/helpers/contexts";

export interface Moves {
    myMoves: Position[];
    opponentMoves: Position[];
    highlightMoves: Position[];
}

export default function TicTacToeGame() {
    const {onSetMyMatchStatistics} = useContext(GameContext);

    const [baseMatchInfo, setBaseMatchInfo] = useRecoilState(baseMatchInfoState);
    const [myMatchInfo, setMyMatchInfo] = useRecoilState(ticTacToeMatchInfoState);
    const [moves, setMoves] = useState<Moves>({
        myMoves: [],
        opponentMoves: [],
        highlightMoves: [],
    });
    const [boardMatrix, setBoardMatrix] = useState<TicTacToeBoardMatrix>([]);

    const {myInfo, roomId, game} = myMatchInfo!;
    const {gameSetup, specialData} = game;
    const translation = useTranslations("page.room");

    const handlePlayerMove = useCallback(
        async (position: Position) => {
            const newBoardMatrix = markCell(boardMatrix, position, specialData.myType);

            await WebSocketService.ticTacToePlayerMove({
                roomId,
                playerId: myInfo._id,
                position,
                playerMoves: moves.myMoves,
                newBoardMatrix,
            });
        },
        [boardMatrix, moves.myMoves, myInfo._id, roomId, specialData.myType]
    );

    useEffect(() => {
        showToast(specialData.firstTurn === "me" ? translation("youAreFirstTurn") : translation("opponentIsFirstTurn"));
    }, [specialData.firstTurn, translation]);

    // Listen to ws events
    useEffect(() => {
        const handlePlayerMoved = (payload: TicTacToePlayerMovedData, callback: WSCallbackFunc<object>) => {
            callback({
                status: "ok",
                message: "success",
                data: {},
            });

            const {matchResults, playerId, position, matchStatistics, newBoardMatrix} = payload;
            const isMyMove = playerId === myInfo._id;
            const {moves: newMoves, results} = matchResults;

            setMoves((prevState) => ({
                myMoves: isMyMove ? [...prevState.myMoves, position] : prevState.myMoves,
                opponentMoves: isMyMove ? prevState.opponentMoves : [...prevState.opponentMoves, position],
                highlightMoves: results === "win" ? newMoves : [position],
            }));
            setBoardMatrix(newBoardMatrix);

            if (results) {
                const myStatistics = matchStatistics![myInfo._id];

                setBaseMatchInfo(finishTheMatch(baseMatchInfo!, results === "win" ? playerId : undefined));
                onSetMyMatchStatistics(myStatistics);
            } else {
                const updatedInfo = structuredClone(myMatchInfo!);
                updatedInfo.game.specialData.currentTurn =
                    updatedInfo.game.specialData.currentTurn === "me" ? "opponent" : "me";

                setMyMatchInfo(updatedInfo);
            }
        };

        socket.on("ticTacToePlayerMoved", handlePlayerMoved);

        return () => {
            socket.off("ticTacToePlayerMoved", handlePlayerMoved);
        };
    }, [baseMatchInfo, myInfo._id, myMatchInfo, onSetMyMatchStatistics, setBaseMatchInfo, setMyMatchInfo]);

    // Initialize Board matrix
    useEffect(() => {
        switch (gameSetup.boardSize) {
            case "3x3":
                setBoardMatrix(Array.from({length: 3}, () => Array.from({length: 3}, () => null)));
                break;
            case "5x5":
                setBoardMatrix(Array.from({length: 5}, () => Array.from({length: 5}, () => null)));
                break;
            default:
                console.error(`Unsupported board size: ${gameSetup.boardSize}`);
                return;
        }
    }, [gameSetup.boardSize]);

    if (!myMatchInfo) return <div></div>;

    return (
        <div className="w-full h-full flex justify-center items-center overflow-hidden">
            <Board boardMatrix={boardMatrix} moves={moves} onPlayerMove={handlePlayerMove} />
        </div>
    );
}
