"use client";

import ErrorSection from "@/components/Pages/Room/ErrorSection";
import PreparingRoomSection from "@/components/Pages/Room/PreparingRoomSection";
import WaitingRoomSection from "@/components/Pages/Room/WaitingRoomSection";
import {LoadingScreen} from "@/components/UI";
import WebSocketService from "@/services/WebSocketService";
import {use, useEffect} from "react";
import MatchCompletedSection from "@/components/Pages/Room/MatchCompletedSection";
import JoinRoomSection from "@/components/Pages/Room/JoinRoomSection";
import StartTheGameSection from "@/components/Pages/Room/StartTheGameSection";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {clearRoomInfo, selectRoomInfo} from "@/libs/redux/features/roomInfo/roomInfoSlice";
import {selectBaseMatchInfo} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import WSEventListener from "@/components/Pages/Room/Layout/WSEventListener";
import {changeShowingScreen, selectShowingScreen} from "@/libs/redux/features/inMatchData/inMatchDataSlice";
import {useRouter} from "@/i18n/routing";

interface Props {
    params: Promise<{roomId: string}>;
}

const SWITCH_SCREEN_DELAY = 3000; // 3 seconds

export default function Page(props: Props) {
    const params = use(props.params);

    const roomInfo = useAppSelector(selectRoomInfo);
    const baseMatchInfo = useAppSelector(selectBaseMatchInfo);
    const screenShowing = useAppSelector(selectShowingScreen);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {roomId, myMatchStatistics, matchStatus, isLeaved} = baseMatchInfo;

    useEffect(() => {
        if (!roomInfo) {
            dispatch(changeShowingScreen({screen: "joinRoomScreen"}));
            return;
        }

        if (roomInfo.type === "PlayWithFriend") {
            dispatch(changeShowingScreen({screen: "waitingRoomScreen"}));
            return;
        }

        if (roomInfo.type === "Random") {
            WebSocketService.readyForQuickMatch(roomInfo.roomId);
            dispatch(changeShowingScreen({screen: "preparingRoomScreen"}));
            return;
        }

        return () => {
            dispatch(changeShowingScreen({screen: "loadingScreen"}));
        };
    }, [dispatch, roomInfo]);

    // Switch to startTheGame screen
    useEffect(() => {
        if (baseMatchInfo.roomId) {
            dispatch(changeShowingScreen({screen: "startTheGameScreen"}));
        }
    }, [baseMatchInfo, dispatch]);

    // Switch to matchCompleted screen
    useEffect(() => {
        if (roomId && matchStatus === "completed") {
            if (!myMatchStatistics) {
                setTimeout(() => {
                    dispatch(changeShowingScreen({screen: "loadingScreen"}));
                    router.push("/");
                    dispatch(clearRoomInfo());
                }, SWITCH_SCREEN_DELAY);
            } else {
                setTimeout(
                    () => {
                        dispatch(changeShowingScreen({screen: "matchCompletedScreen"}));
                    },
                    isLeaved ? 0 : SWITCH_SCREEN_DELAY
                );
            }
        }
    }, [isLeaved, dispatch, matchStatus, myMatchStatistics, roomId, router]);

    let content: React.JSX.Element;

    switch (screenShowing) {
        case "loadingScreen":
            content = <LoadingScreen />;
            break;
        case "joinRoomScreen":
            content = <JoinRoomSection roomId={params.roomId} />;
            break;
        case "errorScreen":
            content = <ErrorSection />;
            break;
        case "preparingRoomScreen":
            content = <PreparingRoomSection />;
            break;
        case "startTheGameScreen":
            content = <StartTheGameSection />;
            break;
        case "matchCompletedScreen":
            content = <MatchCompletedSection />;
            break;
        case "waitingRoomScreen":
        default:
            content = <WaitingRoomSection />;
            break;
    }

    return <WSEventListener>{content}</WSEventListener>;
}
