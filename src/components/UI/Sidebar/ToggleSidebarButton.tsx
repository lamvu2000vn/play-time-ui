import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";

interface Props {
    isExpand: boolean;
    onToggle: () => void;
}

export default function ToggleSidebarButton(props: Props) {
    const xPosition = props.isExpand ? "right-0" : "left-full";
    const rounded = props.isExpand ? "rounded-tl-lg rounded-bl-lg" : "rounded-tr-lg rounded-br-lg";

    return (
        <div
            className={`absolute top-1/2 -translate-y-1/2 z-10 bg-primary cursor-pointer ${xPosition} ${rounded}`}
            onClick={props.onToggle}
        >
            <div className="flex items-center justify-center w-6 h-10 text-neutral">
                {props.isExpand ? <IoIosArrowBack className="w-5 h-5" /> : <IoIosArrowForward className="w-5 h-5" />}
            </div>
        </div>
    );
}
