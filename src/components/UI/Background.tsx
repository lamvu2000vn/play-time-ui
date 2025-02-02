"use client";

import {BackgroundImageAvailable} from "@/helpers/shared/types";
import LocalStorage from "@/helpers/utils/LocalStorage";
import {backgroundImageState} from "@/libs/recoil/atom";
import {useEffect} from "react";
import {useRecoilState} from "recoil";

interface Props {
    children: React.ReactNode;
}

export default function Background(props: Props) {
    const [backgroundImage, setBackgroundImage] = useRecoilState(backgroundImageState);

    useEffect(() => {
        const backgroundImageSaved = LocalStorage.getBackgroundImage();

        if (backgroundImageSaved) setBackgroundImage(backgroundImageSaved as BackgroundImageAvailable);
    }, [setBackgroundImage]);

    return (
        <div className="absolute left-0 top-0 right-0 bottom-0 bg-base-200 overflow-hidden">
            <div
                className="absolute left-0 top-0 right-0 bottom-0 z-10 grayscale opacity-15"
                style={{
                    backgroundImage: `url('/assets/images/backgrounds/${backgroundImage}')`,
                    backgroundSize: "28rem",
                }}
            ></div>
            <div className="relative w-full h-full z-20">{props.children}</div>
        </div>
    );
}
