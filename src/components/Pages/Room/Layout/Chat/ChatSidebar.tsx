import PlaceholderImage from "./PlaceholderImage";
import Chat from "./Chat";
import {useAppSelector} from "@/libs/redux/hooks";
import {selectBaseMatchInfo} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import {selectMessages} from "@/libs/redux/features/inMatchData/inMatchDataSlice";

export default function ChatSidebar() {
    const messages = useAppSelector(selectMessages);
    const matchInfo = useAppSelector((state) => state.matchInfo);
    const baseMatchInfo = useAppSelector(selectBaseMatchInfo)!;
    const {matchStatus} = baseMatchInfo;

    const isShowChat = matchInfo && matchStatus === "progressing";

    return (
        <div className="relative w-full h-full bg-base-100">
            {isShowChat ? <Chat messages={messages} /> : <PlaceholderImage />}
        </div>
    );
}
