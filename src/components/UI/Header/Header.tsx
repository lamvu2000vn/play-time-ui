"use client";

import {FaBars} from "react-icons/fa";
import {memo, useEffect, useRef} from "react";
import {generateRandomString} from "@/helpers/utils/generateRandomString";
import Item from "../Item";
import HeaderNotificationItem from "./HeaderNotificationItem";
import {usePathname} from "next/navigation";
import SettingButton from "../Buttons/SettingButton";
import {useVisibility} from "@/helpers/hooks";

export default memo(function Header() {
    const notificationElId = useRef<string>(generateRandomString());
    const pathname = usePathname();
    const {show} = useVisibility();

    const headerRef = useRef<HTMLHeadElement>(null);

    useEffect(() => {
        const header = headerRef.current!;

        if (pathname.includes("room")) {
            header.style.display = "none";
        } else {
            header.style.display = "block";
        }
    }, [pathname]);

    return (
        <header ref={headerRef} className="w-full h-max bg-base-100 border-b border-base-300 px-2">
            <nav className="w-full h-full flex justify-between py-2">
                <Item className="w-12 h-12 flex items-center justify-center" onClick={() => show("sidebar")}>
                    <FaBars className="w-6 h-6" />
                </Item>
                <div className="flex gap-2">
                    <HeaderNotificationItem width={48} height={48} id={notificationElId.current} />
                    <SettingButton width={48} height={48} />
                </div>
            </nav>
        </header>
    );
});
