import {useRecoilValue} from "recoil";
import PlaceholderImage from "./PlaceholderImage";
import {baseMatchInfoState, matchInfoState} from "@/libs/recoil/atom";
import Chat from "./Chat";
import {useContext} from "react";
import {GameContext} from "@/helpers/contexts";

export default function ChatSidebar() {
    const {messages} = useContext(GameContext);

    const matchInfo = useRecoilValue(matchInfoState);
    const baseMatchInfo = useRecoilValue(baseMatchInfoState)!;
    const {matchStatus} = baseMatchInfo;

    const isShowChat = matchInfo && matchStatus === "progressing";

    return (
        <div className="relative w-full h-full bg-base-100">
            {isShowChat ? <Chat messages={messages} /> : <PlaceholderImage />}
        </div>
    );
}
