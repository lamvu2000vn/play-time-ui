import {useTranslations} from "next-intl";
import {memo, useEffect, useState} from "react";
import BaseModal from "../BaseModal";
import {IoMdArrowDropleft, IoMdArrowDropright} from "react-icons/io";
import SettingsSidebar from "./SettingSidebar";
import {SettingType} from "@/helpers/shared/types";
import SystemSetting from "./SystemSetting";
import SoundSetting from "./SoundSetting";
import LanguageSetting from "./LanguageSetting";

interface Props {
    show: boolean;
    onClose: () => void;
}

export default memo(function SettingModal(props: Props) {
    const {show, onClose} = props;

    const [settingType, setSettingType] = useState<SettingType>("system");
    const translation = useTranslations("common.modal.settingModal");

    const handleChangeSettingType = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettingType(e.currentTarget.value as SettingType);
    };

    useEffect(() => {
        return () => {
            setSettingType("system");
        };
    }, [show]);

    return (
        <BaseModal show={show} onClose={onClose} closeButton closeByBackdrop>
            <div className="sm:w-[32rem]">
                <h1 className="font-semibold text-3xl mb-10 text-center">{translation("title")}</h1>
                <div className="w-full flex items-stretch">
                    <div className="basis-auto sm:basis-[9rem] border-r-4 border-r-primary pr-4">
                        <SettingsSidebar onChange={handleChangeSettingType} settingType={settingType} />
                    </div>
                    <div className="flex-1 sm:h-[18rem] pl-10 pr-4 overflow-auto">
                        {settingType === "system" ? (
                            <SystemSetting />
                        ) : settingType === "sound" ? (
                            <SoundSetting />
                        ) : settingType === "language" ? (
                            <LanguageSetting />
                        ) : null}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
});

export function SettingItem({children}: {children: React.ReactNode}) {
    return <div className="w-full min-h-14 py-4 box-border flex items-center text-base border-b">{children}</div>;
}

export function Label({children}: {children: React.ReactNode}) {
    return (
        <div className="flex-shrink-0 min-w-[8rem] w-max h-full flex items-center justify-start text-base font-semibold">
            {children}
        </div>
    );
}

export function Content({children}: {children: React.ReactNode}) {
    return <div className="flex-1 flex items-center">{children}</div>;
}

export function FuncBtn({
    children,
    onClickLeft,
    onClickRight,
}: {
    children: React.ReactNode;
    onClickLeft: () => void;
    onClickRight: () => void;
}) {
    return (
        <>
            <div className="flex-shrink-0 mr-3 cursor-pointer text-primary" onClick={onClickLeft}>
                <IoMdArrowDropleft className="w-6 h-6" />
            </div>
            <div className="flex-1 flex items-center w-full">{children}</div>
            <div className="flex-shrink-0 ml-3 cursor-pointer text-primary" onClick={onClickRight}>
                <IoMdArrowDropright className="w-6 h-6" />
            </div>
        </>
    );
}

SettingItem.Label = Label;
SettingItem.Content = Content;
SettingItem.FuncBtn = FuncBtn;
