"use client";

import {Background, Header, Main, Sidebar} from "@/components/UI";
import {SettingModal} from "@/components/UI/Modal";
import HistoryModal from "@/components/UI/Modal/HistoryModal";
import StatisticsModal from "@/components/UI/Modal/StatisticsModal";
import useAudio from "@/helpers/hooks/useAudio";
import useUserActivation from "@/helpers/hooks/useUserActivation";
import useVisibility from "@/helpers/hooks/useVisibility";
import {LG_SCREEN} from "@/helpers/shared/constants";
import {deviceInfoState} from "@/libs/recoil/atom";
import {usePathname} from "next/navigation";
import {useEffect} from "react";
import {useRecoilValue} from "recoil";

interface Props {
    children: React.ReactNode;
}

export default function App(props: Props) {
    const deviceInfo = useRecoilValue(deviceInfoState);
    const {visibility, hide, show} = useVisibility();
    const audio = useAudio();
    const userActivation = useUserActivation();

    const pathname = usePathname();

    // Stop background music when the game is started
    useEffect(() => {
        if (userActivation && pathname.includes("/room")) {
            audio.background.pause();
            return;
        }

        if (userActivation && !audio.background.isPlaying()) {
            audio.background.play(0);
            return;
        }
    }, [audio.background, pathname, userActivation]);

    // Handle show sidebar
    useEffect(() => {
        const isRoomPage = pathname.includes("room");

        if (isRoomPage) {
            hide("sidebar");
            return;
        }

        if (deviceInfo && deviceInfo.screen.availWidth > LG_SCREEN) {
            show("sidebar");
            return;
        }
    }, [deviceInfo, hide, pathname, props, show]);

    return (
        <Background>
            <div className="w-full h-full flex flex-col items-stretch">
                {deviceInfo!.screen.availWidth < LG_SCREEN && (
                    <div className="flex-shrink-0 w-full">
                        <Header />
                    </div>
                )}
                <div className="flex-1 overflow-hidden">
                    <div className="w-full h-full flex items-stretch">
                        <Sidebar />
                        <Main>{props.children}</Main>
                    </div>
                </div>
            </div>
            <SettingModal show={visibility.settingModal} onClose={() => hide("settingModal")} />
            <HistoryModal show={visibility.historyModal} onClose={() => hide("historyModal")} />
            <StatisticsModal show={visibility.statisticsModal} onClose={() => hide("statisticsModal")} />
        </Background>
    );
}
