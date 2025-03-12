import {useEffect, useState} from "react";

export interface NumberAnimationFrame {
    value: number;
    status: "idle" | "pending" | "completed";
}

export default function useNumberAnimationFrame(start: number, end: number): NumberAnimationFrame {
    const [state, setState] = useState<NumberAnimationFrame>({
        value: start,
        status: "idle",
    });

    useEffect(() => {
        let animationFrame: number;

        const updateStep = () => {
            setState((prevStep) => {
                if (prevStep.value >= end) {
                    cancelAnimationFrame(animationFrame);
                    return {
                        value: end,
                        status: "completed",
                    };
                }

                return {
                    value: prevStep.value + 1,
                    status: "pending",
                };
            });
            animationFrame = requestAnimationFrame(updateStep);
        };

        // Bắt đầu animation
        animationFrame = requestAnimationFrame(updateStep);

        return () => cancelAnimationFrame(animationFrame);
    }, [end]);

    return state;
}
