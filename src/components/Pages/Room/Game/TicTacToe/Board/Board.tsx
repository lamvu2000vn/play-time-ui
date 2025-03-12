import {Position, TicTacToeBoardMatrix} from "@/helpers/shared/types";
import {JSX, useMemo} from "react";
import Cell from "./Cell";
import {Moves} from "../TicTacToeGame";
import {useAppSelector} from "@/libs/redux/hooks";
import {selectBaseMatchInfo} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import {selectTicTacToeMatchInfo} from "@/libs/redux/features/ticTacToeMatchInfo/ticTacToeMatchInfoSlice";

interface Props {
    boardMatrix: TicTacToeBoardMatrix;
    moves: Moves;
    onPlayerMove: (position: Position) => Promise<void>;
}

export default function Board(props: Props) {
    const {moves, boardMatrix, onPlayerMove} = props;

    const {gameSetup, gameSpecialData} = useAppSelector(selectTicTacToeMatchInfo)!;
    const {matchStatus} = useAppSelector(selectBaseMatchInfo);
    const {highlightMoves} = moves;
    const {currentTurn, myType} = gameSpecialData;

    const drawCells = (): JSX.Element[] => {
        let index = 0;

        return boardMatrix.flatMap((xRows, y) =>
            xRows.map((markBy, x) => {
                const key = `${y}-${x}`;
                const isHighlightMark = highlightMoves.some(
                    (highlightPos) => highlightPos.x === x && highlightPos.y === y
                );

                const cell = (
                    <Cell
                        key={key}
                        index={index}
                        myType={myType}
                        currentTurn={currentTurn}
                        position={{y, x}}
                        markBy={markBy}
                        isHighlight={isHighlightMark}
                        matchStatus={matchStatus}
                        boardSize={gameSetup.boardSize}
                        onPlayerMove={onPlayerMove}
                    />
                );

                index++;

                return cell;
            })
        );
    };

    const gridStyles = useMemo(() => {
        const size = gameSetup.boardSize === "3x3" ? 3 : gameSetup.boardSize === "5x5" ? 5 : 0;
        return size > 0
            ? {
                  gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`,
              }
            : {};
    }, [gameSetup.boardSize]);

    return (
        <div className="portrait:w-full landscape:h-full max-w-[30rem] max-h-[30rem] aspect-square p-8 xl:p-12">
            <div className="w-full h-full aspect-square">
                <div className="w-full h-full grid" style={gridStyles}>
                    {drawCells()}
                </div>
            </div>
        </div>
    );
}
