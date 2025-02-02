"use client";

import {generateRandomString} from "@/helpers/utils/generateRandomString";
import SidebarItem from "./SidebarItem";
import {IoChatbubbleSharp, IoStorefront} from "react-icons/io5";
import {HiUsers} from "react-icons/hi";
import {MdHistory} from "react-icons/md";
import DividerBar from "../DividerBar";
import {GoHomeFill} from "react-icons/go";
import ImageWithSkeleton from "../ImageWithSkeleton";
import {FaBook} from "react-icons/fa";
import {useRecoilValue} from "recoil";
import {deviceInfoState, gameListState} from "@/libs/recoil/atom";
import MyTransition from "@/components/MyTransition";
import {LG_SCREEN} from "@/helpers/shared/constants";
import {memo, useCallback, useEffect, useRef, useState} from "react";
import SidebarIcon from "./Sidebaricon";
import SidebarText from "./SidebarText";
import HeaderNotificationItem from "../Header/HeaderNotificationItem";
import SettingButton from "../Buttons/SettingButton";
import ToggleSidebarButton from "./ToggleSidebarButton";
import Backdrop from "../Backdrop";
import UserInfo from "./UserInfo";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/routing";
import useVisibility from "@/helpers/hooks/useVisibility";

export default memo(function Sidebar() {
    const deviceInfo = useRecoilValue(deviceInfoState)!;
    const gameList = useRecoilValue(gameListState);
    const {screen} = deviceInfo;
    const [isExpand, setIsExpand] = useState<boolean>(screen.availWidth < LG_SCREEN);
    const translation = useTranslations("common.sidebar");
    const {hide, show, visibility} = useVisibility();

    const notificationElId = useRef<string>(generateRandomString());
    const userInfoElId = useRef<string>(generateRandomString());

    const absolute = screen.availWidth < LG_SCREEN ? "absolute left-0 top-0 z-[100]" : "";
    const maxWidth = isExpand ? "max-w-[22rem]" : "w-max";

    const handleToggleExpand = useCallback(() => {
        if (screen.availWidth < LG_SCREEN) return hide("sidebar");

        setIsExpand((prevState) => !prevState);
    }, [hide, screen.availWidth]);

    useEffect(() => {
        setIsExpand(screen.availWidth < LG_SCREEN);
    }, [screen.availWidth]);

    return (
        <>
            {/* Backdrop */}
            {screen.availWidth < LG_SCREEN && <Backdrop show={visibility.sidebar} onClick={() => hide("sidebar")} />}
            {/* Sidebar */}
            <MyTransition
                in={visibility.sidebar}
                timeout={300}
                className={`${absolute} w-full h-full ${maxWidth} bg-base-100 duration-300 border-r border-r-base-300`}
                defaultStyles={{
                    transform: "translateX(-100%)",
                    transition: "transform 300ms ease-in-out",
                }}
                transitionStyles={{
                    entering: {transform: "translateX(0)"},
                    entered: {transform: "translateX(0)"},
                    exiting: {transform: "translateX(-100%)"},
                    exited: {transform: "translateX(-100%)"},
                    unmounted: {transform: "translateX(-100%)"},
                }}
            >
                <ToggleSidebarButton isExpand={isExpand} onToggle={handleToggleExpand} />
                <div className="w-full h-full flex flex-col items-stretch overflow-hidden">
                    {/* header */}
                    <div className="w-full flex-shrink-0 border-b border-b-neutral-content">
                        <div className="w-full h-full flex flex-1 items-stretch justify-between flex-wrap gap-3 p-2">
                            <UserInfo isExpand={isExpand} id={userInfoElId.current} />
                            {isExpand && (
                                <div className="flex flex-wrap gap-2">
                                    <HeaderNotificationItem width={48} height={48} id={notificationElId.current} />
                                    <SettingButton width={48} height={48} />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* body */}
                    <div className="relative flex-1 py-4 overflow-hidden">
                        <div className="h-full overflow-auto">
                            <Link href="/message">
                                <SidebarItem title={translation("messageLink")}>
                                    <SidebarIcon>
                                        <IoChatbubbleSharp className="w-6 h-6" />
                                    </SidebarIcon>
                                    {isExpand && <SidebarText>{translation("messageLink")}</SidebarText>}
                                </SidebarItem>
                            </Link>
                            <Link href="/friends">
                                <SidebarItem title={translation("FriendLink")}>
                                    <SidebarIcon>
                                        <HiUsers className="w-6 h-6" />
                                    </SidebarIcon>
                                    {isExpand && <SidebarText>{translation("FriendLink")}</SidebarText>}
                                </SidebarItem>
                            </Link>
                            <SidebarItem title={translation("HistoryLink")} onClick={() => show("historyModal")}>
                                <SidebarIcon>
                                    <MdHistory className="w-6 h-6" />
                                </SidebarIcon>
                                {isExpand && <SidebarText>{translation("HistoryLink")}</SidebarText>}
                            </SidebarItem>
                            <DividerBar />
                            <Link href="/">
                                <SidebarItem title={translation("HomeLink")}>
                                    <SidebarIcon>
                                        <GoHomeFill className="w-6 h-6" />
                                    </SidebarIcon>
                                    {isExpand && <SidebarText>{translation("HomeLink")}</SidebarText>}
                                </SidebarItem>
                            </Link>
                            <Link href="/store">
                                <SidebarItem title={translation("StoreLink")}>
                                    <SidebarIcon>
                                        <IoStorefront className="w-6 h-6" />
                                    </SidebarIcon>
                                    {isExpand && <SidebarText>{translation("StoreLink")}</SidebarText>}
                                </SidebarItem>
                            </Link>
                            <DividerBar />
                            {isExpand && (
                                <h5 className="font-semibold text-base mb-2 px-2">{translation("gameSectionTitle")}</h5>
                            )}
                            {gameList.map((gameInfo) => (
                                <Link key={gameInfo._id} href={`/game/${gameInfo.alternativeName}`}>
                                    <SidebarItem title={gameInfo.name}>
                                        <SidebarIcon>
                                            <ImageWithSkeleton src={gameInfo.imageUrl} width={24} height={24} />
                                        </SidebarIcon>
                                        {isExpand && <SidebarText>{gameInfo.name}</SidebarText>}
                                    </SidebarItem>
                                </Link>
                            ))}
                            <Link href="/game-instructions">
                                <SidebarItem title={translation("gameInstructionsLink")}>
                                    <SidebarIcon>
                                        <FaBook className="w-6 h-6" />
                                    </SidebarIcon>
                                    {isExpand && <SidebarText>{translation("gameInstructionsLink")}</SidebarText>}
                                </SidebarItem>
                            </Link>
                            <DividerBar />
                        </div>
                    </div>
                </div>
            </MyTransition>
        </>
    );
});
