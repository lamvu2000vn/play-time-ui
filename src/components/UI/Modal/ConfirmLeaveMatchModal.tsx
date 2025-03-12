import {memo, useRef, useState} from "react";
import BaseModal from "./BaseModal";
import WebSocketService from "@/services/WebSocketService";
import SubmitButton from "../Forms/SubmitButton";
import {useTranslations} from "next-intl";
import CancelButton from "../Buttons/CancelButton";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {selectUser} from "@/libs/redux/features/auth/authSlice";
import {clearRoomInfo} from "@/libs/redux/features/roomInfo/roomInfoSlice";

interface Props {
    show: boolean;
    roomId: string;
    onClose: () => void;
}

const TIME_OUT = 10000; // 10 seconds

export default memo(function ConfirmLeaveMatchModal(props: Props) {
    const {show, roomId, onClose} = props;
    const user = useAppSelector(selectUser);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const translation = useTranslations("common.modal.confirmLeaveMatchModal");
    const dispatch = useAppDispatch();

    const timer = useRef<NodeJS.Timeout | null>(null);

    const handleLeaveRoom = async () => {
        setSubmitting(true);

        timer.current = setTimeout(() => {
            window.location.href = "/";
        }, TIME_OUT);

        const {status, message} = await WebSocketService.leaveRoom({
            roomId,
            leaverId: user._id,
        });

        if (status === "not ok" || message === "Room not found") {
            clearTimeout(timer.current);
            dispatch(clearRoomInfo());
            window.location.href = "/";
            return;
        }

        clearTimeout(timer.current);

        setSubmitting(false);
        onClose();
    };

    return (
        <BaseModal show={show} closeButton onClose={onClose} closeByBackdrop>
            <div className="w-[25rem]">
                <h1 className="text-xl font-semibold">{translation("content")}</h1>
                <div className="mt-10 flex justify-end gap-2">
                    <CancelButton onClick={onClose} />
                    <SubmitButton type="button" className="w-max" isSubmitting={submitting} onClick={handleLeaveRoom} />
                </div>
            </div>
        </BaseModal>
    );
});
