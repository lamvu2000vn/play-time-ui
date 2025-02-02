"use client";

import ErrorSection from "@/components/Pages/Room/ErrorSection";
import PreparingRoomSection from "@/components/Pages/Room/PreparingRoomSection";
import WaitingRoomSection from "@/components/Pages/Room/WaitingRoomSection";
import {LoadingScreen} from "@/components/UI";
import {useAuth} from "@/helpers/hooks/useAuth";
import {WSCallbackFunc} from "@/helpers/shared/types";
import {roomInfoState, matchInfoState, baseMatchInfoState} from "@/libs/recoil/atom";
import socket from "@/libs/socket.io/socket";
import WebSocketService from "@/services/WebSocketService";
import {useCallback, useEffect, useState} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {MatchInfo, PlayerMatchStatistics} from "@/helpers/shared/interfaces/commonInterface";
import MatchCompletedSection from "@/components/Pages/Room/MatchCompletedSection";
import JoinRoomSection from "@/components/Pages/Room/JoinRoomSection";
import StartTheGameSection from "@/components/Pages/Room/StartTheGameSection";
import {initializeData} from "@/helpers/utils/games/baseMatchInfoUtils";

interface Props {
    params: {
        roomId: string;
    };
}

export type Screen =
    | "loadingScreen"
    | "errorScreen"
    | "preparingRoomScreen"
    | "startTheGameScreen"
    | "matchCompletedScreen"
    | "waitingRoomScreen"
    | "joinRoomScreen";

export type MatchCompletedFunc = (newPlayerMatchStatistics: PlayerMatchStatistics, isLeavedRoom?: boolean) => void;

export default function Page(props: Props) {
    const {params} = props;

    const [roomInfo, setRoomInfo] = useRecoilState(roomInfoState);
    const [matchInfo, setMatchInfo] = useRecoilState(matchInfoState);
    const setBaseMatchInfo = useSetRecoilState(baseMatchInfoState);
    const [error, setError] = useState<string>("");
    const [playerMatchStatistics, setPlayerMatchStatistics] = useState<PlayerMatchStatistics | null>(null);
    const [screenShowing, setScreenShowing] = useState<Screen>("loadingScreen");
    const [leavedRoom, setLeavedRoom] = useState<boolean>(false);
    const {auth} = useAuth();
    const user = auth.user!;

    const handleMatchCompleted = useCallback<MatchCompletedFunc>(
        (newPlayerMatchStatistics: PlayerMatchStatistics, isLeavedRoom: boolean = false) => {
            setLeavedRoom(isLeavedRoom);
            setPlayerMatchStatistics(newPlayerMatchStatistics);
        },
        []
    );

    const handleSetError = (error: string) => {
        setError(error);
        setScreenShowing("errorScreen");
    };

    const handleChangeScreen = (screen: Screen) => setScreenShowing(screen);

    useEffect(() => {
        const handleJoinedRoom = (_, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "Success", data: {}});
            setScreenShowing("preparingRoomScreen");
        };

        const handleStartTheGame = async (payload: MatchInfo, callback: WSCallbackFunc<object>) => {
            callback({
                status: "ok",
                message: "Success",
                data: {},
            });

            setMatchInfo(payload);
            setBaseMatchInfo(initializeData(payload, user));
            setScreenShowing("startTheGameScreen");
        };

        socket.on("joinedRoom", handleJoinedRoom);
        socket.on("startTheGame", handleStartTheGame);

        return () => {
            socket.off("joinedRoom", handleJoinedRoom);
            socket.off("startTheGame", handleStartTheGame);
        };
    }, [setBaseMatchInfo, setMatchInfo, setRoomInfo, user, user._id]);

    useEffect(() => {
        if (!roomInfo) {
            setScreenShowing("joinRoomScreen");
            return;
        }

        if (roomInfo.type === "PlayWithFriend") {
            setScreenShowing("waitingRoomScreen");
            return;
        }

        if (roomInfo.type === "Random") {
            WebSocketService.readyForQuickMatch(roomInfo.roomId);
            setScreenShowing("preparingRoomScreen");
            return;
        }
    }, [roomInfo]);

    useEffect(() => {
        if (playerMatchStatistics) {
            setTimeout(
                () => {
                    setScreenShowing("matchCompletedScreen");
                },
                leavedRoom ? 0 : 3000
            );
        }
    }, [leavedRoom, playerMatchStatistics]);

    switch (screenShowing) {
        case "loadingScreen":
            return <LoadingScreen />;
        case "joinRoomScreen":
            return (
                <JoinRoomSection roomId={params.roomId} onError={handleSetError} onChangeScreen={handleChangeScreen} />
            );
        case "errorScreen":
            return <ErrorSection message={error} />;
        case "preparingRoomScreen":
            return <PreparingRoomSection />;
        case "startTheGameScreen":
            return <StartTheGameSection gameName={matchInfo!.game.info.name} onMatchCompleted={handleMatchCompleted} />;
        case "matchCompletedScreen":
            return <MatchCompletedSection leavedRoom={leavedRoom} playerMatchStatistics={playerMatchStatistics!} />;
        case "waitingRoomScreen":
        default:
            return <WaitingRoomSection />;
    }
}
