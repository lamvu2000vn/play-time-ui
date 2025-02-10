import {useTranslations} from "next-intl";
import {SettingItem} from "./SettingModal";
import LocalStorage from "@/helpers/utils/LocalStorage";
import {changeTheme} from "@/helpers/utils/utils";
import {useRecoilState} from "recoil";
import {backgroundImageState, deviceInfoState} from "@/libs/recoil/atom";
import {BsFillMoonStarsFill, BsSunFill} from "react-icons/bs";
import ImageWithSkeleton from "../../ImageWithSkeleton";
import {useMemo} from "react";
import {BackgroundImageAvailable, Theme} from "@/helpers/shared/types";
import {FaCheck} from "react-icons/fa6";
import {usePathname} from "@/i18n/routing";

export default function SystemSetting() {
    const [deviceInfo, setDeviceInfo] = useRecoilState(deviceInfoState);
    const translation = useTranslations("common.modal.settingModal");
    const {theme} = deviceInfo!;
    const [backgroundImage, setBackgroundImage] = useRecoilState(backgroundImageState);
    const pathname = usePathname();

    const backgroundImages = useMemo<BackgroundImageAvailable[]>(
        () => ["background-1.png", "background-2.png", "background-3.png", "background-4.png", "background-5.png"],
        []
    );

    const handleSwitchTheme = () => {
        const newTheme: Theme = theme === "myLightTheme" ? "myDarkTheme" : "myLightTheme";
        LocalStorage.setTheme(newTheme);
        changeTheme(newTheme);
        setDeviceInfo((prevState) => ({
            ...prevState!,
            theme: newTheme,
        }));
    };

    const handleChangeBackgroundImage = (image: BackgroundImageAvailable) => {
        setBackgroundImage(image);
        LocalStorage.setBackgroundImage(image);
    };

    return (
        <div className="w-full">
            <SettingItem>
                <SettingItem.Label>{translation("theme")}</SettingItem.Label>
                <div className="flex-1 flex justify-end">
                    <div className="w-[8rem]">
                        <SettingItem.Content>
                            <SettingItem.FuncBtn onClickLeft={handleSwitchTheme} onClickRight={handleSwitchTheme}>
                                <div className="w-full flex justify-center text-primary">
                                    {theme === "myDarkTheme" ? (
                                        <BsFillMoonStarsFill className="w-6 h-6" />
                                    ) : (
                                        <BsSunFill className="w-6 h-6" />
                                    )}
                                </div>
                            </SettingItem.FuncBtn>
                        </SettingItem.Content>
                    </div>
                </div>
            </SettingItem>
            {!pathname.includes("/room") && (
                <SettingItem>
                    <div className="w-full flex flex-col items-stretch">
                        <div className="text-base font-semibold mb-4">{translation("backgroundImage")}</div>
                        <div className="grid grid-cols-2 gap-2">
                            {backgroundImages.map((image, index) => (
                                <BackgroundImage
                                    key={index}
                                    image={image}
                                    currentImage={backgroundImage}
                                    order={index + 1}
                                    onChangeImage={handleChangeBackgroundImage}
                                />
                            ))}
                        </div>
                    </div>
                </SettingItem>
            )}
        </div>
    );
}

function BackgroundImage({
    image,
    currentImage,
    order,
    onChangeImage,
}: {
    image: BackgroundImageAvailable;
    currentImage: BackgroundImageAvailable;
    order: number;
    onChangeImage: (image: BackgroundImageAvailable) => void;
}) {
    const translation = useTranslations("common.modal.settingModal");

    const isActive = image === currentImage;
    const activeClasses = isActive ? "border-primary" : "";

    return (
        <div
            className={`relative flex flex-col items-stretch border-2 rounded-lg ${activeClasses}`}
            onClick={() => onChangeImage(image)}
        >
            <div className="w-full aspect-video relative">
                <div className="w-full h-full grayscale">
                    <ImageWithSkeleton src={`/assets/images/backgrounds/${image}`} fill />
                </div>
            </div>
            <div className="w-full h-8 flex items-center justify-center gap-2 border-t-2 text-sm">
                <span className="font-semibold">{translation("image", {number: order})}</span>
                {isActive && (
                    <div className="text-success">
                        <FaCheck />
                    </div>
                )}
            </div>
        </div>
    );
}
