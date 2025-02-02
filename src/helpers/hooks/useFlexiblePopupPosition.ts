import {useCallback, useEffect, useState} from "react";
import {HTMLElementPosition} from "../shared/interfaces/commonInterface";

interface Props {
    elementId: string;
    isBeside?: boolean;
}

export default function useFlexiblePopupPosition({elementId, isBeside}: Props) {
    const [position, setPosition] = useState<HTMLElementPosition | null>(null);

    const calculatePosition = useCallback((): HTMLElementPosition => {
        const element = document.getElementById(elementId);

        let position: HTMLElementPosition = {
            left: null,
            top: null,
            right: null,
            bottom: null,
        };

        if (element) {
            const {top, left, right, bottom, width: elementWidth} = element.getBoundingClientRect();

            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const centerWidth = windowWidth / 2;
            const centerHeight = windowHeight / 2;

            const isTopRight = top < centerHeight && left > centerWidth;
            const isTopLeft = top < centerHeight && left < centerWidth;
            const isBottomRight = top > centerHeight && left > centerWidth;
            const isBottomLeft = top > centerHeight && left < centerWidth;

            // top-right
            if (isTopRight) {
                position = {
                    left: null,
                    top: isBeside ? top : bottom,
                    right: isBeside ? windowWidth - right + elementWidth : windowWidth - right,
                    bottom: null,
                };
            }
            // top-left
            else if (isTopLeft) {
                position = {
                    left: isBeside ? right : left,
                    top: isBeside ? top : bottom,
                    right: null,
                    bottom: null,
                };
            }
            // bottom-right
            else if (isBottomRight) {
                position = {
                    left: null,
                    top: null,
                    right: isBeside ? windowWidth - right + elementWidth : windowWidth - right,
                    bottom: isBeside ? bottom : top,
                };
            }
            // bottom-left
            else if (isBottomLeft) {
                position = {
                    left: isBeside ? right : left,
                    top: null,
                    right: null,
                    bottom: isBeside ? bottom : top,
                };
            }
        }

        return position;
    }, [elementId, isBeside]);

    const reCalculatePosition = useCallback(() => {
        const position = calculatePosition();

        setPosition(position);
    }, [calculatePosition]);

    useEffect(() => {
        reCalculatePosition();
    }, [reCalculatePosition]);

    return {position, reCalculatePosition};
}
