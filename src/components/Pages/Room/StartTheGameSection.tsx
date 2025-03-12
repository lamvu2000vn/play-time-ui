import {selectGameName} from "@/libs/redux/features/matchInfo/matchInfoSlice";
import {useAppSelector} from "@/libs/redux/hooks";
import SoundEffect from "./Game/SoundEffect";
import Layout from "./Layout/Layout";
import TicTacToeGame from "./Game/TicTacToe/TicTacToeGame";
import FifteenPuzzleGame from "./Game/15Puzzle/FifteenPuzzleGame";
import MemoryGame from "./Game/Memory/MemoryGame";

export default function StartTheGameSection() {
    const gameName = useAppSelector(selectGameName);

    if (!gameName) return null;

    return (
        <SoundEffect>
            <Layout>
                {gameName === "Tic Tac Toe" ? (
                    <TicTacToeGame />
                ) : gameName === "15 Puzzle" ? (
                    <FifteenPuzzleGame />
                ) : gameName === "Memory" ? (
                    <MemoryGame />
                ) : null}
            </Layout>
        </SoundEffect>
    );
}
