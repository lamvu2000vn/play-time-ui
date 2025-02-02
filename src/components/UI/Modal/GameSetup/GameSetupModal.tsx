"use client";

import {memo, useEffect, useRef} from "react";
import BaseModal from "../BaseModal";
import {GameInfo} from "@/helpers/shared/interfaces/commonInterface";
import TicTacToeSetup from "./TicTacToeSetup";
import MemorySetup from "./MemorySetup";
import FifteenPuzzleSetup from "./FifteenPuzzleSetup";

interface Props {
    show: boolean;
    gameInfo: GameInfo | null;
    onClose: () => void;
}

export default memo(function GameSetupModal(props: Props) {
    const {show, gameInfo, onClose} = props;

    const component = useRef<React.ReactNode>(null);

    useEffect(() => {
        if (gameInfo) {
            switch (gameInfo.name) {
                case "Tic Tac Toe":
                    component.current = <TicTacToeSetup gameInfo={gameInfo} />;
                    break;
                case "Memory":
                    component.current = <MemorySetup gameInfo={gameInfo} />;
                    break;
                case "15 Puzzle":
                    component.current = <FifteenPuzzleSetup gameInfo={gameInfo} />;
                    break;
                default:
                    return;
            }
        }
    }, [gameInfo]);

    return (
        <BaseModal show={show} closeButton onClose={onClose} closeByBackdrop>
            {component.current}
        </BaseModal>
    );
});
