"use client";

import NotFound from "@/components/Pages/NotFoundPage";
import {deviceInfoState, gameListState, gameStatisticsState, roomInfoState} from "@/libs/recoil/atom";
import {useRecoilState, useRecoilValue} from "recoil";
import {useEffect, useState} from "react";
import {Card, Container} from "@/components/UI";
import MyTransition from "@/components/MyTransition";
import Ranking from "@/components/Pages/Game/Ranking";
import {GameSetupModal, RequireLargerScreenModal} from "@/components/UI/Modal";
import LookingForGameModal from "@/components/UI/Modal/LookingForGameModal";
import UserService from "@/services/UserService";
import {useAuth} from "@/helpers/hooks/useAuth";
import GameIntroduction from "@/components/Pages/Game/GameIntroduction";
import Menu from "@/components/Pages/Game/Menu";
import {useRouter} from "next/navigation";
import WebSocketService from "@/services/WebSocketService";
import {ticTacToeDefaultSetup} from "@/helpers/shared/data";
import {showToast} from "@/helpers/utils/utils";
import {GameAvailable, WSCallbackFunc} from "@/helpers/shared/types";
import socket from "@/libs/socket.io/socket";
import {CreateRoomData} from "@/helpers/shared/interfaces/wsInterface";
import PlayerStatistics from "@/components/Pages/Game/PlayerStatistics";
import {checkScreenWidthValid} from "@/helpers/utils/checkScreenWidthValid";

interface Props {
    params: {
        gameName: string;
    };
}

export default function Page(props: Props) {
    const {params} = props;
    const {auth} = useAuth();
    const user = auth.user!;
    const gameList = useRecoilValue(gameListState);
    const [allGameStatistics, setAllGameStatistics] = useRecoilState(gameStatisticsState);
    const [roomInfo, setRoomInfo] = useRecoilState(roomInfoState);
    const {screen} = useRecoilValue(deviceInfoState)!;
    const [error, setError] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const [showGameSetupModal, setShowGameSetupModal] = useState<boolean>(false);
    const [showLookingForGameModal, setShowLookingForGameModal] = useState<boolean>(false);
    const [showRequireLargerScreenModal, setShowRequireLargerScreenModal] = useState<boolean>(false);
    const [requiredWidth, setRequiredWidth] = useState<number>(0);

    const router = useRouter();

    const gameInfo = gameList.find((gameInfo) => gameInfo.alternativeName === params.gameName)!;
    const gameStatistics = allGameStatistics.find((statistics) => statistics.gameInfo._id === gameInfo._id) || null;
    const gameName = gameInfo.name as GameAvailable;

    const isScreenWidthValid = (): boolean => {
        const {isValid, requiredWidth: width} = checkScreenWidthValid(gameName, screen.availWidth);

        if (!isValid) {
            setRequiredWidth(width);
            setShowRequireLargerScreenModal(true);
            return false;
        }

        return true;
    };

    const handleShowGameSetupModal = () => {
        if (isScreenWidthValid()) {
            setShowGameSetupModal(true);
        }
    };
    const handleCloseGameSetupModal = () => setShowGameSetupModal(false);
    const handleShowLookingForGameModal = () => setShowLookingForGameModal(true);
    const handleCloseLookingForGameModal = () => setShowLookingForGameModal(false);

    const handleQuickMatchStart = async () => {
        if (!isScreenWidthValid()!) return;

        const {status, data} = await WebSocketService.createNewRoom({
            gameId: gameInfo._id,
            hostId: user._id,
            gameSetup: ticTacToeDefaultSetup,
            type: "Random",
        });

        if (status === "not ok" || Object.keys(data).length === 0) {
            showToast("Không tìm được trận đấu.", "info");
            return;
        }

        setRoomInfo({
            roomId: data._id,
            hostId: data.hostId,
            joinerId: data.joinerId,
            gameId: data.gameId,
            gameSetup: data.gameSetup,
            matchStatus: data.matchStatus,
            type: data.type,
        });
        handleShowLookingForGameModal();
    };

    useEffect(() => {
        if (
            (roomInfo && roomInfo.type === "PlayWithFriend") ||
            (roomInfo && roomInfo.type === "Random" && roomInfo.hostId !== null && roomInfo.joinerId !== null)
        ) {
            return router.push(`/room/${roomInfo.roomId}`);
        }
    }, [roomInfo, router]);

    useEffect(() => {
        const handleQuickMatchFounded = async (payload: CreateRoomData, callback: WSCallbackFunc<object>) => {
            callback({status: "ok", message: "Success", data: payload});

            setRoomInfo({
                roomId: payload._id,
                hostId: payload.hostId,
                joinerId: payload.joinerId,
                gameId: payload.gameId,
                gameSetup: payload.gameSetup,
                matchStatus: payload.matchStatus,
                type: payload.type,
            });
        };

        socket.on("quickMatchFounded", handleQuickMatchFounded);

        return () => {
            socket.off("quickMatchFounded", handleQuickMatchFounded);
        };
    }, [setRoomInfo]);

    useEffect(() => {
        const getGameStatistics = async () => {
            const response = await UserService.getAllGameStatistics(user._id);

            if (!response || response.status !== 200 || !Object.keys(response.data).length) {
                setError("Không thể tải thống kê trò chơi. Vui lòng tải lại trang hoặc thử lại sau.");
                return;
            }

            const data = response.data;

            setAllGameStatistics(data);
        };

        if (!allGameStatistics.length) {
            getGameStatistics();
        }
    }, [allGameStatistics.length, setAllGameStatistics, user._id]);

    useEffect(() => {
        setShow(true);
    }, []);

    if (!gameInfo) return <NotFound />;

    if (error) return <div>{error}</div>;

    return (
        <>
            <Container>
                <MyTransition
                    in={show}
                    timeout={1000}
                    defaultStyles={{
                        transform: "translateY(3rem)",
                        opacity: 0,
                        transition: "all 1s ease-in-out",
                    }}
                    transitionStyles={{
                        entering: {transform: "translateY(0)", opacity: 1},
                        entered: {transform: "translateY(0)", opacity: 1},
                        exiting: {transform: "translateY(3rem)", opacity: 0},
                        exited: {transform: "translateY(3rem)", opacity: 0},
                        unmounted: {transform: "translateY(3rem)", opacity: 0},
                    }}
                >
                    <GameIntroduction gameInfo={gameInfo} gameStatistics={gameStatistics} />
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
            <GameSetupModal gameInfo={gameInfo} show={showGameSetupModal} onClose={handleCloseGameSetupModal} />
            <LookingForGameModal show={showLookingForGameModal} onClose={handleCloseLookingForGameModal} />
            <RequireLargerScreenModal
                show={showRequireLargerScreenModal}
                onClose={() => setShowRequireLargerScreenModal(false)}
                requiredWidth={requiredWidth}
            />
        </>
    );
}
