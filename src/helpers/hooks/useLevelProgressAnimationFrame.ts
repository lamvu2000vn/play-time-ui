import {selectGameStatisticsById, updateUserGameStatistics} from "@/libs/redux/features/auth/authSlice";
import {selectPlayerMatchStatistics} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {useCallback, useEffect, useMemo, useState} from "react";
import {selectGameId} from "@/libs/redux/features/ui/uiSlice";
import useAudio from "./useAudio";
import useNumberAnimationFrame from "./useNumberAnimationFrame";

export default function useLevelProgressAnimationFrame() {
    const gameId = useAppSelector(selectGameId);
    const currentGameStatistics = useAppSelector(selectGameStatisticsById(gameId));
    const newGameStatistics = useAppSelector(selectPlayerMatchStatistics)?.gameStatistics;

    const [level, setLevel] = useState<number>(currentGameStatistics?.level || 0);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [scoreForNextLevel, setScoreForNextLevel] = useState<number>(currentGameStatistics?.scoreForNextLevel || 0);
    const [percentage, setPercentage] = useState<number>(0);
    const [isFinished, setFinished] = useState<boolean>(false);

    const audio = useAudio();

    const totalScoreState = useNumberAnimationFrame(0, totalScore);
    const percentageState = useNumberAnimationFrame(0, percentage);

    const dispatch = useAppDispatch();

    const getLevelPercentage = useCallback(
        (totalScore: number, scoreForNextLevel: number) => Math.min((totalScore * 100) / scoreForNextLevel, 100) || 0,
        []
    );

    const updatedStatistics = useMemo(() => {
        if (!currentGameStatistics || isFinished) return null;

        if (!newGameStatistics) {
            return {
                totalScore: currentGameStatistics.totalScore,
                percentage: getLevelPercentage(
                    currentGameStatistics.totalScore,
                    currentGameStatistics.scoreForNextLevel
                ),
            };
        } else {
            const {scoreForNextLevel: oldScoreForNextLevel, level: oldLevel} = currentGameStatistics;
            const {level: newLevel} = newGameStatistics;
            const newTotalScore = newLevel > oldLevel ? oldScoreForNextLevel : newGameStatistics.totalScore;
            const remainingScore = newTotalScore - oldScoreForNextLevel;

            return {
                totalScore: remainingScore < 0 ? newTotalScore : oldScoreForNextLevel,
                percentage: remainingScore < 0 ? getLevelPercentage(newTotalScore, oldScoreForNextLevel) : 100,
            };
        }
    }, [currentGameStatistics, isFinished, newGameStatistics, getLevelPercentage]);

    const start = useCallback(() => {
        if (!updatedStatistics) return;

        setTotalScore(updatedStatistics.totalScore);
        setPercentage(updatedStatistics.percentage);
    }, [updatedStatistics]);

    useEffect(() => {
        if (newGameStatistics) {
            audio.levelUpdate.play();
        }
    }, [audio.levelUpdate, newGameStatistics]);

    useEffect(() => {
        if (percentageState.value >= 100 && percentageState.status === "completed" && newGameStatistics) {
            audio.levelUp.play();

            setLevel(newGameStatistics.level);
            setTotalScore(newGameStatistics.totalScore);
            setScoreForNextLevel(newGameStatistics.scoreForNextLevel);
            setPercentage(getLevelPercentage(newGameStatistics.totalScore, newGameStatistics.scoreForNextLevel));
        }

        if (percentageState.status === "completed" && newGameStatistics) {
            dispatch(updateUserGameStatistics({newGameStatistics}));
            setFinished(true);
        }
    }, [audio.levelUp, dispatch, getLevelPercentage, newGameStatistics, percentageState.status, percentageState.value]);

    return {
        level,
        totalScoreStep: totalScoreState.value,
        scoreForNextLevel,
        percentageStep: percentageState.value,
        start,
    };
}
