import {useAudio} from "@/helpers/hooks";
import {showToast} from "@/helpers/utils/utils";
import {selectMatchInfo} from "@/libs/redux/features/matchInfo/matchInfoSlice";
import {useAppSelector} from "@/libs/redux/hooks";
import WebSocketService from "@/services/WebSocketService";
import {useTranslations} from "next-intl";
import {useEffect} from "react";
import {FaCheck, FaTimes} from "react-icons/fa";

export default function PlayAgainToast() {
    const audio = useAudio();
    const matchInfo = useAppSelector(selectMatchInfo);
    const translation = useTranslations("page.room");

    const handleAcceptRequest = async () => {
        const {status} = await WebSocketService.acceptPlayAgainRequest({
            roomId: matchInfo!.roomId,
        });

        if (status === "not ok") {
            showToast(translation("error.playAgainFailure"), "info");
        }
    };

    const handleRejectRequest = async () => {
        await WebSocketService.rejectPlayAgainRequest({
            roomId: matchInfo!.roomId,
        });
    };

    useEffect(() => {
        audio.playAgain.play();
    }, [audio.playAgain]);

    return (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 max-w-full">
            <div className="p-3 w-max max-w-full rounded-2xl bg-base-100 shadow-custom-1 animate-custom-bounce">
                <div className="flex items-stretch gap-10">
                    <div className="flex items-center">
                        <div className="text-lg font-semibold">{translation("opponentWantToPlayAgain")}</div>
                    </div>
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="w-10 h-10 rounded-md flex items-center justify-center text-success hover:bg-success hover:text-neutral"
                            onClick={handleAcceptRequest}
                        >
                            <FaCheck />
                        </button>

                        <button
                            type="button"
                            className="w-10 h-10 rounded-md flex items-center justify-center text-error hover:bg-error hover:text-neutral"
                            onClick={handleRejectRequest}
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
