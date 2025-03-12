import {useEffect, useState} from "react";
import FirstTurnToast from "../FirstTurnToast";
import Container from "./Container";
import CardBoard from "./CardBoard";
import CardOfPlayer from "./CardOfPlayer";
import {MemoryContext} from "@/helpers/shared/interfaces/games/memoryInterfaces";
import {MemoryGameContext} from "@/helpers/contexts";
import {playSound} from "@/helpers/utils/playSound";
import {selectDeviceVolume} from "@/libs/redux/features/deviceInfo/deviceInfoSlice";
import {useAppSelector} from "@/libs/redux/hooks";
import {selectBaseMatchInfo} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import {selectMemoryMatchInfo} from "@/libs/redux/features/memoryMatchInfo/memoryMatchInfoSlice";

export default function MemoryGame() {
    const {myInfo, opponentInfo} = useAppSelector(selectBaseMatchInfo);
    const {systemSoundVolume} = useAppSelector(selectDeviceVolume);
    const myMatchInfo = useAppSelector(selectMemoryMatchInfo)!;
    const {gameDetails} = myMatchInfo;
    const [showFirstTurnToast, setShowFirstTurnToast] = useState<boolean>(true);

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
                    firstTurn={gameDetails.firstTurnId === myInfo._id ? "me" : "opponent"}
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
