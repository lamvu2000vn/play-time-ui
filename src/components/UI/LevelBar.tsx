"use client";

import {useLevelProgressAnimationFrame} from "@/helpers/hooks";
import {selectPlayerMatchStatistics} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import {useAppSelector} from "@/libs/redux/hooks";
import {useEffect} from "react";

export default function LevelBar() {
    const newGameStatistics = useAppSelector(selectPlayerMatchStatistics)?.gameStatistics;
    const {level, percentageStep, scoreForNextLevel, start, totalScoreStep} = useLevelProgressAnimationFrame();

    useEffect(() => {
        setTimeout(
            () => {
                start();
            },
            newGameStatistics ? 2000 : 0
        );
    }, [newGameStatistics, start]);

    return (
        <div className="relative w-full h-4 rounded-lg bg-base-300">
            <div className="absolute left-0 top-0 right-8 h-full">
                <div
                    className="absolute z-10 left-0 top-0 h-full rounded-lg bg-primary overflow-hidden"
                    style={{
                        width: `${percentageStep}%`,
                    }}
                ></div>
                <div className="absolute z-20 left-2 top-0 h-full flex items-center font-semibold text-xs text-neutral leading-0">
                    {totalScoreStep}/{scoreForNextLevel}
                </div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                <div
                    className="flex items-center justify-center w-8 h-8 bg-primary"
                    style={{
                        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                >
                    <span className="text-sm font-bold text-neutral">{level}</span>
                </div>
            </div>
        </div>
    );
}
