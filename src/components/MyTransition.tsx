"use client";

import {TransitionStyles} from "@/helpers/shared/interfaces/commonInterface";
import {useRef} from "react";
import {Transition} from "react-transition-group";

interface Props {
    children?: React.ReactNode;
    in: boolean;
    timeout: number;
    defaultStyles: React.CSSProperties;
    transitionStyles: TransitionStyles;
    className?: string;
    onClick?: () => void;
}

export default function MyTransition(props: Props) {
    const nodeRef = useRef<HTMLDivElement | null>(null);

    return (
        <Transition nodeRef={nodeRef} in={props.in} timeout={props.timeout} mountOnEnter unmountOnExit>
            {(state) => (
                <div
                    ref={nodeRef}
                    className={props.className || ""}
                    style={{
                        ...props.defaultStyles,
                        ...props.transitionStyles[state],
                    }}
                    onClick={props.onClick}
                >
                    {props.children}
                </div>
            )}
        </Transition>
    );
}
