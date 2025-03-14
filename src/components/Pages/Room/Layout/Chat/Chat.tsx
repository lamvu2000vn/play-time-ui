import {ChatContent, PaidItem} from "@/helpers/shared/interfaces/commonInterface";
import EmptyMessage from "./EmptyMessage";
import MyMessage from "./MyMessage";
import OpponentMessage from "./OpponentMessage";
import ChatForm from "./ChatForm";
import {useEffect, useRef, useState} from "react";
import UserService from "@/services/UserService";
import {useAppSelector} from "@/libs/redux/hooks";
import {selectUser} from "@/libs/redux/features/auth/authSlice";

interface Props {
    messages: ChatContent[];
}

export default function Chat(props: Props) {
    const {messages} = props;
    const user = useAppSelector(selectUser);
    const itemTypeList = useAppSelector((state) => state.itemTypeList);
    const [stickers, setStickers] = useState<PaidItem[]>([]);

    const messagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (stickers.length) return;

        (async () => {
            const itemTypeId = itemTypeList.find((itemType) => itemType.alternativeName === "sticker")?._id;

            if (!itemTypeId) return;

            const response = await UserService.getPaidItems(user._id, itemTypeId);

            if (!response || response.status !== 200 || !response.data.length) return;

            setStickers(response.data);
        })();
    }, [itemTypeList, stickers.length, user._id]);

    useEffect(() => {
        const messagesContainer = messagesRef.current!;

        const top = messagesContainer.scrollHeight;

        messagesContainer.scrollTo({
            top,
            left: 0,
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <div className="flex flex-col items-stretch w-full h-full divide-y-2 divide-gray-300">
            <div className="flex-1 overflow-hidden">
                <div className="relative w-full h-full py-4">
                    <div ref={messagesRef} className="w-full h-full overflow-auto px-4">
                        {!messages.length ? (
                            <EmptyMessage />
                        ) : (
                            messages.map((message, index) =>
                                message.sender._id === user._id ? (
                                    <MyMessage key={index} message={message} />
                                ) : (
                                    <OpponentMessage key={index} message={message} />
                                )
                            )
                        )}
                    </div>
                </div>
            </div>
            <div className="shrink-0 basis-16">
                <ChatForm stickers={stickers} />
            </div>
        </div>
    );
}
