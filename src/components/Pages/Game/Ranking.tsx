import {ImageWithSkeleton} from "@/components/UI";
import {GameRanking} from "@/helpers/shared/interfaces/commonInterface";
import GameService from "@/services/GameService";
import {useEffect, useState} from "react";
import {FaRankingStar} from "react-icons/fa6";
import {TbLaurelWreath1, TbLaurelWreath2, TbLaurelWreath3} from "react-icons/tb";
import QuickGameStatistics from "./QuickGameStatistics";
import {useTranslations} from "next-intl";

interface Props {
    gameId: string;
}

export default function Ranking(props: Props) {
    const {gameId} = props;

    const [loading, setLoading] = useState<boolean>(true);
    const [gameRanking, setGameRanking] = useState<GameRanking[]>([]);
    const translation = useTranslations("page.game.ranking");

    useEffect(() => {
        (async () => {
            const response = await GameService.getRanking(gameId);

            if (response && response.status === 200 && Object.keys(response.data).length) {
                setGameRanking(response.data.ranking);
            }

            setLoading(false);
        })();

        return () => {
            setLoading(true);
            setGameRanking([]);
        };
    }, [gameId]);

    if (loading) return <RankingSkeleton />;

    if (!gameRanking.length) return <EmptyRanking />;

    return (
        <div>
            <h1 className="text-xl font-semibold mb-4">{translation("title")}</h1>
            <div className="w-full h-[20rem] overflow-auto">
                {gameRanking.map((ranking, index) => {
                    const bgColor =
                        index === 0
                            ? "bg-yellow-100"
                            : index === 1
                            ? "bg-slate-100"
                            : index === 2
                            ? "bg-orange-100"
                            : "bg-base-200";

                    return (
                        <div
                            key={index}
                            className={`w-full h-14 flex items-center justify-between rounded-box mb-2 ${bgColor}`}
                        >
                            <div className="w-14 h-14 flex items-center justify-center">
                                {index === 0 ? (
                                    <TbLaurelWreath1 className="w-10 h-10 text-yellow-400" />
                                ) : index === 1 ? (
                                    <TbLaurelWreath2 className="w-10 h-10 text-slate-500" />
                                ) : index === 2 ? (
                                    <TbLaurelWreath3 className="w-10 h-10 text-orange-700" />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <div className="flex-1 flex items-center">
                                <div className="w-6 h-6 relative overflow-hidden rounded-full mr-2">
                                    <ImageWithSkeleton src={ranking.user.avatarUrl} fill />
                                </div>
                                <h1 className="font-semibold mr-2">{ranking.user.name}</h1>
                                <div className="hidden sm:block">
                                    <QuickGameStatistics
                                        numOfDraw={ranking.numOfDraw}
                                        numOfWin={ranking.numOfWin}
                                        numOfLose={ranking.numOfLose}
                                    />
                                </div>
                            </div>
                            <div className="px-2">{ranking.totalScore}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const EmptyRanking = () => {
    return (
        <div>
            <h1 className="text-xl font-semibold mb-4">Bảng xếp hạng</h1>
            <div className="w-full h-48 flex items-center justify-center rounded-lg bg-base-200">
                <div className="flex flex-col items-center gap-3">
                    <FaRankingStar className="w-10 h-10" />
                    <span>Chưa có xếp hạng</span>
                </div>
            </div>
        </div>
    );
};

const RankingSkeleton = () => {
    return (
        <div className="w-full flex flex-col gap-4 items-stretch h-max">
            <div className="w-full h-6 sm:h-8">
                <div className="w-full h-full flex items-center justify-between">
                    <div className="skeleton basis-24 sm:basis-32 h-full"></div>
                    <div className="skeleton basis-24 sm:basis-32 h-full"></div>
                </div>
            </div>
            <div className="flex-1">
                <div className="w-full flex items-stretch gap-4 mb-4">
                    <div className="skeleton rounded-full w-12 h-12 lg:w-14 lg:h-14"></div>
                    <div className="skeleton flex-1 h-12 lg:h-14"></div>
                </div>
                <div className="w-full flex items-stretch gap-4 mb-4">
                    <div className="skeleton rounded-full w-12 h-12 lg:w-14 lg:h-14"></div>
                    <div className="skeleton flex-1 h-12 lg:h-14"></div>
                </div>
            </div>
        </div>
    );
};
