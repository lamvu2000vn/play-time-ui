import useAudio from "@/helpers/hooks/useAudio";
import {MatchStatus, TicTacToePlayerType, Position, PlayerTurn, TicTacToeBoardSize} from "@/helpers/shared/types";
import Image from "next/image";
import {memo, useEffect, useState} from "react";

interface Props {
    index: number;
    position: Position;
    myType: TicTacToePlayerType;
    currentTurn: PlayerTurn;
    markBy: TicTacToePlayerType | null;
    isHighlight: boolean;
    matchStatus: MatchStatus;
    boardSize: TicTacToeBoardSize;
    onPlayerMove: (position: Position) => Promise<void>;
}

export default memo(function Cell(props: Props) {
    const {index, myType, currentTurn, position, markBy, isHighlight, matchStatus, boardSize, onPlayerMove} = props;
    const [click, setClick] = useState<boolean>(false);
    const audio = useAudio();

    const handleClick = () => {
        if (markBy || currentTurn !== "me" || matchStatus === "completed" || click) return;

        setClick(true);
    };

    useEffect(() => {
        if (markBy) {
            audio?.pencilCheckMark.play();
        }
    }, [audio?.pencilCheckMark, markBy]);

    useEffect(() => {
        if (click) {
            onPlayerMove(position).finally(() => setClick(false));
        }
    }, [click, onPlayerMove, position]);

    useEffect(() => {
        setClick(false);
    }, [matchStatus]);

    const group = matchStatus === "progressing" ? (currentTurn === "me" ? "group" : "") : "";
    const cursor =
        matchStatus === "progressing" ? (currentTurn === "me" ? "cursor-pointer" : "cursor-default") : "cursor-default";
    const bgHighlight = isHighlight ? (markBy === "XPlayer" ? "bg-primary/40" : "bg-secondary/40") : "";
    const cellPadding = boardSize === "3x3" ? "p-2 md:p-5" : boardSize === "5x5" ? "p-2" : "";
    const borderRight =
        boardSize === "3x3"
            ? index % 3 !== 2
                ? "border-r-[.5rem]"
                : ""
            : boardSize === "5x5"
            ? index % 5 !== 4
                ? "border-r-[.5rem]"
                : ""
            : "";
    const borderBottom =
        boardSize === "3x3"
            ? index < 6
                ? "border-b-[.5rem]"
                : ""
            : boardSize === "5x5"
            ? index < 20
                ? "border-b-[.5rem]"
                : ""
            : "";

    return (
        <div
            className={`w-full h-full ${cursor} ${borderRight} ${borderBottom} border-base-300 ${group} select-none ${bgHighlight}`}
            onClick={handleClick}
        >
            <div className={`${cellPadding} w-full h-full flex items-center justify-center`}>
                <div className="w-full relative aspect-square">
                    {markBy ? (
                        <Mark markBy={markBy} />
                    ) : myType === "OPlayer" ? (
                        <Image
                            src="/assets/images/games/tic-tac-toe/o-mark.png"
                            alt="o-mark"
                            fill
                            className="hidden group-hover:block opacity-40"
                            priority
                        />
                    ) : (
                        <Image
                            src="/assets/images/games/tic-tac-toe/x-mark.png"
                            alt="x-mark"
                            fill
                            className="hidden group-hover:block opacity-40"
                            priority
                        />
                    )}
                </div>
            </div>
        </div>
    );
});

function Mark({markBy}: {markBy: TicTacToePlayerType}) {
    if (markBy === "XPlayer") {
        return <Image src="/assets/images/games/tic-tac-toe/x-mark.png" alt="x-mark" fill className="block" priority />;
    }

    if (markBy === "OPlayer") {
        return <Image src="/assets/images/games/tic-tac-toe/o-mark.png" alt="o-mark" fill className="block" priority />;
    }

    return null;
}
