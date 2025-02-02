import {PlayerTurn} from "@/helpers/shared/types";
import {useTranslations} from "next-intl";
import {FaTrophy} from "react-icons/fa6";

interface Props {
    winner: PlayerTurn;
}

export default function WinnerNotification(props: Props) {
    const {winner} = props;

    const translation = useTranslations("page.room");
    const winnerText = winner === "me" ? translation("youWin") : translation("opponentWin");

    return (
        <div className="absolute left-0 top-0 z-10 w-full h-24">
            <div
                className={`w-full h-full px-2 flex items-center justify-center gap-3 text-neutral bg-yellow-400 shadow-lg shadow-yellow-400/70`}
            >
                <div className="flex-shrink-0">
                    <FaTrophy className="w-6 h-6" />
                </div>
                <div className="flex justify-center items-center overflow-hidden">
                    <div className="w-full h-full text-xl sm:text-2xl md:test-3xl flex items-center gap-2">
                        <span className="flex-shrink-0 font-semibold">{winnerText}</span>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <FaTrophy className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
