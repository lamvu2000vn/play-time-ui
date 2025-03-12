"use client";

import {selectDeviceInfo} from "@/libs/redux/features/deviceInfo/deviceInfoSlice";
import {useAppSelector} from "@/libs/redux/hooks";
import {useEffect, useRef} from "react";

interface Props {
    children: React.ReactNode;
}

export default function ItemSound(props: Props) {
    const {children} = props;
    const {volume} = useAppSelector(selectDeviceInfo);

    const ref = useRef<HTMLAudioElement>(null);

    const handleMouseEnter = () => {
        const audio = ref.current;

        if (audio && navigator.userActivation.hasBeenActive) {
            audio.play().catch((error) => console.log(error));
        }
    };

    useEffect(() => {
        const audio = ref.current;

        if (audio) {
            audio.muted = false;
            audio.volume = volume.systemSoundVolume;
        }
    }, [volume.systemSoundVolume]);

    return (
        <div onMouseEnter={handleMouseEnter}>
            <audio ref={ref} hidden src="/assets/sounds/swipe-3.mp3" muted />
            {children}
        </div>
    );
}
