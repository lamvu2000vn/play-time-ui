import {ImageWithSkeleton} from "@/components/UI";
import {GameContext} from "@/helpers/contexts";
import {MemoryCardState} from "@/helpers/shared/interfaces/games/memoryInterfaces";
import {baseMatchInfoState, memoryMatchInfoState} from "@/libs/recoil/atom";
import {memo, useContext, useEffect, useRef} from "react";
import {FaStar} from "react-icons/fa6";
import {useRecoilValue} from "recoil";

interface Props {
    index: number;
    cardState: MemoryCardState;
    onCardClick: (index: number) => void;
}

export default memo(function Card(props: Props) {
    const {index, cardState, onCardClick} = props;

    const {matchStatus} = useRecoilValue(baseMatchInfoState)!;
    const {game} = useRecoilValue(memoryMatchInfoState)!;
    const {stopTheMatch} = useContext(GameContext);

    const {card, flipStatus, hidden} = cardState;
    const {specialData} = game;

    const cardRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        if (
            flipStatus === "flipping" ||
            flipStatus === "flipped" ||
            hidden ||
            specialData.currentTurn === "opponent" ||
            stopTheMatch ||
            matchStatus === "completed"
        )
            return;

        onCardClick(index);
    };

    // Handle flip card
    useEffect(() => {
        const card = cardRef.current!;

        if (flipStatus === "flipping" || flipStatus === "flipped") {
            card.style.transform = "rotateY(180deg)";
        } else {
            card.style.transform = "rotateY(0deg)";
        }

        return () => {
            card.style.removeProperty("transform");
        };
    }, [flipStatus]);

    // Handle hidden card
    useEffect(() => {
        const cardParent = cardRef.current!.parentElement as HTMLDivElement;

        if (hidden) {
            setTimeout(() => {
                cardParent.classList.add("invisible");
            }, 500);

            cardParent.style.setProperty("--animate-duration", "500ms");
            cardParent.classList.add("animate__animated", "animate__fadeOutUp");
        }

        return () => {
            cardParent.style.removeProperty("--animate-duration");
            cardParent.classList.remove("invisible", "animate__animated", "animate__fadeOutUp");
        };
    }, [hidden]);

    return (
        <div className="group w-full h-full cursor-pointer select-none [perspective:1000px]" onClick={handleClick}>
            <div
                ref={cardRef}
                className="relative aspect-square w-full h-full transition-all duration-500 [transform-style:preserve-3d]"
            >
                <div className="absolute inset-0">
                    <div className="w-full h-full rounded-lg bg-gray-400 group-hover:bg-gray-500 flex items-center justify-center">
                        <div className="w-4/5 h-4/5 flex items-center justify-center border-[.25rem] border-dashed border-neutral-50 rounded-full">
                            <FaStar className="w-1/2 h-1/2 text-neutral-50" />
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div className="w-full h-full border-2 border-gray-400 bg-base-100 rounded-lg flex items-center justify-center">
                        <div className="w-4/5 h-4/5 relative aspect-square">
                            <ImageWithSkeleton src={card.imageUrl} fill />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
