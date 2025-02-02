import useElementShowState, {ElementAvailable} from "@/helpers/hooks/useElementShowState";
import {ChatContent} from "@/helpers/shared/interfaces/commonInterface";
import {generateRandomString} from "@/helpers/utils/generateRandomString";
import {useEffect, useRef, useState} from "react";
import {BsChat} from "react-icons/bs";
import ChatBox from "../Chat/ChatBox";

interface Props {
    messages: ChatContent[];
}

export default function ChatButton(props: Props) {
    const {messages} = props;

    const {showState, addElement} = useElementShowState();
    const [newMessage, setNewMessage] = useState<boolean>(false);
    const [totalMessages, setTotalMessages] = useState<number>(messages.length);

    const chatBoxId = useRef<string>(generateRandomString());
    const showBoxChat = showState.chatBox[chatBoxId.current]?.show;

    useEffect(() => {
        addElement(ElementAvailable.ChatBox, chatBoxId.current, {show: false});
    }, [addElement]);

    useEffect(() => {
        if (messages.length > totalMessages) {
            setNewMessage(true);
        } else {
            setNewMessage(false);
        }
    }, [messages.length, totalMessages]);

    useEffect(() => {
        if (showBoxChat) {
            setNewMessage(false);
            setTotalMessages(messages.length);
        }
    }, [messages.length, showBoxChat]);

    return (
        <div className="block xl:hidden relative">
            <div
                id={chatBoxId.current}
                data-trigger-popup={ElementAvailable.ChatBox}
                className="cursor-pointer w-7 h-7"
            >
                <BsChat className="w-full h-full" />
                {newMessage && <div className="absolute -right-1 -top-1 badge badge-primary badge-sm"></div>}
            </div>

            <ChatBox id={chatBoxId.current} show={showState.chatBox[chatBoxId.current]?.show} messages={messages} />
        </div>
    );
}
