import {Button, Container, DividerBar, Input} from "@/components/UI";
import {FaClipboardCheck, FaCopy} from "react-icons/fa";
import WebSocketService from "@/services/WebSocketService";
import {useTranslations} from "next-intl";
import {usePathname, useRouter} from "@/i18n/routing";
import {useQRCode} from "next-qrcode";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {clearRoomInfo, selectRoomInfo} from "@/libs/redux/features/roomInfo/roomInfoSlice";
import {selectUser} from "@/libs/redux/features/auth/authSlice";
import {useState} from "react";

export default function WaitingRoomSection() {
    const user = useAppSelector(selectUser);
    const roomInfo = useAppSelector(selectRoomInfo)!;
    const [showSuccessCopy, setShowSuccessCopy] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();
    const translation = useTranslations("page.room");
    const {Canvas} = useQRCode();
    const dispatch = useAppDispatch();

    const shareLinkValue = window.location.origin + pathname;

    const handleCopyLink = () => {
        navigator.clipboard
            .writeText(shareLinkValue)
            .then(() => {
                setTimeout(() => {
                    setShowSuccessCopy(false);
                }, 3000);

                setShowSuccessCopy(true);
            })
            .catch((error) => {
                console.log("🚀 ~ handleCopyUserId ~ error:", error);
            });
    };

    const handleClickLeaveRoomBtn = async () => {
        await WebSocketService.leaveRoom({
            roomId: roomInfo.roomId,
            leaverId: user._id,
        });
        router.push("/");
        dispatch(clearRoomInfo());
    };

    return (
        <Container className="w-full h-full flex justify-center items-center">
            <div className="p-8 bg-base-100 rounded-2xl shadow-custom-1">
                <h1 className="text-xl font-semibold mb-6">{translation("shareLinkTitle")}</h1>
                <div className="flex items-stretch gap-2 mb-6">
                    <div className="flex-1">
                        <Input type="text" readOnly value={shareLinkValue} className="w-full !bg-base-100 truncate" />
                    </div>
                    <div className="basis-10 shrink-0">
                        <Button type="button" className="h-full" onClick={handleCopyLink}>
                            {showSuccessCopy ? <FaClipboardCheck /> : <FaCopy />}
                        </Button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="bg-base-100 rounded-2xl overflow-hidden border-2 border-gray-300">
                        <Canvas
                            text={shareLinkValue}
                            options={{
                                errorCorrectionLevel: "M",
                                margin: 4,
                                color: {
                                    dark: "#333",
                                    light: "#fff",
                                },
                            }}
                        />
                    </div>
                </div>
                <DividerBar />
                <div className="flex justify-center">
                    <Button type="button" outlinebutton="true" onClick={handleClickLeaveRoomBtn}>
                        {translation("leaveRoom")}
                    </Button>
                </div>
            </div>
        </Container>
    );
}
