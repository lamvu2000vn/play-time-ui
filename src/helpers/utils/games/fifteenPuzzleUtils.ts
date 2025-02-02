import {Direction, FifteenPuzzleBoardMatrix, Position} from "@/helpers/shared/types";
import {getRandomIndexFromArray} from "../getRandomIndexFromArray";

export const MAX_X_POSITION: number = 3;
export const MAX_Y_POSITION: number = 3;

export const generateBoardMatrix = (): FifteenPuzzleBoardMatrix => {
    const numbersAvailable = Array.from({length: 16}, (_, i) => i);

    const boardMatrix = Array.from({length: 4}, () =>
        Array.from({length: 4}, () => {
            const index = getRandomIndexFromArray<number>(numbersAvailable);
            const number = numbersAvailable[index];
            numbersAvailable.splice(index, 1);
            return number;
        })
    );

    return boardMatrix;
};

export const findEmptyPosition = (boardMatrix: FifteenPuzzleBoardMatrix): Position =>
    boardMatrix.reduce(
        (acc, row, rowIndex) => {
            const colIndex = row.findIndex((number) => number === 0);
            if (colIndex !== -1) {
                return {
                    x: colIndex,
                    y: rowIndex,
                };
            }
            return acc;
        },
        {y: 0, x: 0}
    );

export const getRefPosition = (direction: Direction, emptyPosition: Position): Position | undefined => {
    switch (direction) {
        case "up": {
            const newYPosition = emptyPosition.y + 1;

            return newYPosition <= MAX_Y_POSITION ? {x: emptyPosition.x, y: newYPosition} : undefined;
        }
        case "down": {
            const newYPosition = emptyPosition.y - 1;

            return newYPosition >= 0 ? {x: emptyPosition.x, y: newYPosition} : undefined;
        }

        case "left": {
            const newXPosition = emptyPosition.x + 1;

            return newXPosition <= MAX_X_POSITION ? {x: newXPosition, y: emptyPosition.y} : undefined;
        }
        case "right": {
            const newXPosition = emptyPosition.x - 1;

            return newXPosition >= 0 ? {x: newXPosition, y: emptyPosition.y} : undefined;
        }
        default:
            return undefined;
    }
};

export const swapPosition = (
    emptyPosition: Position,
    refPosition: Position,
    boardMatrix: FifteenPuzzleBoardMatrix
): FifteenPuzzleBoardMatrix => {
    const newBoardMatrix = boardMatrix.map((row) => [...row]);

    const temp = newBoardMatrix[emptyPosition.y][emptyPosition.x];
    newBoardMatrix[emptyPosition.y][emptyPosition.x] = newBoardMatrix[refPosition.y][refPosition.x];
    newBoardMatrix[refPosition.y][refPosition.x] = temp;

    return newBoardMatrix;
};
