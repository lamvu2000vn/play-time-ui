import {memo, useEffect, useState} from "react";
import BaseModal from "./BaseModal";
import {useRecoilState, useRecoilValue} from "recoil";
import {gameListState, gameStatisticsState} from "@/libs/recoil/atom";
import UserService from "@/services/UserService";
import {useAuth} from "@/helpers/hooks/useAuth";
import {FaHandshakeSimple, FaFlag, FaHeart} from "react-icons/fa6";
import {MdStarRate} from "react-icons/md";
import {GiLevelThree} from "react-icons/gi";
import {useTranslations} from "next-intl";

interface Props {
    show: boolean;
    onClose: () => void;
}

export default memo(function StatisticsModal(props: Props) {
    const {show, onClose} = props;
    const [allGameStatistics, setAllGameStatistics] = useRecoilState(gameStatisticsState);
    const gameList = useRecoilValue(gameListState);
    const {auth} = useAuth();
    const [error, setError] = useState<string>("");
    const translation = useTranslations("common.modal.statisticModal");

    useEffect(() => {
        const getGameStatistics = async () => {
            const response = await UserService.getAllGameStatistics(auth.user!._id);

            if (!response || response.status !== 200 || !Object.keys(response.data).length) {
                setError(translation("error.unknown"));
                return;
            }

            const data = response.data;

            setAllGameStatistics(data);
        };

        if (!allGameStatistics.length && auth?.user) {
            getGameStatistics();
        }
    }, [allGameStatistics.length, auth, setAllGameStatistics, translation]);

    let component: React.ReactNode;

    if (error) {
        component = (
            <div className="py-8 px-4">
                <div className="font-semibold text-xl text-center">{error}</div>
            </div>
        );
    } else if (!allGameStatistics.length) {
        component = <Skeleton />;
    } else {
        component = gameList.map((gameInfo) => {
            const gameStatistics = allGameStatistics.find((value) => value.gameInfo._id === gameInfo._id)!;
            const {numOfDraw, numOfLose, numOfWin, scoreStatistics} = gameStatistics;
            const total = numOfDraw + numOfLose + numOfWin;
            const winPercent = Math.round((numOfWin * 100) / total || 0);

            return (
                <div key={gameInfo._id} className="mb-6">
                    <div className="relative w-full bg-base-200 mb-2">
                        <div className="absolute left-0 top-0 w-3 h-full bg-primary"></div>
                        <div className="ml-5">
                            <h1 className="text-xl font-semibold">{gameInfo.name}</h1>
                        </div>
                    </div>
                    <div className="stats">
                        <div className="stat">
                            <div className="stat-figure text-green-500">
                                <FaHeart className="w-6 h-6" />
                            </div>
                            <div className="stat-title">{translation("totalWins")}</div>
                            <div className="stat-value text-green-500">{numOfWin}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-figure text-blue-500">
                                <FaFlag className="w-6 h-6" />
                            </div>
                            <div className="stat-title">{translation("totalLoses")}</div>
                            <div className="stat-value text-blue-500">{numOfLose}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-figure text-orange-500">
                                <FaHandshakeSimple className="w-6 h-6" />
                            </div>
                            <div className="stat-title">{translation("totalDraws")}</div>
                            <div className="stat-value text-orange-500">{numOfDraw}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-figure text-yellow-400">
                                <MdStarRate className="w-6 h-6" />
                            </div>
                            <div className="stat-title">{translation("totalWinRate")}</div>
                            <div className="stat-value text-yellow-400">{winPercent}%</div>
                        </div>
                        <div className="stat">
                            <div className="stat-figure text-pink-500">
                                <GiLevelThree className="w-6 h-6" />
                            </div>
                            <div className="stat-title">{translation("level")}</div>
                            <div className="stat-value text-pink-500">{scoreStatistics.currentLevel}</div>
                        </div>
                    </div>
                </div>
            );
        });
    }

    return (
        <BaseModal show={show} onClose={onClose} closeButton={true} closeByBackdrop>
            <h1 className="text-2xl font-bold mb-8">{translation("title")}</h1>
            {component}
        </BaseModal>
    );
});

function Skeleton() {
    return (
        <div className="w-full">
            <div className="skeleton w-full h-7 mb-4"></div>
            <div className="skeleton w-full h-24"></div>
        </div>
    );
}
