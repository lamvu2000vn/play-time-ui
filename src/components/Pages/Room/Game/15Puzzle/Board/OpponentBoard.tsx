import {FifteenPuzzleBoardMatrix} from "@/helpers/shared/types";
import BaseBoard from "./BaseBoard";

interface Props {
    boardMatrix: FifteenPuzzleBoardMatrix;
}

export default function OpponentBoard(props: Props) {
    const {boardMatrix} = props;

    return <BaseBoard boardMatrix={boardMatrix} tileColor="bg-secondary/90" />;
}
