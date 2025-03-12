"use client";

import MyError from "@/components/Pages/MyError";
import {LoadingScreen} from "@/components/UI";
import {useUserActivation, useWebSocketConnection} from "@/helpers/hooks";
import {DeviceManager} from "@/helpers/utils/classes";
import {changeTheme} from "@/helpers/utils/utils";
import {setDeviceInfo, updateDeviceInfo} from "@/libs/redux/features/deviceInfo/deviceInfoSlice";
import {useAppDispatch} from "@/libs/redux/hooks";
import {useCallback, useEffect, useState} from "react";

interface Props {
    children: React.ReactNode;
}

export default function AppSetup(props: Props) {
    const {children} = props;

    const [loading, setLoading] = useState<boolean>(true);
    const [setupSuccess, setSetupSuccess] = useState<boolean>(false);
    const isUserActive = useUserActivation();
    const transport = useWebSocketConnection();

    const dispatch = useAppDispatch();

    console.log("🚀 ~ AppSetup ~ transport:", transport);

    const setup = useCallback(async (): Promise<boolean> => {
        try {
            const deviceInfo = DeviceManager.getDeviceInfo();

            changeTheme(deviceInfo.theme);
            dispatch(setDeviceInfo(deviceInfo));

            return true;
        } catch (err) {
            console.log("🚀 ~ setup ~ err:", err);

            return false;
        }
    }, [dispatch]);

    useEffect(() => {
        (async () => {
            const setupResult = await setup();
            setSetupSuccess(setupResult);
            setLoading(false);
        })();
    }, [setup]);

    useEffect(() => {
        if (isUserActive) {
            dispatch(
                updateDeviceInfo({
                    volume: {
                        backgroundMusicVolume: 0,
                        systemSoundVolume: 0.5,
                    },
                })
            );
        }
    }, [dispatch, isUserActive]);

    // Handle resize window
    useEffect(() => {
        const handleResizeWindow = () => {
            dispatch(
                updateDeviceInfo({
                    screen: {
                        width: window.screen.width,
                        height: window.screen.height,
                        availWidth: document.body.clientWidth,
                        availHeight: document.body.clientHeight,
                    },
                })
            );
        };

        window.addEventListener("resize", handleResizeWindow);

        return () => {
            window.removeEventListener("resize", handleResizeWindow);
        };
    }, [dispatch]);

    if (loading) return <LoadingScreen />;

    if (!setupSuccess) return <MyError />;

    return children;
}
