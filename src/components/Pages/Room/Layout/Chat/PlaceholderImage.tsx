import {PiChatsCircleFill} from "react-icons/pi";

export default function PlaceholderImage() {
    return (
        <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 text-base-content">
                <PiChatsCircleFill className="w-full h-full" />
            </div>
        </div>
    );
}
