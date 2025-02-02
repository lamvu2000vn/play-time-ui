import {GameAvailable, WSCallbackFunc} from "@/helpers/shared/types";
import TransformMyMatchInfo from "./Game/TransformMyMatchInfo";
import SoundEffect from "./Game/SoundEffect";
import Layout from "./Layout/Layout";
import TicTacToeGame from "./Game/TicTacToe/TicTacToeGame";
import {MatchCompletedFunc} from "@/app/[locale]/room/[roomId]/page";
import MemoryGame from "./Game/Memory/MemoryGame";
import FifteenPuzzleGame from "./Game/15Puzzle/FifteenPuzzleGame";
import {useCallback, useEffect, useState} from "react";
import {ChatContent, PlayerMatchStatistics} from "@/helpers/shared/interfaces/commonInterface";
import {useRecoilState, useRecoilValue} from "recoil";
import {baseMatchInfoState, memoryMatchInfoState, ticTacToeMatchInfoState} from "@/libs/recoil/atom";
import {useAuth} from "@/helpers/hooks/useAuth";
import useAudio from "@/helpers/hooks/useAudio";
import {DataWhenTimeOut, MatchStatistics, OpponentLeavedMatchPayload} from "@/helpers/shared/interfaces/wsInterface";
import {finishTheMatch} from "@/helpers/utils/games/baseMatchInfoUtils";
import socket from "@/libs/socket.io/socket";
import {GameContext} from "@/helpers/contexts";

interface Props {
    gameName: GameAvailable;
    onMatchCompleted: MatchCompletedFunc;
}

export default function StartTheGameSection(props: Props) {
    const {gameName, onMatchCompleted} = props;

    const [baseMatchInfo, setBaseMatchInfo] = useRecoilState(baseMatchInfoState);
    const ticTacToeMatchInfo = useRecoilValue(ticTacToeMatchInfoState);
    const memoryMatchInfo = useRecoilValue(memoryMatchInfoState);
    const [stopTheMatch, setStopTheMatch] = useState<boolean>(false);
    const [myMatchStatistics, setMyMatchStatistics] = useState<PlayerMatchStatistics | null>(null);
    const [messages, setMessages] = useState<ChatContent[]>([]);
    const [seconds, setSeconds] = useState<number>(0);
    const {auth} = useAuth();
    const audio = useAudio();
    const user = auth.user!;
    const {opponentInfo, myInfo} = baseMatchInfo!;

    const handleSetMyMatchStatistics = (matchStatistics: PlayerMatchStatistics) =>
        setMyMatchStatistics(matchStatistics);

    const getDataWhenTimeOut = useCallback(
        (gameName: GameAvailable): DataWhenTimeOut => {
            switch (gameName) {
                case "Tic Tac Toe": {
                    const currentTurnId =
                        ticTacToeMatchInfo!.game.specialData.currentTurn === "me" ? myInfo._id : opponentInfo._id;

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
                            playerId:
                                memoryMatchInfo!.game.specialData.currentTurn === "me" ? myInfo._id : opponentInfo._id,
                            numOfMyCards: memoryMatchInfo!.game.specialData.numOfMyCards,
                            numOfOpponentCards: memoryMatchInfo!.game.specialData.numOfOpponentCards,
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
        },
        [memoryMatchInfo, myInfo._id, opponentInfo._id, ticTacToeMatchInfo]
    );

    // Handle switch to summary screen
    useEffect(() => {
        if (myMatchStatistics) {
            onMatchCompleted(myMatchStatistics);
        }
    }, [myMatchStatistics, onMatchCompleted]);

    // Listen to ws events
    useEffect(() => {
        const handleReceiveMessageInGame = async (payload: ChatContent, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "Success", data: {}});

            setMessages((prevMessages) => [...prevMessages, payload]);

            if (payload.sender._id === user._id) {
                audio?.sendMessage.play();
            } else {
                audio?.receiveMessage.play();
            }
        };

        const handleStartCountDown = async (_, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "Success", data: {}});
        };

        const handleTimeUpdated = async (payload: {seconds: number}) => {
            setSeconds(payload.seconds);
        };

        const handleMatchTimeOut = (_, callback: WSCallbackFunc<object>) => {
            setStopTheMatch(true);
            const dataWhenTimeOut = getDataWhenTimeOut(gameName);
            callback({status: "ok", message: "Success", data: dataWhenTimeOut});
        };

        const handleMatchStatistics = async (payload: {
            matchStatistics: MatchStatistics | null;
            winnerId: string | undefined;
        }) => {
            const {matchStatistics, winnerId} = payload;
            const playerStatistics = matchStatistics![user._id];

            setBaseMatchInfo(finishTheMatch(baseMatchInfo!, winnerId));
            onMatchCompleted(playerStatistics);
            setStopTheMatch(false);
        };

        const handleOpponentLeavedMatch = (payload: OpponentLeavedMatchPayload, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "Success", data: {}});

            const {leaverId, matchStatistics} = payload;

            const isOpponentLeaved = leaverId === opponentInfo._id;
            const winnerId = isOpponentLeaved ? myInfo._id : opponentInfo._id;
            const myStatistics = matchStatistics![myInfo._id];

            setBaseMatchInfo(finishTheMatch(baseMatchInfo!, winnerId));
            setTimeout(
                () => {
                    onMatchCompleted(myStatistics, true);
                },
                isOpponentLeaved ? 3000 : 0
            );
        };

        socket.on("receiveMessageInGame", handleReceiveMessageInGame);
        socket.on("startCountDown", handleStartCountDown);
        socket.on("matchTimeUpdated", handleTimeUpdated);
        socket.on("matchTimeOut", handleMatchTimeOut);
        socket.on("matchStatistics", handleMatchStatistics);
        socket.on("opponentLeavedMatch", handleOpponentLeavedMatch);

        return () => {
            socket.off("receiveMessageInGame", handleReceiveMessageInGame);
            socket.off("startCountDown", handleStartCountDown);
            socket.off("matchTimeUpdated", handleTimeUpdated);
            socket.off("matchTimeOut", handleMatchTimeOut);
            socket.off("matchStatistics", handleMatchStatistics);
            socket.off("opponentLeavedMatch", handleOpponentLeavedMatch);
        };
    }, [
        audio?.receiveMessage,
        audio?.sendMessage,
        baseMatchInfo,
        gameName,
        getDataWhenTimeOut,
        myInfo._id,
        onMatchCompleted,
        opponentInfo._id,
        setBaseMatchInfo,
        user._id,
    ]);

    if (!gameName) return null;

    return (
        <GameContext.Provider
            value={{
                gameName,
                messages,
                seconds,
                stopTheMatch,
                onSetMyMatchStatistics: handleSetMyMatchStatistics,
            }}
        >
            <TransformMyMatchInfo>
                <SoundEffect>
                    <Layout>
                        {gameName === "Tic Tac Toe" ? (
                            <TicTacToeGame />
                        ) : gameName === "15 Puzzle" ? (
                            <FifteenPuzzleGame />
                        ) : gameName === "Memory" ? (
                            <MemoryGame />
                        ) : null}
                    </Layout>
                </SoundEffect>
            </TransformMyMatchInfo>
        </GameContext.Provider>
    );
}
