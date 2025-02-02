import MyTransition from "@/components/MyTransition";
import {ElementAvailable} from "@/helpers/hooks/useElementShowState";
import {ChatContent} from "@/helpers/shared/interfaces/commonInterface";
import Chat from "./Chat";

interface Props {
    id: string;
    show: boolean;
    messages: ChatContent[];
}

export default function ChatBox(props: Props) {
    const {messages, show, id} = props;

    return (
        <MyTransition
            in={show}
            timeout={300}
            className="absolute right-0 bottom-full portrait:aspect-[3/4] landscape:aspect-[4/3] mb-4 portrait:w-[70vw] landscape:w-[50vw] h-auto sm:w-[60vw] bg-base-100 shadow-custom-1 rounded-box overflow-hidden"
            defaultStyles={{
                opacity: 0,
                transform: "translateY(1rem)",
                transition: "transform 300ms ease-in-out, opacity 300ms ease-in-out",
            }}
            transitionStyles={{
                entering: {opacity: 1, transform: "translateY(0)"},
                entered: {opacity: 1, transform: "translateY(0)"},
                exiting: {opacity: 0, transform: "translateY(1rem)"},
                exited: {opacity: 0, transform: "translateY(1rem)"},
                unmounted: {opacity: 0, transform: "translateY(1rem)"},
            }}
        >
            <div
                data-popup-id={id}
                data-popup-element={ElementAvailable.ChatBox}
                className="w-full h-full overflow-hidden"
            >
                <Chat messages={messages} />
            </div>
        </MyTransition>
    );
}
