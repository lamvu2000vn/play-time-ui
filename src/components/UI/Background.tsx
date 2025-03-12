"use client";

import {selectDeviceInfo} from "@/libs/redux/features/deviceInfo/deviceInfoSlice";
import {useAppSelector} from "@/libs/redux/hooks";

interface Props {
    children: React.ReactNode;
}

export default function Background(props: Props) {
    const {backgroundImage} = useAppSelector(selectDeviceInfo);

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
