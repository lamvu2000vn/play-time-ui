"use client";

import {HTMLElementOtherProps} from "@/helpers/shared/interfaces/commonInterface";
import ItemSound from "./ItemSound";

interface Props {
    children: React.ReactNode;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    title?: string;
}

export default function Item(props: Props & HTMLElementOtherProps) {
    return (
        <ItemSound>
            <div
                id={props.id}
                data-trigger-popup={props["data-trigger-popup"]}
                data-popup-element={props["data-popup-element"]}
                className={`rounded-lg bg-base-100 hover:brightness-95 active:brightness-90 cursor-pointer ${
                    props.className || ""
                }`}
                style={props.style}
                title={props.title}
                onClick={props.onClick}
            >
                {props.children}
            </div>
        </ItemSound>
    );
}
