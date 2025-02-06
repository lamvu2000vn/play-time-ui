"use client";

import MyError from "@/components/Pages/MyError";
import {LoadingScreen} from "@/components/UI";
import useUserActivation from "@/helpers/hooks/useUserActivation";
import {changeTheme} from "@/helpers/utils/utils";
import {deviceInfoState} from "@/libs/recoil/atom";
import SetupService from "@/services/SetupService";
import {useCallback, useEffect, useState} from "react";
import {useRecoilState} from "recoil";

interface Props {
    children: React.ReactNode;
}

export default function AppSetup(props: Props) {
    const {children} = props;

    const [deviceInfo, setDeviceInfo] = useRecoilState(deviceInfoState);
    const [loading, setLoading] = useState<boolean>(true);
    const [setupSuccess, setSetupSuccess] = useState<boolean>(false);
    const isUserActive = useUserActivation();

    const setup = useCallback(async (): Promise<boolean> => {
        try {
            const [webSocketResult, deviceInfoResult] = await Promise.all([
                SetupService.connectWebsocket(),
                SetupService.initializeDeviceInfo(),
            ]);

            if (!webSocketResult.status || !deviceInfoResult.status) {
                return false;
            }

            const deviceInfo = deviceInfoResult.data!;

            if (deviceInfo.theme) {
                changeTheme(deviceInfo.theme);
            }

            setDeviceInfo(deviceInfo);

            return true;
        } catch (err) {
            console.log("🚀 ~ setup ~ err:", err);

            return false;
        }
    }, [setDeviceInfo]);

    useEffect(() => {
        (async () => {
            const setupResult = await setup();
            setSetupSuccess(setupResult);
            setLoading(false);
        })();
    }, [setup]);

    useEffect(() => {
        if (isUserActive) {
            setDeviceInfo((prevState) => ({
                ...prevState!,
                backgroundMusicVolume: 0.7,
                systemSoundVolume: 0.7,
            }));
        }
    }, [isUserActive, setDeviceInfo]);

    // Handle resize window
    useEffect(() => {
        const handleResizeWindow = () => {
            setDeviceInfo((prevState) => ({
                ...prevState!,
                screen: {
                    width: window.screen.width,
                    height: window.screen.height,
                    availWidth: document.body.clientWidth,
                    availHeight: document.body.clientHeight,
                },
            }));
        };

        window.addEventListener("resize", handleResizeWindow);

        return () => {
            window.removeEventListener("resize", handleResizeWindow);
        };
    }, [deviceInfo, setDeviceInfo]);

    if (loading) return <LoadingScreen />;

    if (!setupSuccess) return <MyError />;

    return children;
}
