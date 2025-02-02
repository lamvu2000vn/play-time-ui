import {useAuth} from "@/helpers/hooks/useAuth";
import WebSocketService from "@/services/WebSocketService";
import {useTranslations} from "next-intl";
import {useEffect} from "react";
import PreparingRoomSection from "./PreparingRoomSection";
import {Screen} from "@/app/[locale]/room/[roomId]/page";
import {useRecoilValue} from "recoil";
import {deviceInfoState} from "@/libs/recoil/atom";

interface Props {
    roomId: string;
    onError: (error: string) => void;
    onChangeScreen: (screen: Screen) => void;
}

export default function JoinRoomSection(props: Props) {
    const {roomId, onError, onChangeScreen} = props;

    const {auth} = useAuth();
    const {screen} = useRecoilValue(deviceInfoState)!;
    const translation = useTranslations("page.room");
    const user = auth.user!;

    useEffect(() => {
        const handleJoinRoom = async () => {
            const {status, message} = await WebSocketService.joinRoom(roomId, user._id, screen.availWidth);

            if (status === "not ok") {
                let errorMessage: string;

                switch (message) {
                    case "Room not found":
                        errorMessage = translation("error.roomNotFound");
                        break;
                    case "Screen size not supported":
                        errorMessage = translation("error.screenSizeNotSupported");
                        break;
                    default:
                        errorMessage = translation("error.unknown");
                }

                onError(errorMessage);
            } else {
                onChangeScreen("preparingRoomScreen");
            }
        };

        handleJoinRoom();
    }, [onChangeScreen, onError, roomId, screen.availWidth, translation, user._id]);

    return <PreparingRoomSection />;
}
