import WebSocketService from "@/services/WebSocketService";
import {useTranslations} from "next-intl";
import {useEffect} from "react";
import PreparingRoomSection from "./PreparingRoomSection";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {selectDeviceInfo} from "@/libs/redux/features/deviceInfo/deviceInfoSlice";
import {selectUser} from "@/libs/redux/features/auth/authSlice";
import {changeShowingScreen, setGameError} from "@/libs/redux/features/inMatchData/inMatchDataSlice";
import {selectBaseMatchInfo} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";

interface Props {
    roomId: string;
}

export default function JoinRoomSection(props: Props) {
    const {roomId} = props;

    const user = useAppSelector(selectUser);
    const {screen} = useAppSelector(selectDeviceInfo);
    const baseMatchInfo = useAppSelector(selectBaseMatchInfo);
    const dispatch = useAppDispatch();
    const translation = useTranslations("page.room");

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

                dispatch(setGameError({error: errorMessage}));
                dispatch(changeShowingScreen({screen: "errorScreen"}));
            } else {
                dispatch(changeShowingScreen({screen: "preparingRoomScreen"}));
            }
        };

        handleJoinRoom();
    }, [dispatch, roomId, screen.availWidth, translation, user._id]);

    if (baseMatchInfo.roomId) return null;

    return <PreparingRoomSection />;
}
