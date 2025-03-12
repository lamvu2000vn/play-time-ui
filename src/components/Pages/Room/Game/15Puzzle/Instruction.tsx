import {useTranslations} from "next-intl";
import {FaArrowDown, FaArrowLeft, FaArrowRight, FaArrowUp} from "react-icons/fa6";

export default function Instruction() {
    const translation = useTranslations("page.room");

    return (
        <div className="flex items-center justify-center gap-8">
            <div className="shrink-0">
                <div className="flex w-full justify-center mb-1">
                    <kbd className="kbd kbd-md text-sm xl:text-base">
                        <FaArrowUp />
                    </kbd>
                </div>
                <div className="flex w-full justify-center gap-1">
                    <kbd className="kbd kbd-md text-sm xl:text-base">
                        <FaArrowLeft />
                    </kbd>
                    <kbd className="kbd kbd-md text-sm xl:text-base">
                        <FaArrowDown />
                    </kbd>
                    <kbd className="kbd kbd-md text-sm xl:text-base">
                        <FaArrowRight />
                    </kbd>
                </div>
            </div>
            <div className="flex-1">
                <div className="break-words font-semibold text-sm xl:text-base">
                    {translation("15PuzzleMoveInstruction")}
                </div>
            </div>
        </div>
    );
}
