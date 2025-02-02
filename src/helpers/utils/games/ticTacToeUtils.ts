import {Position, TicTacToeBoardMatrix, TicTacToePlayerType} from "@/helpers/shared/types";

export const markCell = (
    boardMatrix: TicTacToeBoardMatrix,
    position: Position,
    mark: TicTacToePlayerType
): TicTacToeBoardMatrix => {
    const copy = structuredClone(boardMatrix);

    copy[position.y][position.x] = mark;

    return copy;
};
