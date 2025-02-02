import {SettingType} from "@/helpers/shared/types";
import {FaEarthAmericas, FaHouse, FaVolumeLow} from "react-icons/fa6";
import ItemSound from "../../ItemSound";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import {usePathname} from "@/i18n/routing";

interface Props {
    settingType: SettingType;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SettingSidebar(props: Props) {
    const {onChange, settingType} = props;
    const translation = useTranslations("common.modal.settingModal");
    const [settingDisabled, setSettingDisabled] = useState<SettingType | "">("");
    const pathname = usePathname();

    useEffect(() => {
        if (pathname.includes("/room")) {
            setSettingDisabled("language");
        }

        return () => {
            setSettingDisabled("");
        };
    }, [pathname]);

    return (
        <div className="flex flex-col items-stretch gap-2">
            <ItemSound>
                <input
                    type="radio"
                    hidden
                    className="peer"
                    id="system"
                    disabled={settingDisabled === "system"}
                    name="systemType"
                    value="system"
                    checked={settingType === "system"}
                    onChange={onChange}
                />
                <Label htmlFor="system">
                    <FaHouse />
                    <span className="hidden sm:block">{translation("systemType")}</span>
                </Label>
            </ItemSound>
            <ItemSound>
                <input
                    type="radio"
                    hidden
                    className="peer"
                    id="sound"
                    disabled={settingDisabled === "sound"}
                    name="systemType"
                    value="sound"
                    checked={settingType === "sound"}
                    onChange={onChange}
                />

                <Label htmlFor="sound">
                    <FaVolumeLow />
                    <span className="hidden sm:block">{translation("soundType")}</span>
                </Label>
            </ItemSound>
            <ItemSound>
                <input
                    type="radio"
                    hidden
                    className="peer"
                    id="language"
                    disabled={settingDisabled === "language"}
                    name="systemType"
                    value="language"
                    checked={settingType === "language"}
                    onChange={onChange}
                />
                <Label htmlFor="language">
                    <FaEarthAmericas />
                    <span className="hidden sm:block">{translation("languageType")}</span>
                </Label>
            </ItemSound>
        </div>
    );
}

function Label({htmlFor, children}: {htmlFor: string; children: React.ReactNode}) {
    return (
        <label
            htmlFor={htmlFor}
            className="cursor-pointer w-full h-[3.5rem] px-3 sm:px-0 flex items-center justify-center gap-2 text-base rounded-box hover:bg-base-200
            peer-checked:bg-primary/20 peer-checked:font-semibold peer-disabled:text-base-300 peer-disabled:hover:bg-transparent"
        >
            {children}
        </label>
    );
}
