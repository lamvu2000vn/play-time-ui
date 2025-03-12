import {Card, ImageWithSkeleton} from "@/components/UI";
import {GameInfo} from "@/helpers/shared/interfaces/commonInterface";
import {GameAvailable} from "@/helpers/shared/types";
import {useTranslations} from "next-intl";

interface Props {
    gameInfo?: GameInfo;
}

export default function GameIntroduction(props: Props) {
    const {gameInfo} = props;
    const translation = useTranslations("page.game");

    // Skeleton
    if (!gameInfo) {
        return (
            <div className="w-full flex mb-4">
                <div className="basis-1/5">
                    <div className="aspect-square">
                        <div className="skeleton w-full h-full"></div>
                    </div>
                </div>
                <div className="basis-4/5 pl-3">
                    <div className="skeleton w-full h-full"></div>
                </div>
            </div>
        );
    }

    const gameName = gameInfo.name as GameAvailable;

    return (
        <Card className="w-full flex items-stretch mb-4">
            <div className="h-24 w-24 sm:h-28 sm:w-28">
                <div className="h-full w-full relative aspect-square">
                    <ImageWithSkeleton src={gameInfo.imageUrl} fill={true} />
                </div>
            </div>
            <div className="flex-1 h-full ml-2 sm:ml-4">
                <div className="w-full h-full flex flex-col items-stretch justify-between gap-2">
                    <h1 className="text-lg sm:text-3xl md:text-4xl font-bold">{gameName}</h1>
                    <div className="w-full break-words text-justify">
                        {gameName === "Tic Tac Toe"
                            ? translation("ticTacToe.description")
                            : gameName === "15 Puzzle"
                            ? translation("fifteenPuzzle.description")
                            : gameName === "Memory"
                            ? translation("memory.description")
                            : ""}
                    </div>
                </div>
            </div>
        </Card>
    );
}
