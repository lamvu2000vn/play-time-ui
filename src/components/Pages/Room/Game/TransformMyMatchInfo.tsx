import {useAuth} from "@/helpers/hooks/useAuth";
import {MatchInfo} from "@/helpers/shared/interfaces/commonInterface";
import {transformToTicTacToeMatchInfo} from "@/helpers/utils/transformToTicTacToeMatchInfo";
import {
    baseMatchInfoState,
    fifteenPuzzleMatchInfoState,
    matchInfoState,
    memoryMatchInfoState,
    ticTacToeMatchInfoState,
} from "@/libs/recoil/atom";
import {useRecoilState, useRecoilValue} from "recoil";
import PreparingRoomSection from "../PreparingRoomSection";
import {transformToFifteenPuzzleMatchInfo} from "@/helpers/utils/transformToFifteenPuzzleMatchInfo";
import {useContext, useEffect} from "react";
import {TicTacToeDetails, TicTacToeGameSetup} from "@/helpers/shared/interfaces/games/ticTacToeInterfaces";
import {FifteenPuzzleDetail, FifteenPuzzleGameSetup} from "@/helpers/shared/interfaces/games/fifteenPuzzleInterfaces";
import {GameContext} from "@/helpers/contexts";
import {transformToMemoryMatchInfo} from "@/helpers/utils/transformToMemoryMatchInfo";
import {MemoryDetails, MemoryGameSetup} from "@/helpers/shared/interfaces/games/memoryInterfaces";

interface Props {
    children: React.ReactNode;
}

export default function TransformMyMatchInfo(props: Props) {
    const {children} = props;

    const {gameName} = useContext(GameContext);
    const matchInfo = useRecoilValue(matchInfoState)!;
    const baseMatchInfo = useRecoilValue(baseMatchInfoState)!;
    const [ticTacToeMatchInfo, setTicTacToeMatchInfo] = useRecoilState(ticTacToeMatchInfoState);
    const [fifteenPuzzleMatchInfo, setFifteenPuzzleMatchInfo] = useRecoilState(fifteenPuzzleMatchInfoState);
    const [memoryMatchInfo, setMemoryMatchInfo] = useRecoilState(memoryMatchInfoState);

    const {auth} = useAuth();
    const user = auth.user!;

    useEffect(() => {
        const copyMatchInfo = structuredClone(matchInfo);

        switch (gameName) {
            case "Tic Tac Toe": {
                const transformData = transformToTicTacToeMatchInfo(
                    copyMatchInfo as MatchInfo<TicTacToeDetails, TicTacToeGameSetup>,
                    baseMatchInfo
                );

                setTicTacToeMatchInfo(transformData);
                break;
            }
            case "15 Puzzle": {
                const transformData = transformToFifteenPuzzleMatchInfo(
                    copyMatchInfo as MatchInfo<FifteenPuzzleDetail, FifteenPuzzleGameSetup>,
                    baseMatchInfo
                );

                setFifteenPuzzleMatchInfo(transformData);
                break;
            }
            case "Memory":
                const transformData = transformToMemoryMatchInfo(
                    copyMatchInfo as MatchInfo<MemoryDetails, MemoryGameSetup>,
                    baseMatchInfo
                );

                setMemoryMatchInfo(transformData);
                break;
            default:
                break;
        }
    }, [
        baseMatchInfo,
        gameName,
        matchInfo,
        setFifteenPuzzleMatchInfo,
        setMemoryMatchInfo,
        setTicTacToeMatchInfo,
        user,
    ]);

    if (ticTacToeMatchInfo || fifteenPuzzleMatchInfo || memoryMatchInfo) {
        return children;
    }

    return <PreparingRoomSection />;
}
