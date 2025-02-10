"use client";

import useAudio from "@/helpers/hooks/useAudio";
import {useAuth} from "@/helpers/hooks/useAuth";
import {moneyFormat} from "@/helpers/utils/moneyFormat";
import {useEffect, useRef, useState} from "react";
import {PiCoinVertical, PiCoinVerticalBold} from "react-icons/pi";

interface Props {
    newCoin?: number;
    size?: "sm" | "md" | "lg";
}

export default function UserCoin(props: Props) {
    const {newCoin, size} = props;
    const {auth, setAuth} = useAuth();
    const [currentCoin, setCurrentCoin] = useState<number>(auth?.user ? auth.user.coin : 0);
    const [targetCoin, setTargetCoin] = useState<number>(auth?.user ? auth.user.coin : 0);
    const audio = useAudio();

    const animationRef = useRef<number>(0);

    useEffect(() => {
        const animateCoin = () => {
            const step = Math.ceil((targetCoin - currentCoin) / 5000); // Tính bước tăng
            setCurrentCoin((prevCoin) => prevCoin + step); // Cập nhật tiền
        };

        if (newCoin) {
            if (currentCoin < targetCoin) {
                animationRef.current = requestAnimationFrame(animateCoin);
            } else {
                setAuth((prevState) => ({
                    ...prevState!,
                    user: {
                        ...prevState!.user!,
                        coin: newCoin!,
                    },
                }));
            }
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current); // Hủy animation nếu component unmount
        };
    }, [currentCoin, newCoin, setAuth, targetCoin]);

    useEffect(() => {
        if (newCoin) {
            setTimeout(() => {
                setTargetCoin(newCoin);
                audio.coinUpdate.play();
            }, 2000);
        }
    }, [audio.coinUpdate, newCoin]);

    return (
        <div className="bg-base-100 rounded-box">
            {size === "md" ? (
                <div className="pl-2 pr-3 h-10 flex items-center gap-2 border-2 rounded-box border-yellow-500 text-yellow-500">
                    <PiCoinVertical className="w-6 h-6" />
                    <div className="text-lg font-semibold">{moneyFormat(currentCoin)}</div>
                </div>
            ) : size === "lg" ? (
                <div className="pl-2 pr-3 h-14 flex items-center gap-2 border-2 rounded-box border-yellow-500 text-yellow-500">
                    <PiCoinVertical className="w-10 h-10" />
                    <div className="font-semibold text-2xl">{moneyFormat(currentCoin)}</div>
                </div>
            ) : (
                <div className="h-6 pl-1 pr-2 flex items-center gap-1 border-2 rounded-box border-yellow-500 text-yellow-500">
                    <PiCoinVerticalBold />
                    <div className="font-semibold text-xs">{moneyFormat(currentCoin)}</div>
                </div>
            )}
        </div>
    );
}
