import {Button, SettingButton} from "@/components/UI";
import ConfirmLeaveRoomModal from "@/components/UI/Modal/ConfirmLeaveMatchModal";
import {useState} from "react";
import {MdLogout} from "react-icons/md";
import {useTranslations} from "next-intl";
import ChatButton from "./ChatButton";
import {useAppSelector} from "@/libs/redux/hooks";
import {selectBaseMatchInfo} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import {selectMessages} from "@/libs/redux/features/inMatchData/inMatchDataSlice";

export default function NavBar() {
    const messages = useAppSelector(selectMessages);
    const baseMatchInfo = useAppSelector(selectBaseMatchInfo)!;
    const [showConfirmLeaveRoomModal, setShowConfirmLeaveRoomModal] = useState<boolean>(false);
    const translation = useTranslations("page.room");

    return (
        <>
            <div className="w-full h-full bg-base-100">
                <div className="w-full h-full flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            outlinebutton="true"
                            className="!px-2 !py-1 flex items-center gap-2"
                            onClick={() => setShowConfirmLeaveRoomModal(true)}
                        >
                            <MdLogout />
                            {translation("leaveRoom")}
                        </Button>
                        <SettingButton width={48} height={48} />
                    </div>
                    <ChatButton messages={messages} />
                </div>
            </div>
            {baseMatchInfo && (
                <ConfirmLeaveRoomModal
                    show={showConfirmLeaveRoomModal}
                    roomId={baseMatchInfo.roomId}
                    onClose={() => setShowConfirmLeaveRoomModal(false)}
                />
            )}
        </>
    );
}
