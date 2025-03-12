import {useAudio} from "@/helpers/hooks";
import {useTranslations} from "next-intl";
import {useEffect} from "react";
import {FaTrophy} from "react-icons/fa6";

export default function DrawNotification() {
    const translation = useTranslations("page.room");
    const audio = useAudio();

    useEffect(() => {
        audio.draw.play();
    }, [audio.draw]);

    return (
        <div className="absolute left-0 top-0 z-10 w-full h-24">
            <div className="w-full h-full px-2 flex items-center justify-center gap-3 text-neutral bg-orange-500 shadow-lg shadow-orange-500/70">
                <div className="shrink-0">
                    <FaTrophy className="w-6 h-6" />
                </div>
                <div className="flex justify-center items-center overflow-hidden">
                    <div className="w-full h-full text-xl sm:text-2xl md:test-3xl flex items-center gap-2">
                        <span className="shrink-0 font-semibold">{translation("drawMatch")}</span>
                    </div>
                </div>
                <div className="shrink-0">
                    <FaTrophy className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
