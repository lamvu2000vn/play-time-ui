import {memo} from "react";
import EmptyTile from "./EmptyTile";
import Tile from "./Tile";

interface Props {
    number: number;
    correctNumber: number;
    tileColor: string;
}

export default memo(function TileContainer(props: Props) {
    const {correctNumber, number, tileColor} = props;

    return (
        <div className="relative w-full aspect-square">
            <EmptyTile />
            <Tile number={number} correctNumber={correctNumber} tileColor={tileColor} />
        </div>
    );
});
