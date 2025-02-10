"use client";

import useAudio from "@/helpers/hooks/useAudio";
import {GameStatistics} from "@/helpers/shared/interfaces/commonInterface";
import {useEffect, useState} from "react";

interface Props {
    currentGameStatistics: GameStatistics;
    newGameStatistics?: GameStatistics;
}

export default function LevelBar(props: Props) {
    const {newGameStatistics} = props;
    const [currentGameStatistics, SetCurrentGameStatistics] = useState<GameStatistics>(props.currentGameStatistics);
    const [percentStep, setPercentStep] = useState<number>(0);
    const audio = useAudio();

    useEffect(() => {
        // Xác định tổng điểm và phần trăm mục tiêu
        const totalScore = newGameStatistics ? newGameStatistics.totalScore : currentGameStatistics.totalScore;
        const targetPercent = Math.min(
            (totalScore * 100) / currentGameStatistics.scoreStatistics.scoreForNextLevel,
            100
        );

        if (newGameStatistics) {
            audio.levelUpdate.play();
        }

        // Hàm cập nhật tiến trình mượt mà
        let animationFrame: number;
        const updateStep = () => {
            setPercentStep((prevStep) => {
                if (prevStep >= targetPercent) {
                    cancelAnimationFrame(animationFrame);
                    return targetPercent; // Dừng khi đạt mục tiêu
                }
                return prevStep + 1; // Tăng 1 mỗi frame
            });
            animationFrame = requestAnimationFrame(updateStep);
        };

        // Bắt đầu animation
        animationFrame = requestAnimationFrame(updateStep);

        return () => cancelAnimationFrame(animationFrame); // Cleanup nếu component unmount
    }, [audio.levelUpdate, currentGameStatistics, newGameStatistics]);

    useEffect(() => {
        // Khi đạt 100% và có newGameStatistics, reset và cập nhật
        if (percentStep === 100 && newGameStatistics) {
            setPercentStep(0);
            SetCurrentGameStatistics(newGameStatistics);
            audio.levelUp.play();
        }
    }, [audio.levelUp, newGameStatistics, percentStep]);

    return (
        <div className="relative w-full h-4 rounded-lg bg-base-300">
            <div className="absolute left-0 top-0 right-8 h-full">
                <div
                    className="absolute z-10 left-0 top-0 h-full rounded-lg bg-primary overflow-hidden"
                    style={{
                        width: `${percentStep}%`,
                    }}
                ></div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                <div
                    className="flex items-center justify-center w-8 h-8 bg-primary"
                    style={{
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                >
                    <span className="text-sm font-bold text-neutral">
                        {currentGameStatistics.scoreStatistics.currentLevel}
                    </span>
                </div>
            </div>
        </div>
    );
}
