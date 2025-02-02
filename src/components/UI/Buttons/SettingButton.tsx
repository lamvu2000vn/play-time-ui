"use client";

import {memo} from "react";
import Item from "../Item";
import {IoSettingsSharp} from "react-icons/io5";
import useVisibility from "@/helpers/hooks/useVisibility";

interface Props {
    width: number;
    height: number;
}

export default memo(function SettingButton(props: Props) {
    const {width, height} = props;
    const {toggle} = useVisibility();

    return (
        <Item
            className="relative flex items-center justify-center"
            style={{width, height}}
            onClick={() => toggle("settingModal")}
        >
            <IoSettingsSharp className="w-6 h-6" />
        </Item>
    );
});
