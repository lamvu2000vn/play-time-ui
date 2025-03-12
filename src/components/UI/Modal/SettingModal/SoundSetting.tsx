import {SettingItem} from "./SettingModal";
import {useTranslations} from "next-intl";
import {useAppDispatch, useAppSelector} from "@/libs/redux/hooks";
import {selectDeviceInfo, updateDeviceInfo} from "@/libs/redux/features/deviceInfo/deviceInfoSlice";

export default function SoundSetting() {
    const deviceInfo = useAppSelector(selectDeviceInfo);
    const dispatch = useAppDispatch();
    const translation = useTranslations("common.modal.settingModal");

    const handleChangeBackgroundVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
            updateDeviceInfo({
                volume: {
                    backgroundMusicVolume: +e.currentTarget.value,
                    systemSoundVolume: deviceInfo.volume.systemSoundVolume,
                },
            })
        );
    };

    const handleChangeSystemVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
            updateDeviceInfo({
                volume: {
                    systemSoundVolume: +e.currentTarget.value,
                    backgroundMusicVolume: deviceInfo.volume.backgroundMusicVolume,
                },
            })
        );
    };

    return (
        <div className="w-full">
            <SettingItem>
                <SettingItem.Label>{translation("BackgroundMusicVolume")}</SettingItem.Label>
                <SettingItem.Content>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={deviceInfo.volume.backgroundMusicVolume}
                        className="range range-primary range-xs"
                        onChange={handleChangeBackgroundVolume}
                    />
                </SettingItem.Content>
            </SettingItem>
            <SettingItem>
                <SettingItem.Label>{translation("SystemSoundVolume")}</SettingItem.Label>
                <SettingItem.Content>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={deviceInfo.volume.systemSoundVolume}
                        className="range range-primary range-xs"
                        onChange={handleChangeSystemVolume}
                    />
                </SettingItem.Content>
            </SettingItem>
        </div>
    );
}
