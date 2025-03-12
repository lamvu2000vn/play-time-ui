"use client";

import NotFound from "@/components/Pages/NotFoundPage";
import {use, useEffect, useState} from "react";
import {Card, Container} from "@/components/UI";
import MyTransition from "@/components/MyTransition";
import Ranking from "@/components/Pages/Game/Ranking";
import {GameSetupModal, RequireLargerScreenModal} from "@/components/UI/Modal";
import LookingForGameModal from "@/components/UI/Modal/LookingForGameModal";
import GameIntroduction from "@/components/Pages/Game/GameIntroduction";
import Menu from "@/components/Pages/Game/Menu";
import WebSocketService from "@/services/WebSocketService";
import {fifteenPuzzleDefaultSetup, memoryDefaultSetup, ticTacToeDefaultSetup} from "@/helpers/shared/data";
import {showToast} from "@/helpers/utils/utils";
import {GameAvailable, WSCallbackFunc} from "@/helpers/shared/types";
import socket from "@/libs/socket.io/socket";
import {CreateRoomData} from "@/helpers/shared/interfaces/wsInterface";
import PlayerStatistics from "@/components/Pages/Game/PlayerStatistics";
import {checkScreenWidthValid} from "@/helpers/utils/checkScreenWidthValid";
import {useAppSelector, useAppDispatch} from "@/libs/redux/hooks";
import {selectRoomInfo, setRoomInfo} from "@/libs/redux/features/roomInfo/roomInfoSlice";
import {selectDeviceInfo} from "@/libs/redux/features/deviceInfo/deviceInfoSlice";
import {selectGameInfoByName} from "@/libs/redux/features/gameList/gameListSlice";
import {selectGameStatisticsById, selectUser} from "@/libs/redux/features/auth/authSlice";
import {setGameId} from "@/libs/redux/features/ui/uiSlice";
import {useVisibility} from "@/helpers/hooks";
import {useRouter} from "@/i18n/routing";

interface Props {
    params: Promise<{gameName: string}>;
}

export default function Page(props: Props) {
    const {gameName} = use(props.params);
    const user = useAppSelector(selectUser);
    const gameInfo = useAppSelector(selectGameInfoByName(gameName));
    const gameStatistics = useAppSelector(selectGameStatisticsById(gameInfo?._id));
    const roomInfo = useAppSelector(selectRoomInfo);
    const {screen} = useAppSelector(selectDeviceInfo);
    const [requiredWidth, setRequiredWidth] = useState<number>(0);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {visibility, hide, show} = useVisibility();
    const [showPage, setShowPage] = useState<boolean>(false);

    const isScreenWidthValid = (): boolean => {
        const {isValid, requiredWidth: width} = checkScreenWidthValid(gameInfo!.name, screen.availWidth);

        if (!isValid) {
            setRequiredWidth(width);
            show("requireLargerScreenModal");
            return false;
        }

        return true;
    };

    const handleShowGameSetupModal = () => {
        if (isScreenWidthValid()) {
            show("gameSetupModal");
        }
    };

    const handleQuickMatchStart = async () => {
        if (!isScreenWidthValid() || !gameInfo) return;

        let gameSetup: unknown;

        switch (gameName as GameAvailable) {
            case "Tic Tac Toe":
                gameSetup = ticTacToeDefaultSetup;
                break;
            case "15 Puzzle":
                gameSetup = fifteenPuzzleDefaultSetup;
                break;
            case "Memory":
                gameSetup = memoryDefaultSetup;
                break;
            default:
                gameSetup = ticTacToeDefaultSetup;
        }

        const {status, data} = await WebSocketService.createNewRoom({
            gameId: gameInfo._id,
            hostId: user._id,
            gameSetup,
            type: "Random",
        });

        if (status === "not ok" || Object.keys(data).length === 0) {
            showToast("Không tìm được trận đấu.", "info");
            return;
        }

        dispatch(
            setRoomInfo({
                roomId: data._id,
                hostId: data.hostId,
                joinerId: data.joinerId,
                gameId: data.gameId,
                gameSetup: data.gameSetup,
                matchStatus: data.matchStatus,
                type: data.type,
            })
        );
        show("lookingForGameModal");
    };

    useEffect(() => {
        setShowPage(true);
    }, []);

    useEffect(() => {
        if (gameInfo) {
            dispatch(setGameId({gameId: gameInfo._id}));
        }
    }, [dispatch, gameInfo]);

    useEffect(() => {
        if (
            (roomInfo && roomInfo.type === "PlayWithFriend") ||
            (roomInfo && roomInfo.type === "Random" && roomInfo.hostId !== "" && roomInfo.joinerId !== "")
        ) {
            hide("gameSetupModal");
            return router.push(`/room/${roomInfo.roomId}`);
        }
    }, [hide, roomInfo, router]);

    useEffect(() => {
        const handleQuickMatchFounded = async (payload: CreateRoomData, callback: WSCallbackFunc<object>) => {
            console.log("ok");
            callback({status: "ok", message: "Success", data: payload});

            dispatch(
                setRoomInfo({
                    roomId: payload._id,
                    hostId: payload.hostId,
                    joinerId: payload.joinerId,
                    gameId: payload.gameId,
                    gameSetup: payload.gameSetup,
                    matchStatus: payload.matchStatus,
                    type: payload.type,
                })
            );
            hide("lookingForGameModal");
        };

        socket.on("quickMatchFounded", handleQuickMatchFounded);

        return () => {
            socket.off("quickMatchFounded", handleQuickMatchFounded);
        };
    }, [dispatch, hide]);

    if (!gameInfo || !gameStatistics) return <NotFound />;

    return (
        <>
            <Container>
                <MyTransition
                    in={showPage}
                    timeout={300}
                    defaultStyles={{
                        transform: "translateY(3rem)",
                        opacity: 0,
                        transition: "all 300ms ease-in-out",
                    }}
                    transitionStyles={{
                        entering: {transform: "translateY(0)", opacity: 1},
                        entered: {transform: "translateY(0)", opacity: 1},
                        exiting: {transform: "translateY(3rem)", opacity: 0},
                        exited: {transform: "translateY(3rem)", opacity: 0},
                        unmounted: {transform: "translateY(3rem)", opacity: 0},
                    }}
                >
                    <GameIntroduction gameInfo={gameInfo} />
                    <div className="flex flex-wrap gap-4">
                        <div className="basis-full lg:basis-2/5">
                            <div className="w-full h-full flex flex-col items-stretch">
                                <Card className="mb-4">
                                    <PlayerStatistics gameStatistics={gameStatistics} />
                                </Card>
                                <div className="flex-1 h-full">
                                    <Card className="h-full">
                                        <Menu
                                            gameInfo={gameInfo}
                                            onShowGameSetupModal={handleShowGameSetupModal}
                                            onQuickMatchStart={handleQuickMatchStart}
                                        />
                                    </Card>
                                </div>
                            </div>
                        </div>
                        <div className="basis-full lg:flex-1">
                            <Card>
                                <Ranking gameId={gameInfo._id} />
                            </Card>
                        </div>
                    </div>
                </MyTransition>
            </Container>
            <GameSetupModal
                gameInfo={gameInfo}
                show={visibility.gameSetupModal}
                onClose={() => hide("gameSetupModal")}
            />
            <LookingForGameModal show={visibility.lookingForGameModal} onClose={() => hide("lookingForGameModal")} />
            <RequireLargerScreenModal
                show={visibility.requireLargerScreenModal}
                onClose={() => hide("requireLargerScreenModal")}
                requiredWidth={requiredWidth}
            />
        </>
    );
}
