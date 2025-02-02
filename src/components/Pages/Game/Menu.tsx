import {Item} from "@/components/UI";
import {GameInfo} from "@/helpers/shared/interfaces/commonInterface";
import {useTranslations} from "next-intl";
import Link from "next/link";
import {FaBook} from "react-icons/fa";
import {HiUsers} from "react-icons/hi";
import {IoEarth} from "react-icons/io5";

interface Props {
    gameInfo: GameInfo;
    onShowGameSetupModal: () => void;
    onQuickMatchStart: () => void;
}

export default function Menu(props: Props) {
    const {gameInfo, onShowGameSetupModal, onQuickMatchStart} = props;
    const translation = useTranslations("page.game.menu");

    // Skeleton
    if (!gameInfo) {
        return (
            <div className="!rounded-box h-full">
                <div className="skeleton w-full h-10 mb-3"></div>
                <div className="skeleton w-full h-10 mb-3"></div>
                <div className="skeleton w-full h-10 mb-3"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-stretch gap-3">
            <Item
                className="py-3 px-5 !rounded-full border-2 border-primary bg-primary transition-transform duration-100 hover:scale-105"
                onClick={onShowGameSetupModal}
            >
                <div className="flex items-center gap-2 max-w-[12rem] mx-auto text-base-100">
                    <HiUsers className="w-6 h-6" />
                    <span>{translation("playWithFriend")}</span>
                </div>
            </Item>
            <Item
                className="py-3 px-5 !rounded-full border-2 border-base-content transition-transform duration-100 hover:scale-105"
                onClick={onQuickMatchStart}
            >
                <div className="flex items-center gap-2 max-w-[12rem] mx-auto">
                    <IoEarth className="w-6 h-6" />
                    <span>{translation("playWithRandom")}</span>
                </div>
            </Item>
            <Link href="/game-instructions">
                <Item className="py-3 px-5 !rounded-full border-2 border-base-content transition-transform duration-100 hover:scale-105">
                    <div className="flex items-center gap-2 max-w-[12rem] mx-auto">
                        <FaBook className="w-6 h-6" />
                        <span>{translation("gameInstructions")}</span>
                    </div>
                </Item>
            </Link>
        </div>
    );
}
