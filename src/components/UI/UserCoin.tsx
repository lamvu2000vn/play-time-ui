"use client";

import {useAudio} from "@/helpers/hooks";
import {moneyFormat} from "@/helpers/utils/moneyFormat";
import {selectUserCoin, updateUserCoin} from "@/libs/redux/features/auth/authSlice";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {useEffect, useRef, useState} from "react";
import {PiCoinVertical, PiCoinVerticalBold} from "react-icons/pi";

interface Props {
    newCoin?: number;
    size?: "sm" | "md" | "lg";
}

export default function UserCoin(props: Props) {
    const {newCoin, size} = props;
    const userCoin = useAppSelector(selectUserCoin);
    const [currentCoin, setCurrentCoin] = useState<number>(userCoin);
    const [targetCoin, setTargetCoin] = useState<number>(userCoin);
    const audio = useAudio();
    const dispatch = useAppDispatch();

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
                dispatch(
                    updateUserCoin({
                        coin: newCoin!,
                    })
                );
            }
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current); // Hủy animation nếu component unmount
        };
    }, [currentCoin, newCoin, targetCoin, dispatch]);

    useEffect(() => {
        if (newCoin) {
            setTimeout(() => {
                setTargetCoin(newCoin);
                audio.coinUpdate.play();
            }, 4000);
        }
    }, [audio.coinUpdate, newCoin]);

    return (
        <div className="bg-base-100 rounded-2xl">
            {size === "md" ? (
                <div className="pl-2 pr-3 h-10 flex items-center gap-2 border-2 rounded-2xl border-yellow-500 text-yellow-500">
                    <PiCoinVertical className="w-6 h-6" />
                    <div className="text-lg font-semibold">{moneyFormat(currentCoin)}</div>
                </div>
            ) : size === "lg" ? (
                <div className="pl-2 pr-3 h-14 flex items-center gap-2 border-2 rounded-2xl border-yellow-500 text-yellow-500">
                    <PiCoinVertical className="w-10 h-10" />
                    <div className="font-semibold text-2xl">{moneyFormat(currentCoin)}</div>
                </div>
            ) : (
                <div className="h-6 pl-1 pr-2 flex items-center gap-1 border-2 rounded-2xl border-yellow-500 text-yellow-500">
                    <PiCoinVerticalBold />
                    <div className="font-semibold text-xs">{moneyFormat(currentCoin)}</div>
                </div>
            )}
        </div>
    );
}
