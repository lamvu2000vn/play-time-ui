import {Button, Container, DividerBar, Input} from "@/components/UI";
import {FaClipboardCheck, FaCopy} from "react-icons/fa";
import {QRCodeCanvas} from "qrcode.react";
import {useEffect, useState} from "react";
import {useAuth} from "@/helpers/hooks/useAuth";
import {useRecoilState} from "recoil";
import {roomInfoState} from "@/libs/recoil/atom";
import WebSocketService from "@/services/WebSocketService";
import {useTranslations} from "next-intl";
import {usePathname, useRouter} from "@/i18n/routing";

export default function WaitingRoomSection() {
    const {auth} = useAuth();
    const [roomInfo, setRoomInfo] = useRecoilState(roomInfoState)!;
    const [showSuccessCopy, setShowSuccessCopy] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();
    const translation = useTranslations("page.room");

    const shareLinkValue = window.location.origin + pathname;

    const handleCopyLink = () => {
        navigator.clipboard
            .writeText(shareLinkValue)
            .then(() => {
                setShowSuccessCopy(true);
            })
            .catch((error) => {
                console.log("🚀 ~ handleCopyUserId ~ error:", error);
            });
    };

    const handleClickLeaveRoomBtn = async () => {
        if (auth && auth.user) {
            await WebSocketService.leaveRoom({
                roomId: roomInfo!.roomId,
                leaverId: auth.user._id,
            });
        }
        setRoomInfo(null);
        router.push("/");
    };

    useEffect(() => {
        let timerId: NodeJS.Timeout;

        if (showSuccessCopy) {
            timerId = setTimeout(() => {
                setShowSuccessCopy(false);
            }, 5000);
        }

        return () => {
            clearTimeout(timerId);
        };
    }, [showSuccessCopy]);

    return (
        <Container className="w-full h-full flex justify-center items-center">
            <div className="p-8 bg-base-100 rounded-box shadow-custom-1">
                <h1 className="text-xl font-semibold mb-6">{translation("shareLinkTitle")}</h1>
                <div className="flex items-stretch gap-2 mb-6">
                    <div className="flex-1">
                        <Input type="text" readOnly value={shareLinkValue} className="w-full !bg-base-100 truncate" />
                    </div>
                    <div className="basis-10 flex-shrink-0">
                        <Button type="button" className="h-full" onClick={handleCopyLink}>
                            {showSuccessCopy ? <FaClipboardCheck /> : <FaCopy />}
                        </Button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="p-3 bg-base-100 rounded-box border-2">
                        <QRCodeCanvas value={shareLinkValue} />
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
