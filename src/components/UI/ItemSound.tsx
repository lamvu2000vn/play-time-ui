"use client";

import {deviceInfoState} from "@/libs/recoil/atom";
import {useEffect, useRef} from "react";
import {useRecoilValue} from "recoil";

interface Props {
    children: React.ReactNode;
}

export default function ItemSound(props: Props) {
    const {children} = props;
    const {systemSoundVolume} = useRecoilValue(deviceInfoState)!;

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
            audio.volume = systemSoundVolume;
        }
    }, [systemSoundVolume]);

    return (
        <div onMouseEnter={handleMouseEnter}>
            <audio ref={ref} hidden src="/assets/sounds/swipe-3.mp3" muted />
            {children}
        </div>
    );
}
