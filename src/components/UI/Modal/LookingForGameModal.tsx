import {memo, useCallback, useEffect, useRef, useState} from "react";
import BaseModal from "./BaseModal";
import Image from "next/image";
import WebSocketService from "@/services/WebSocketService";
import {useRecoilState} from "recoil";
import {roomInfoState} from "@/libs/recoil/atom";
import {showToast} from "@/helpers/utils/utils";
import {useTranslations} from "next-intl";
import CancelButton from "../Buttons/CancelButton";

interface Props {
    show: boolean;
    onClose: () => void;
}

export default memo(function LookingForGameModal(props: Props) {
    const {show, onClose} = props;
    const [roomInfo, setRoomInfo] = useRecoilState(roomInfoState);
    const [waitingTime, setWaitingTime] = useState<{minutes: number; seconds: number}>({minutes: 0, seconds: 0});
    const translation = useTranslations("common.modal.lookingForGameModal");

    const maxMinutes = useRef<number>(3);

    const handleCancelLookingForGame = useCallback(async () => {
        if (roomInfo) {
            const {roomId, hostId} = roomInfo;
            await WebSocketService.cancelLookingForQuickMatch(roomId, hostId);
            setRoomInfo(null);
        }

        setWaitingTime({minutes: 0, seconds: 0});
        onClose();
    }, [onClose, roomInfo, setRoomInfo]);

    const formatWaitingTime = (minutes: number, seconds: number): string => {
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (show) {
            timer = setTimeout(() => {
                setWaitingTime((prev) => {
                    if (prev.minutes === maxMinutes.current) return prev;

                    if (prev.seconds === 59) {
                        return {minutes: prev.minutes + 1, seconds: 0};
                    }

                    return {minutes: prev.minutes, seconds: prev.seconds + 1};
                });
            }, 1000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [show, waitingTime]);

    useEffect(() => {
        if (waitingTime.minutes === 1) {
            showToast(translation("lookingForOpponentNotification"), "info");
            return;
        }

        if (waitingTime.minutes === maxMinutes.current) {
            showToast(translation("opponentNotFoundNotification"), "info");
            handleCancelLookingForGame();
            return;
        }
    }, [handleCancelLookingForGame, translation, waitingTime.minutes]);

    return (
        <BaseModal show={show} onClose={onClose}>
            <div className="w-[25rem] flex flex-col items-center gap-6">
                <div className="w-24 py-2 rounded-full bg-base-300 text-center">
                    <span className="font-semibold">{formatWaitingTime(waitingTime.minutes, waitingTime.seconds)}</span>
                </div>
                <div className="flex justify-center">
                    <div className="w-[8rem]">
                        <div className="relative aspect-square">
                            <Image src="/assets/images/GIFs/players-2.gif" alt="image" fill />
                        </div>
                    </div>
                </div>
                <div className="flex items-end gap-2 font-semibold text-xl">
                    <span>{translation("content")}</span>
                    <span className="loading loading-dots loading-sm"></span>
                </div>
                <div className="w-[10rem]">
                    <CancelButton className="w-full" onClick={handleCancelLookingForGame} />
                </div>
            </div>
        </BaseModal>
    );
});
