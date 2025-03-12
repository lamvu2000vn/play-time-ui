"use client";

import Board from "./Board/Board";
import {useCallback, useEffect, useState} from "react";
import {showToast} from "@/helpers/utils/utils";
import socket from "@/libs/socket.io/socket";
import {Position, TicTacToeBoardMatrix, WSCallbackFunc} from "@/helpers/shared/types";
import {TicTacToePlayerMovedData} from "@/helpers/shared/interfaces/wsInterface";
import WebSocketService from "@/services/WebSocketService";
import {useTranslations} from "next-intl";
import {markCell} from "@/helpers/utils/games/ticTacToeUtils";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {finishTheMatch, selectBaseMatchInfo} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import {
    changeCurrentTurn,
    selectTicTacToeMatchInfo,
} from "@/libs/redux/features/ticTacToeMatchInfo/ticTacToeMatchInfoSlice";

export interface Moves {
    myMoves: Position[];
    opponentMoves: Position[];
    highlightMoves: Position[];
}

export default function TicTacToeGame() {
    const myMatchInfo = useAppSelector(selectTicTacToeMatchInfo)!;
    const {myInfo, roomId} = useAppSelector(selectBaseMatchInfo);
    const dispatch = useAppDispatch();
    const [moves, setMoves] = useState<Moves>({
        myMoves: [],
        opponentMoves: [],
        highlightMoves: [],
    });
    const [boardMatrix, setBoardMatrix] = useState<TicTacToeBoardMatrix>([]);

    const {gameSetup, gameSpecialData} = myMatchInfo;
    const translation = useTranslations("page.room");

    const handlePlayerMove = useCallback(
        async (position: Position) => {
            const newBoardMatrix = markCell(boardMatrix, position, gameSpecialData.myType);

            await WebSocketService.ticTacToePlayerMove({
                roomId,
                playerId: myInfo._id,
                position,
                playerMoves: moves.myMoves,
                newBoardMatrix,
            });
        },
        [boardMatrix, moves.myMoves, myInfo._id, roomId, gameSpecialData.myType]
    );

    useEffect(() => {
        showToast(
            gameSpecialData.firstTurn === "me" ? translation("youAreFirstTurn") : translation("opponentIsFirstTurn")
        );
    }, [gameSpecialData.firstTurn, translation]);

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
                const myMatchStatistics = matchStatistics && matchStatistics[myInfo._id];

                dispatch(finishTheMatch({winnerId: results === "win" ? playerId : undefined, myMatchStatistics}));
            } else {
                dispatch(changeCurrentTurn());
            }
        };

        socket.on("ticTacToePlayerMoved", handlePlayerMoved);

        return () => {
            socket.off("ticTacToePlayerMoved", handlePlayerMoved);
        };
    }, [myInfo._id, dispatch]);

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
