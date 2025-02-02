import MyTransition from "@/components/MyTransition";
import {Button, CancelButton, Card, Container, LevelBar, UserCoin} from "@/components/UI";
import {useAuth} from "@/helpers/hooks/useAuth";
import {GameStatistics, PlayerMatchStatistics, UserInfo} from "@/helpers/shared/interfaces/commonInterface";
import {GameAvailable, WSCallbackFunc} from "@/helpers/shared/types";
import {gameStatisticsState, matchInfoState, roomInfoState, ticTacToeMatchInfoState} from "@/libs/recoil/atom";
import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import PlayAgainToast from "./PlayAgainToast";
import WebSocketService from "@/services/WebSocketService";
import {showToast} from "@/helpers/utils/utils";
import {WantToPlayAgainPayload} from "@/helpers/shared/interfaces/wsInterface";
import socket from "@/libs/socket.io/socket";
import {useTranslations} from "next-intl";

interface Props {
    playerMatchStatistics: PlayerMatchStatistics;
    leavedRoom: boolean;
}

export default function MatchCompletedSection(props: Props) {
    const {playerMatchStatistics, leavedRoom} = props;

    const {gameStatistics: newGameStatistics, newCoin} = playerMatchStatistics;

    const [allGameStatistics, setAllGameStatistics] = useRecoilState(gameStatisticsState);
    const setRoomInfo = useSetRecoilState(roomInfoState);
    const [matchInfo, setMatchInfo] = useRecoilState(matchInfoState);
    const setTicTacToeMatchInfo = useSetRecoilState(ticTacToeMatchInfoState);
    const [show, setShow] = useState<boolean>(false);
    const [playAgainRequester, setPlayAgainRequester] = useState<UserInfo | null>(null);
    const [canceledRoom, setCanceledRoom] = useState<boolean>(false);
    const router = useRouter();
    const {auth} = useAuth();
    const translation = useTranslations("page.room");
    const user = auth.user!;

    const currentGameStatistics = useRef<GameStatistics>(
        allGameStatistics.find((statistics) => statistics.gameInfo._id === newGameStatistics.gameInfo._id)!
    );

    const handleLeaveRoom = () => {
        if (matchInfo) {
            (async () => {
                const {game, roomId} = matchInfo;

                await WebSocketService.leaveRoom({
                    roomId,
                    leaverId: user._id,
                });

                const gameName = game.info.name as GameAvailable;

                if (gameName) {
                    switch (gameName) {
                        case "Tic Tac Toe":
                            setTicTacToeMatchInfo(null);
                            break;
                        case "15 Puzzle":
                            setTicTacToeMatchInfo(null);
                            break;
                        case "Memory":
                            setTicTacToeMatchInfo(null);
                            break;
                        default:
                            throw new Error("Invalid game name");
                    }
                }

                setRoomInfo(null);
                setMatchInfo(null);
            })();
        }

        router.push("/");
    };

    const handleRequestPlayAgain = async () => {
        if (canceledRoom) return showToast(translation("error.playAgainFailure"), "info");

        const {status, message} = await WebSocketService.requestPlayAgain({
            roomId: matchInfo!.roomId,
            requesterId: user._id,
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

    const handleAcceptRequest = async () => {
        const {status} = await WebSocketService.acceptPlayAgainRequest({
            requesterId: playAgainRequester!._id,
            requesteeId: user._id,
            roomId: matchInfo!.roomId,
        });

        if (status === "not ok") {
            showToast(translation("error.playAgainFailure"), "info");
        }
    };

    const handleRejectRequest = async () => {
        await WebSocketService.rejectPlayAgainRequest({
            rejecterId: user._id,
            requesterId: playAgainRequester!._id,
            roomId: matchInfo!.roomId,
        });

        setPlayAgainRequester(null);
    };

    useEffect(() => {
        setAllGameStatistics((prevState) =>
            prevState.map((gameStatistics) =>
                gameStatistics.gameInfo._id === newGameStatistics.gameInfo._id ? newGameStatistics : gameStatistics
            )
        );
        setShow(true);
    }, [newGameStatistics, setAllGameStatistics]);

    useEffect(() => {
        const handleWantToPlayAgain = async (payload: WantToPlayAgainPayload, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "Success", data: {}});

            const {requester} = payload;

            setPlayAgainRequester(requester);
        };

        const handleRejectedPlayAgainRequest = async (_, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "Success", data: {}});
            console.log("reject request");

            if (playAgainRequester?._id === auth?.user?._id) {
                showToast(translation("opponentCancelRequest"), "info");
            }
        };

        socket.on("wantToPlayAgain", handleWantToPlayAgain);
        socket.on("rejectedPlayAgainRequest", handleRejectedPlayAgainRequest);

        return () => {
            socket.off("wantToPlayAgain", handleWantToPlayAgain);
            socket.off("rejectedPlayAgainRequest", handleRejectedPlayAgainRequest);
        };
    }, [auth?.user?._id, playAgainRequester?._id, translation]);

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
                <Card className="relative w-full">
                    {playAgainRequester && (
                        <PlayAgainToast
                            requester={playAgainRequester}
                            onAcceptRequest={handleAcceptRequest}
                            onRejectRequest={handleRejectRequest}
                        />
                    )}

                    <div className="w-full py-8">
                        <div className="flex flex-col items-center gap-8">
                            <div className="w-2/3 sm:w-1/2 mx-auto">
                                <div className="flex justify-center">
                                    <LevelBar
                                        currentGameStatistics={currentGameStatistics.current}
                                        newGameStatistics={newGameStatistics}
                                    />
                                </div>
                            </div>
                            <UserCoin newCoin={newCoin} size="lg" />
                            <div className="flex flex-col gap-2 mx-auto w-max">
                                {!leavedRoom && (
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
