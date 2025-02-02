import {FifteenPuzzleBoardMatrix} from "@/helpers/shared/types";
import Container from "./Container";
import {MAX_X_POSITION} from "@/helpers/utils/games/fifteenPuzzleUtils";
import TileContainer from "./TileContainer";

interface Props {
    boardMatrix: FifteenPuzzleBoardMatrix;
    tileColor: string;
}

export default function BaseBoard(props: Props) {
    const {boardMatrix, tileColor} = props;

    return (
        <Container>
            {boardMatrix.map((row, y) =>
                row.map((number, x) => {
                    const correctNumber = y * (MAX_X_POSITION + 1) + x + 1;

                    return (
                        <TileContainer
                            key={`${y}-${x}`}
                            number={number}
                            tileColor={tileColor}
                            correctNumber={correctNumber}
                        />
                    );
                })
            )}
        </Container>
    );
}
