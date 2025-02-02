import {useRecoilState} from "recoil";
import {SettingItem} from "./SettingModal";
import {deviceInfoState} from "@/libs/recoil/atom";
import {useTranslations} from "next-intl";

export default function SoundSetting() {
    const [deviceInfo, setDeviceInfo] = useRecoilState(deviceInfoState);
    const translation = useTranslations("common.modal.settingModal");

    const handleChangeBackgroundVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeviceInfo((prevState) => ({
            ...prevState!,
            backgroundMusicVolume: +e.currentTarget.value,
        }));
    };

    const handleChangeSystemVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeviceInfo((prevState) => ({
            ...prevState!,
            systemSoundVolume: +e.currentTarget.value,
        }));
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
                        value={deviceInfo?.backgroundMusicVolume}
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
                        value={deviceInfo!.systemSoundVolume}
                        className="range range-primary range-xs"
                        onChange={handleChangeSystemVolume}
                    />
                </SettingItem.Content>
            </SettingItem>
        </div>
    );
}
