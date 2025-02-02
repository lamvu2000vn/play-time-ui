import {Direction, FifteenPuzzleBoardMatrix, Position} from "@/helpers/shared/types";
import {useEffect, useRef, useState} from "react";
import BaseBoard from "./BaseBoard";
import {findEmptyPosition, getRefPosition, swapPosition} from "@/helpers/utils/games/fifteenPuzzleUtils";
import {useRecoilValue} from "recoil";
import {deviceInfoState} from "@/libs/recoil/atom";

interface Props {
    boardMatrix: FifteenPuzzleBoardMatrix;
    onUpdateBoardMatrix: (boardMatrix: FifteenPuzzleBoardMatrix) => void;
}

export default function MyBoard(props: Props) {
    const {boardMatrix, onUpdateBoardMatrix} = props;

    const {systemSoundVolume} = useRecoilValue(deviceInfoState)!;
    const [emptyPosition, setEmptyPosition] = useState<Position>({y: 0, x: 0});

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (boardMatrix.length) {
            const emptyPosition = findEmptyPosition(boardMatrix);

            setEmptyPosition(emptyPosition);
        }
    }, [boardMatrix]);

    // Handle move tiles
    useEffect(() => {
        audioRef.current = new Audio("/assets/sounds/tiles-move.mp3");

        const playSound = () => {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.volume = systemSoundVolume;
                audioRef.current.play().catch((error) => console.log(error));
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;
            const direction: Direction | undefined =
                key === "ArrowUp"
                    ? "up"
                    : key === "ArrowDown"
                    ? "down"
                    : key === "ArrowLeft"
                    ? "left"
                    : key === "ArrowRight"
                    ? "right"
                    : undefined;

            if (direction) {
                const newRefPosition = getRefPosition(direction, emptyPosition);

                if (newRefPosition) {
                    const newBoardMatrix = swapPosition(emptyPosition, newRefPosition, boardMatrix);

                    playSound();
                    onUpdateBoardMatrix(newBoardMatrix);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [boardMatrix, emptyPosition, onUpdateBoardMatrix, systemSoundVolume]);

    return (
        <>
            <BaseBoard boardMatrix={boardMatrix} tileColor="bg-primary/90" />
        </>
    );
}
