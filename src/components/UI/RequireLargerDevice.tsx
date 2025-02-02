import {MD_SCREEN} from "@/helpers/shared/constants";
import {PiMonitorArrowUp} from "react-icons/pi";

export default function RequireLargerDevice() {
    return (
        <div className="absolute left-0 top-0 w-full h-full">
            <div className="w-full h-full flex items-center justify-center">
                <div className="px-10 flex flex-col items-center gap-3">
                    <PiMonitorArrowUp className="w-20 h-20" />
                    <span className="text-center">
                        Trò chơi yêu cầu kích thước màn hình lớn hơn, từ {MD_SCREEN}px trở lên
                    </span>
                </div>
            </div>
        </div>
    );
}
