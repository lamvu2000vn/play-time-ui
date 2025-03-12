import MyTransition from "@/components/MyTransition";
import {Button, CancelButton, Card, Container, LevelBar, UserCoin} from "@/components/UI";
import {WSCallbackFunc} from "@/helpers/shared/types";
import {useEffect, useState} from "react";
import PlayAgainToast from "./PlayAgainToast";
import WebSocketService from "@/services/WebSocketService";
import {showToast} from "@/helpers/utils/utils";
import socket from "@/libs/socket.io/socket";
import {useTranslations} from "next-intl";
import {clearRoomInfo} from "@/libs/redux/features/roomInfo/roomInfoSlice";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {selectUser} from "@/libs/redux/features/auth/authSlice";
import {selectBaseMatchInfo, selectPlayerMatchStatistics} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import {selectMatchInfo} from "@/libs/redux/features/matchInfo/matchInfoSlice";
import {useRouter} from "@/i18n/routing";

export default function MatchCompletedSection() {
    const {isLeaved} = useAppSelector(selectBaseMatchInfo);
    const matchInfo = useAppSelector(selectMatchInfo);
    const newMatchStatistics = useAppSelector(selectPlayerMatchStatistics);
    const user = useAppSelector(selectUser);

    const [show, setShow] = useState<boolean>(false);
    const [showPlayAgainToast, setShowPlayAgainToast] = useState<boolean>(false);
    const [canceledRoom, setCanceledRoom] = useState<boolean>(false);

    const router = useRouter();
    const translation = useTranslations("page.room");
    const dispatch = useAppDispatch();

    const handleLeaveRoom = async () => {
        await WebSocketService.leaveRoom({
            roomId: matchInfo.roomId,
            leaverId: user!._id,
        });

        dispatch(clearRoomInfo());
        router.push("/");
    };

    const handleRequestPlayAgain = async () => {
        if (canceledRoom) return showToast(translation("error.playAgainFailure"), "info");

        const {status, message} = await WebSocketService.requestPlayAgain({
            roomId: matchInfo.roomId,
            requesterId: user!._id,
        });

        if (status === "ok") {
            showToast(translation("sentPlayAgainRequest"), "success");
        } else {
            switch (message) {
                case "Room not found": {
                    showToast(translation("error.playAgainFailure"), "info");
                    break;
                }
                default:
                    showToast(translation("error.sendPlayAgainRequestFail"), "error");
            }

            setCanceledRoom(true);
        }
    };

    useEffect(() => {
        setShow(true);
    }, [dispatch]);

    // Listen to WS events
    useEffect(() => {
        const handleWantToPlayAgain = async (payload: {requesterId: string}, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "Success", data: {}});

            const {requesterId} = payload;

            setShowPlayAgainToast(requesterId !== user!._id);
        };

        const handleRejectedPlayAgainRequest = async (_, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "Success", data: {}});

            if (!showPlayAgainToast) {
                showToast(translation("opponentCancelRequest"), "info");
            }

            setShowPlayAgainToast(false);
        };

        socket.on("wantToPlayAgain", handleWantToPlayAgain);
        socket.on("rejectedPlayAgainRequest", handleRejectedPlayAgainRequest);

        return () => {
            socket.off("wantToPlayAgain", handleWantToPlayAgain);
            socket.off("rejectedPlayAgainRequest", handleRejectedPlayAgainRequest);
        };
    }, [showPlayAgainToast, translation, user]);

    return (
        <MyTransition
            in={show}
            timeout={1000}
            className="w-full h-full"
            defaultStyles={{
                opacity: 0,
                transition: "all 1000ms ease-in-out",
            }}
            transitionStyles={{
                entering: {opacity: 1},
                entered: {opacity: 1},
                exiting: {opacity: 0},
                exited: {opacity: 0},
                unmounted: {opacity: 0},
            }}
        >
            <Container className="h-full flex items-center">
                <Card className="relative w-full max-w-[25rem] mx-auto">
                    {showPlayAgainToast && <PlayAgainToast />}

                    <div className="w-full py-8">
                        <div className="flex flex-col items-center gap-8">
                            <div className="w-2/3 sm:w-1/2 mx-auto">
                                <div className="flex justify-center">
                                    <LevelBar />
                                </div>
                            </div>
                            <UserCoin newCoin={newMatchStatistics?.newCoin} size="lg" />
                            <div className="flex flex-col gap-2 mx-auto w-max">
                                {!isLeaved && (
                                    <Button type="button" onClick={handleRequestPlayAgain}>
                                        {translation("playAgain")}
                                    </Button>
                                )}
                                <CancelButton onClick={handleLeaveRoom}>{translation("leaveRoom")}</CancelButton>
                            </div>
                        </div>
                    </div>
                </Card>
            </Container>
        </MyTransition>
    );
}
