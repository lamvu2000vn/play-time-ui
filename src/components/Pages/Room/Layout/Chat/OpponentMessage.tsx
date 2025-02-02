import {ImageWithSkeleton} from "@/components/UI";
import {ChatContent} from "@/helpers/shared/interfaces/commonInterface";
import Image from "next/image";

interface Props {
    message: ChatContent;
}

export default function OpponentMessage(props: Props) {
    const {message} = props;

    return (
        <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="relative w-10 rounded-full">
                    <ImageWithSkeleton src={message.sender.avatarUrl} fill />
                </div>
            </div>
            {message.type === "message" ? (
                <div className="chat-bubble bg-gray-200 text-neutral">
                    <div className="w-full break-words">{message.content}</div>
                </div>
            ) : (
                <div className="chat-bubble bg-base-100 shadow-custom-1">
                    <div className="w-full">
                        <Image
                            src={process.env.NEXT_PUBLIC_SERVER_URL + message.content}
                            alt="GIF"
                            width={0}
                            height={0}
                            className="w-2/3 mx-auto"
                            loading="lazy"
                            unoptimized={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
