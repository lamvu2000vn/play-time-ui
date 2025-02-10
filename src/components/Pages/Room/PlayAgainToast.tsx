import {ImageWithSkeleton} from "@/components/UI";
import useAudio from "@/helpers/hooks/useAudio";
import {useAuth} from "@/helpers/hooks/useAuth";
import {PlayerInfo, UserInfo} from "@/helpers/shared/interfaces/commonInterface";
import {useTranslations} from "next-intl";
import {useEffect} from "react";
import {FaCheck, FaTimes} from "react-icons/fa";

interface Props {
    requester: PlayerInfo | UserInfo;
    onRejectRequest: () => void;
    onAcceptRequest: () => void;
}

export default function PlayAgainToast(props: Props) {
    const {requester, onRejectRequest, onAcceptRequest} = props;
    const {auth} = useAuth();
    const audio = useAudio();
    const user = auth.user!;
    const translation = useTranslations("page.room");

    useEffect(() => {
        audio.playAgain.play();
    }, [audio.playAgain]);

    if (requester._id === user._id) return null;

    return (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 max-w-full">
            <div className="p-3 w-max max-w-full rounded-box bg-base-100 shadow-custom-1 animate-custom-bounce">
                <div className="flex items-stretch gap-10">
                    <div className="flex items-center gap-2">
                        <div className="aspect-square w-7 rounded-full overflow-hidden flex-shrink-0">
                            <ImageWithSkeleton src={requester.avatarUrl} width={28} height={28} />
                        </div>
                        <div className="text-lg font-semibold">{translation("opponentWantToPlayAgain")}</div>
                    </div>
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="w-10 h-10 rounded-md flex items-center justify-center text-success hover:bg-success hover:text-neutral"
                            onClick={onAcceptRequest}
                        >
                            <FaCheck />
                        </button>

                        <button
                            type="button"
                            className="w-10 h-10 rounded-md flex items-center justify-center text-error hover:bg-error hover:text-neutral"
                            onClick={onRejectRequest}
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
