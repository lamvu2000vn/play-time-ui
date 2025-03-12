import {useAudio} from "@/helpers/hooks";
import {selectBaseMatchInfo} from "@/libs/redux/features/baseMatchInfo/baseMatchInfoSlice";
import {useAppSelector} from "@/libs/redux/hooks";
import {useEffect} from "react";

interface Props {
    children: React.ReactNode;
}

export default function SoundEffect(props: Props) {
    const {children} = props;

    const baseMatchInfo = useAppSelector(selectBaseMatchInfo)!;
    const {matchStatus, winner} = baseMatchInfo;
    const audio = useAudio();

    // Stop playing background music
    useEffect(() => {
        if (matchStatus === "progressing") {
            audio.background.pause();
            audio.gameStart.play();
        }
    }, [audio.background, audio.gameStart, matchStatus]);

    // Play sound effect when game is completed
    useEffect(() => {
        if (winner === "me") {
            audio.win.play();
        } else if (winner === "opponent") {
            audio.lose.play();
        }
    }, [audio.lose, audio.win, winner]);

    return children;
}
