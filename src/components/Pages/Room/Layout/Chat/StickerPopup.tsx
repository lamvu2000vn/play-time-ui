import MyTransition from "@/components/MyTransition";
import {CloseButton} from "@/components/UI";
import {PaidItem} from "@/helpers/shared/interfaces/commonInterface";
import {selectUser} from "@/libs/redux/features/auth/authSlice";
import {useAppSelector} from "@/libs/redux/hooks";
import WebSocketService from "@/services/WebSocketService";
import Image from "next/image";

interface Props {
    show: boolean;
    stickers: PaidItem[];
    onClose: () => void;
}

export default function StickerPopup(props: Props) {
    const {show, stickers, onClose} = props;
    const matchInfo = useAppSelector((state) => state.matchInfo)!;
    const user = useAppSelector(selectUser);

    const handleSendSticker = async (sticker: PaidItem) => {
        await WebSocketService.sendMessageInGame(matchInfo.roomId, {
            sender: user,
            content: sticker.itemId.imageUrl,
            type: "sticker",
        });
    };

    return (
        <MyTransition
            in={show}
            timeout={300}
            className="absolute right-0 bottom-full aspect-[3/4] w-[80%] h-auto rounded-2xl shadow-custom-1 bg-base-100 pt-8 pb-4"
            defaultStyles={{
                opacity: 0,
                transform: "translateY(1rem)",
                transition: "all 300ms ease-in-out",
            }}
            transitionStyles={{
                entering: {opacity: 1, transform: "translateY(0)"},
                entered: {opacity: 1, transform: "translateY(0)"},
                exiting: {opacity: 0, transform: "translateY(1rem)"},
                exited: {opacity: 0, transform: "translateY(1rem)"},
                unmounted: {opacity: 0, transform: "translateY(1rem)"},
            }}
        >
            <div className="px-4 w-full h-full overflow-auto">
                <div className="absolute right-1 top-1">
                    <CloseButton onClose={onClose} />
                </div>
                <div className="columns-2">
                    {stickers.map((sticker, index) => (
                        <div key={index} className="w-full p-2">
                            <div
                                className="cursor-pointer rounded-2xl hover:shadow-custom-1"
                                onClick={() => handleSendSticker(sticker)}
                            >
                                <Image
                                    src={sticker.itemId.imageUrl}
                                    alt="GIF"
                                    width={0}
                                    height={0}
                                    className="w-full"
                                    loading="lazy"
                                    unoptimized={true}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MyTransition>
    );
}
