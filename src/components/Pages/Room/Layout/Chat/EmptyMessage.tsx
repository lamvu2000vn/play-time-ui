import {useTranslations} from "next-intl";
import {AiOutlineMessage} from "react-icons/ai";

export default function EmptyMessage() {
    const translation = useTranslations("page.room");

    return (
        <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-base-content/70">
                <AiOutlineMessage className="w-20 h-20 sm:w-32 sm:h-32" />
                <h1 className="text-base sm:text-lg font-semibold">{translation("sendFirstMessageTitle")}</h1>
            </div>
        </div>
    );
}
