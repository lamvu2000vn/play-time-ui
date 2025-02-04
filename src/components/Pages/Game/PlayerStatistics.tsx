import {LevelBar} from "@/components/UI";
import QuickGameStatistics from "./QuickGameStatistics";
import {GameStatistics} from "@/helpers/shared/interfaces/commonInterface";
import {MdHistory} from "react-icons/md";
import {useTranslations} from "next-intl";
import useVisibility from "@/helpers/hooks/useVisibility";

interface Props {
    gameStatistics: GameStatistics | null;
}

export default function PlayerStatistics(props: Props) {
    const {gameStatistics} = props;
    const translation = useTranslations("common.gameStatistics");
    const {show} = useVisibility();

    if (!gameStatistics) {
        return <div className="w-full h-5 skeleton"></div>;
    }

    return (
        <div className="w-full h-full flex flex-col items-stretch justify-between gap-3">
            <LevelBar currentGameStatistics={gameStatistics} />
            <div className="flex items-center flex-wrap text-sm sm:text-base gap-2">
                <QuickGameStatistics
                    numOfDraw={gameStatistics.numOfDraw}
                    numOfWin={gameStatistics.numOfWin}
                    numOfLose={gameStatistics.numOfLose}
                    icon
                />
                <div
                    className="cursor-pointer flex items-center gap-1 font-semibold text-xs sm:text-sm"
                    onClick={() => show("historyModal")}
                >
                    <MdHistory className="w-4 h-4" />
                    <span>{translation("history")}</span>
                </div>
            </div>
        </div>
    );
}
