import MyTransition from "@/components/MyTransition";
import {ChatContent} from "@/helpers/shared/interfaces/commonInterface";
import Chat from "./Chat";
import {ElementAvailable} from "@/helpers/hooks/useElementShowState";

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
            className="absolute right-0 bottom-full aspect-[3/4] w-[18rem] sm:w-[20rem] md:w-[22rem] mb-4 bg-base-100 shadow-custom-1 rounded-2xl overflow-hidden"
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
