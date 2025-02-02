import {baseMatchInfoState, deviceInfoState, memoryMatchInfoState} from "@/libs/recoil/atom";
import {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import FirstTurnToast from "../FirstTurnToast";
import Container from "./Container";
import CardBoard from "./CardBoard";
import CardOfPlayer from "./CardOfPlayer";
import {MemoryContext} from "@/helpers/shared/interfaces/games/memoryInterfaces";
import {MemoryGameContext} from "@/helpers/contexts";
import {playSound} from "@/helpers/utils/playSound";

export default function MemoryGame() {
    const {myInfo, opponentInfo} = useRecoilValue(baseMatchInfoState)!;
    const {systemSoundVolume} = useRecoilValue(deviceInfoState)!;
    const {game} = useRecoilValue(memoryMatchInfoState)!;
    const [showFirstTurnToast, setShowFirstTurnToast] = useState<boolean>(true);

    const {details} = game;

    const playFlipCardSound = () => playSound("/assets/sounds/flip-card.mp3", systemSoundVolume);
    const playCollectCardSound = () => playSound("/assets/sounds/collect-1.mp3", systemSoundVolume);

    // Show first turn toast
    useEffect(() => {
        setTimeout(() => {
            setShowFirstTurnToast(false);
        }, 3000);
    }, []);

    const contextValues: MemoryContext = {
        playFlipCardSound,
        playCollectCardSound,
    };

    return (
        <MemoryGameContext.Provider value={contextValues}>
            <div className="w-full h-full relative">
                <FirstTurnToast
                    firstTurn={details.firstTurnId === myInfo._id ? "me" : "opponent"}
                    show={showFirstTurnToast}
                />
                <Container>
                    <CardBoard />
                    <CardOfPlayer side="left" playerInfo={myInfo} />
                    <CardOfPlayer side="right" playerInfo={opponentInfo} />
                </Container>
            </div>
        </MemoryGameContext.Provider>
    );
}
