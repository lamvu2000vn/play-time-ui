import {Modal, TransformedHistory} from "@/helpers/shared/interfaces/commonInterface";
import {memo, useEffect, useRef, useState} from "react";
import BaseModal from "./BaseModal";
import {useRecoilValue} from "recoil";
import {gameListState} from "@/libs/recoil/atom";
import TabsContainer from "../TabsContainer";
import UserService from "@/services/UserService";
import {useAuth} from "@/helpers/hooks/useAuth";
import {toLocaleString} from "@/helpers/utils/toLocaleString";
import {transformHistoryData} from "@/helpers/utils/transformHistoryData";
import {MatchResult} from "@/helpers/shared/types";
import ImageWithSkeleton from "../ImageWithSkeleton";
import {Agbalumo} from "next/font/google";
import {useTranslations} from "next-intl";

const agbalumo = Agbalumo({
    subsets: ["latin"],
    display: "swap",
    weight: "400",
});

interface Props extends Modal {
    gameId?: string;
}

export default memo(function HistoryModal(props: Props) {
    const {show, onClose, gameId: gameIdProp} = props;
    const {auth} = useAuth();
    const gameList = useRecoilValue(gameListState);
    const [gameId, setGameId] = useState<string>(gameIdProp || gameList[0]._id);
    const [history, setHistory] = useState<TransformedHistory[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const historyTranslation = useTranslations("common.modal.historyModal");

    const limit = useRef<number>(10);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleChangeTab = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGameId(e.currentTarget.value);
        setCurrentPage(1);
    };

    const handleNextPage = () => setCurrentPage((prevState) => (prevState === totalPage ? prevState : prevState + 1));
    const handlePrevPage = () => setCurrentPage((prevState) => (prevState === 1 ? prevState : prevState - 1));

    useEffect(() => {
        if (show && auth?.user) {
            (async () => {
                const userId = auth.user!._id;

                const response = await UserService.getHistory(userId, gameId, {
                    page: currentPage,
                    limit: limit.current,
                });

                if (!response || Object.keys(response.data).length === 0) {
                    setError(historyTranslation("error.unknown"));
                    return;
                }

                const transformedHistory = transformHistoryData(response.data.history, userId);

                containerRef.current?.scrollTo({
                    left: 0,
                    top: 0,
                    behavior: "smooth",
                });

                setHistory(transformedHistory);
                setTotalPage(response.data.totalPages);
                setLoading(false);
            })();
        }

        return () => {
            setHistory([]);
            setLoading(true);
        };
    }, [auth?.user, currentPage, gameId, historyTranslation, show]);

    useEffect(() => {
        setCurrentPage(1);
    }, [show]);

    return (
        <BaseModal show={show} onClose={onClose} closeButton closeByBackdrop>
            <div className="sm:w-[30rem]">
                <h1 className="text-3xl font-bold mb-8">{historyTranslation("title")}</h1>
                <TabsContainer>
                    <TabsContainer.TabItems>
                        {gameList.map((game, index) => (
                            <TabsContainer.Tab
                                key={index}
                                value={game._id}
                                checked={game._id === gameId}
                                onChange={handleChangeTab}
                                label={game.name}
                            />
                        ))}
                    </TabsContainer.TabItems>
                    <TabsContainer.TabContent>
                        <div ref={containerRef} className="w-full h-[10rem] sm:h-[25rem] overflow-auto">
                            {error ? (
                                <div className="w-full h-full px-4 bg-base-200 rounded-box flex items-center justify-center text-center font-semibold">
                                    {error}
                                </div>
                            ) : loading ? (
                                <div className="w-full h-full px-4 bg-base-200 rounded-box flex items-center justify-center text-center font-semibold">
                                    {historyTranslation("searchingHistory")}
                                </div>
                            ) : !history.length ? (
                                <div className="w-full h-full px-4 bg-base-200 rounded-box flex items-center justify-center text-center font-semibold">
                                    {historyTranslation("noHistoryFound")}
                                </div>
                            ) : (
                                history.map((value, index) => {
                                    const {myScore, opponentScore, myInfo, opponentInfo, drawCount} = value;
                                    const matchResult: MatchResult =
                                        myScore === opponentScore ? "draw" : myScore > opponentScore ? "win" : "lose";
                                    const bgColor =
                                        matchResult === "win"
                                            ? "bg-amber-100"
                                            : matchResult === "lose"
                                            ? "bg-blue-200"
                                            : "bg-gray-100";
                                    const TextColor =
                                        matchResult === "win"
                                            ? "text-amber-600"
                                            : matchResult === "lose"
                                            ? "text-blue-600"
                                            : "text-gray-600";
                                    const totalMatch = myScore + opponentScore + drawCount;

                                    return (
                                        <div
                                            key={index}
                                            className={`px-2 py-4 mb-3 rounded-box ${bgColor} text-neutral`}
                                        >
                                            <div className="w-full flex items-stretch">
                                                <div className="w-0 sm:w-24 overflow-hidden">
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span
                                                            className={`${agbalumo.className} ${TextColor} text-3xl -rotate-[30deg]`}
                                                        >
                                                            {matchResult === "win"
                                                                ? historyTranslation("winLabel")
                                                                : matchResult === "lose"
                                                                ? historyTranslation("loseLabel")
                                                                : historyTranslation("drawLabel")}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex-shrink-0">
                                                    <div className="w-full flex items-stretch gap-2">
                                                        <div className="flex-1 overflow-hidden">
                                                            <div className="w-full flex items-start gap-2">
                                                                <div className="flex-1 overflow-hidden">
                                                                    <div className="w-full flex justify-end">
                                                                        <div className="truncate font-semibold text-base">
                                                                            {myInfo.name}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-end -mt-1">
                                                                        <span className="text-sm font-semibold">
                                                                            {myScore}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="w-0 sm:w-10 flex-shrink-0">
                                                                    <div className="rounded-full w-full h-full aspect-square relative overflow-hidden">
                                                                        <ImageWithSkeleton
                                                                            src={myInfo.avatarUrl}
                                                                            fill
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="basis-[2.5rem] flex-shrink-0">
                                                            <div className="w-full flex justify-center">
                                                                <div className="relative w-7 aspect-square">
                                                                    <ImageWithSkeleton
                                                                        src="/assets/images/versus.png"
                                                                        fill
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-center">
                                                                <div
                                                                    className="tooltip tooltip-bottom"
                                                                    data-tip={historyTranslation("totalMatchesLabel", {
                                                                        totalMatch,
                                                                    })}
                                                                >
                                                                    <div className="badge badge-sm font-semibold border">
                                                                        {totalMatch}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 overflow-hidden">
                                                            <div className="w-full flex items-start gap-2">
                                                                <div className="w-0 sm:w-10 flex-shrink-0">
                                                                    <div className="rounded-full w-full h-full aspect-square relative overflow-hidden">
                                                                        <ImageWithSkeleton
                                                                            src={opponentInfo.avatarUrl}
                                                                            fill
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 overflow-hidden">
                                                                    <div className="w-full flex justify-start">
                                                                        <div className="truncate font-semibold text-base">
                                                                            {opponentInfo.name}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-start -mt-1">
                                                                        <span className="text-sm font-semibold">
                                                                            {opponentScore}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-full flex justify-center mt-4">
                                                        <span className="text-xs font-semibold">
                                                            {toLocaleString(value.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {loading || history.length ? (
                            <Pagination
                                currentPage={currentPage}
                                loading={loading}
                                onPrevPage={handlePrevPage}
                                onNextPage={handleNextPage}
                            />
                        ) : null}
                    </TabsContainer.TabContent>
                </TabsContainer>
            </div>
        </BaseModal>
    );
});

function Pagination({
    currentPage,
    loading,
    onPrevPage,
    onNextPage,
}: {
    currentPage: number;
    loading: boolean;
    onPrevPage: () => void;
    onNextPage: () => void;
}) {
    const historyTranslation = useTranslations("common.modal.historyModal");

    return (
        <div className="mt-8 flex justify-center">
            <div className="join">
                <button className="join-item btn" onClick={onPrevPage}>
                    «
                </button>
                <button className="join-item btn">
                    {loading ? "..." : historyTranslation("pageLabel", {page: currentPage})}
                </button>
                <button className="join-item btn" onClick={onNextPage}>
                    »
                </button>
            </div>
        </div>
    );
}
