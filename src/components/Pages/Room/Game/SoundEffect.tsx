import useAudio from "@/helpers/hooks/useAudio";
import {baseMatchInfoState} from "@/libs/recoil/atom";
import {useEffect} from "react";
import {useRecoilValue} from "recoil";

interface Props {
    children: React.ReactNode;
}

export default function SoundEffect(props: Props) {
    const {children} = props;

    const baseMatchInfo = useRecoilValue(baseMatchInfoState)!;
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
