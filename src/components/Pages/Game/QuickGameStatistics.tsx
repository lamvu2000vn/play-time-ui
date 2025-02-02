import {useTranslations} from "next-intl";
import {FaFlag, FaHeart} from "react-icons/fa";
import {FaHandshakeSimple} from "react-icons/fa6";

interface Props {
    numOfWin: number;
    numOfLose: number;
    numOfDraw: number;
    icon?: boolean;
}

export default function QuickGameStatistics(props: Props) {
    const {numOfDraw, numOfLose, numOfWin, icon} = props;
    const translation = useTranslations("common.gameStatistics");

    return (
        <div className="flex items-center flex-wrap text-xs sm:text-sm">
            <div
                className="tooltip tooltip-bottom text-green-500 font-semibold mr-2"
                data-tip={translation("winTimes", {times: numOfWin})}
            >
                <div className="flex items-center gap-1">
                    {icon && <FaHeart className="w-3 h-3 sm:w-4 sm:h-4" />}
                    <span>{numOfWin}</span>
                </div>
            </div>
            <div
                className="tooltip tooltip-bottom text-blue-500 font-semibold mr-2"
                data-tip={translation("loseTimes", {times: numOfLose})}
            >
                <div className="flex items-center gap-1">
                    {icon && <FaFlag className="w-3 h-3 sm:w-4 sm:h-4" />}
                    <span>{numOfLose}</span>
                </div>
            </div>
            <div
                className="tooltip tooltip-bottom text-orange-500 font-semibold"
                data-tip={translation("drawTimes", {times: numOfDraw})}
            >
                <div className="flex items-center gap-1">
                    {icon && <FaHandshakeSimple className="w-4 h-4 sm:w-5 sm:h-5" />}
                    <span>{numOfDraw}</span>
                </div>
            </div>
        </div>
    );
}
