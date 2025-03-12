import {useAudio, useGetDataWhenTimeOut} from "@/helpers/hooks";
import {ChatContent, MatchInfo} from "@/helpers/shared/interfaces/commonInterface";
import {MatchStatistics, OpponentLeavedMatchPayload} from "@/helpers/shared/interfaces/wsInterface";
import {WSCallbackFunc} from "@/helpers/shared/types";
import {selectUser} from "@/libs/redux/features/auth/authSlice";
import {finishTheMatch, selectBaseMatchInfo} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import {
    changeShowingScreen,
    pushMessage,
    setGameError,
    setSeconds,
    setStopTheMatch,
} from "@/libs/redux/features/inMatchData/inMatchDataSlice";
import {setMatchInfo} from "@/libs/redux/features/matchInfo/matchInfoSlice";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import socket from "@/libs/socket.io/socket";
import {useTranslations} from "next-intl";
import {useEffect} from "react";

interface Props {
    children: React.ReactNode;
}

export default function WSEventListener(props: Props) {
    const {children} = props;

    const user = useAppSelector(selectUser);
    const baseMatchInfo = useAppSelector(selectBaseMatchInfo);
    const dispatch = useAppDispatch();
    const audio = useAudio();
    const getData = useGetDataWhenTimeOut();
    const {myInfo, opponentInfo} = baseMatchInfo;
    const roomTranslate = useTranslations("page.room");

    useEffect(() => {
        const handleJoinedRoom = (_, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "Success", data: {}});
            dispatch(changeShowingScreen({screen: "preparingRoomScreen"}));
        };

        const handleStartTheGame = async (payload: MatchInfo, callback: WSCallbackFunc<object>) => {
            callback({
                status: "ok",
                message: "Success",
                data: {},
            });

            dispatch(setMatchInfo(payload));
        };

        const handleReceiveMessageInGame = async (payload: ChatContent, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "Success", data: {}});

            dispatch(pushMessage({message: payload}));

            if (payload.sender._id === user._id) {
                audio.sendMessage.play();
            } else {
                audio.receiveMessage.play();
            }
        };

        const handleStartCountDown = async (_, callback: WSCallbackFunc<object>) => {
            console.log("Start count down");
            callback({status: "ok", message: "Success", data: {}});
        };

        const handleTimeUpdated = async (payload: {seconds: number}) => {
            dispatch(setSeconds({seconds: payload.seconds}));
        };

        const handleMatchTimeOut = (_, callback: WSCallbackFunc<object>) => {
            dispatch(setStopTheMatch({state: true}));
            const dataWhenTimeOut = getData();
            callback({status: "ok", message: "Success", data: dataWhenTimeOut});
        };

        const handleMatchStatistics = async (payload: {
            matchStatistics: MatchStatistics | null;
            winnerId: string | undefined;
        }) => {
            const {matchStatistics, winnerId} = payload;
            const myMatchStatistics = matchStatistics && matchStatistics[user._id];

            dispatch(finishTheMatch({myMatchStatistics, winnerId}));
            dispatch(setStopTheMatch({state: false}));
        };

        const handleOpponentLeavedMatch = (payload: OpponentLeavedMatchPayload, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "Success", data: {}});

            const {leaverId, matchStatistics} = payload;

            const isAmLeaved = leaverId === myInfo._id;
            const winnerId = isAmLeaved ? opponentInfo._id : myInfo._id;
            const myMatchStatistics = matchStatistics && matchStatistics[myInfo._id];

            dispatch(finishTheMatch({winnerId, myMatchStatistics, isLeaved: isAmLeaved}));
        };

        const handleGenerateMatchInfoFailure = (_, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "success", data: {}});

            dispatch(setGameError({error: roomTranslate("error.getMatchInfoFailure")}));
            dispatch(changeShowingScreen({screen: "errorScreen"}));
        };

        socket.on("joinedRoom", handleJoinedRoom);
        socket.on("startTheGame", handleStartTheGame);
        socket.on("receiveMessageInGame", handleReceiveMessageInGame);
        socket.on("startCountDown", handleStartCountDown);
        socket.on("matchTimeUpdated", handleTimeUpdated);
        socket.on("matchTimeOut", handleMatchTimeOut);
        socket.on("matchStatistics", handleMatchStatistics);
        socket.on("opponentLeavedMatch", handleOpponentLeavedMatch);
        socket.on("generateMatchInfoFailure", handleGenerateMatchInfoFailure);

        return () => {
            socket.off("joinedRoom", handleJoinedRoom);
            socket.off("startTheGame", handleStartTheGame);
            socket.off("receiveMessageInGame", handleReceiveMessageInGame);
            socket.off("startCountDown", handleStartCountDown);
            socket.off("matchTimeUpdated", handleTimeUpdated);
            socket.off("matchTimeOut", handleMatchTimeOut);
            socket.off("matchStatistics", handleMatchStatistics);
            socket.off("opponentLeavedMatch", handleOpponentLeavedMatch);
            socket.off("generateMatchInfoFailure", handleGenerateMatchInfoFailure);
        };
    }, [
        audio.receiveMessage,
        audio.sendMessage,
        dispatch,
        getData,
        myInfo._id,
        opponentInfo._id,
        roomTranslate,
        user._id,
    ]);

    return children;
}
