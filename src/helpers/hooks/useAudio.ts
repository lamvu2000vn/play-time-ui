import {deviceInfoState} from "@/libs/recoil/atom";
import {useEffect, useMemo, useState} from "react";
import {useRecoilValue} from "recoil";

interface IAudioState {
    play: (currentTime?: number) => void;
    pause: () => void;
    isPlaying: boolean;
}

interface IAudio {
    background: IAudioState;
    coinUpdate: IAudioState;
    gameStart: IAudioState;
    levelUp: IAudioState;
    levelUpdate: IAudioState;
    receiveMessage: IAudioState;
    sendMessage: IAudioState;
    pencilCheckMark: IAudioState;
    win: IAudioState;
    lose: IAudioState;
    draw: IAudioState;
    playAgain: IAudioState;
    welcome: IAudioState;
}

export default function useAudio() {
    const {backgroundMusicVolume, systemSoundVolume} = useRecoilValue(deviceInfoState)!;
    const [audio, setAudio] = useState<IAudio | null>(null);

    const audioConfig = useMemo<{key: keyof IAudio; selector: string}[]>(
        () => [
            {key: "background", selector: "audio#backgroundAudio"},
            {key: "coinUpdate", selector: "audio#coinUpdateAudio"},
            {key: "gameStart", selector: "audio#gameStartAudio"},
            {key: "levelUp", selector: "audio#levelUpAudio"},
            {key: "levelUpdate", selector: "audio#levelUpdateAudio"},
            {key: "receiveMessage", selector: "audio#receiveMessageAudio"},
            {key: "sendMessage", selector: "audio#sendMessageAudio"},
            {key: "pencilCheckMark", selector: "audio#pencilCheckMarkAudio"},
            {key: "win", selector: "audio#winAudio"},
            {key: "lose", selector: "audio#loseAudio"},
            {key: "draw", selector: "audio#drawAudio"},
            {key: "playAgain", selector: "audio#playAgainAudio"},
            {key: "welcome", selector: "audio#welcomeAudio"},
        ],
        []
    );

    useEffect(() => {
        const handlePlayAudio = (selector: string, currentTime: number) => {
            const audio = document.querySelector(selector) as HTMLAudioElement;

            if (audio && navigator.userActivation.hasBeenActive) {
                audio.muted = false;
                audio.currentTime = currentTime;

                audio.play().catch((error) => {
                    console.log(error);
                });
            }
        };

        const createPauseMethod = (selector: string) => () => {
            const audio = document.querySelector(selector) as HTMLAudioElement;

            if (audio) {
                audio.pause();
            }
        };

        const checkIsPlaying = (selector: string): boolean => {
            const audio = document.querySelector(selector) as HTMLAudioElement;

            if (audio) {
                return !audio.paused && audio.currentTime > 0;
            }

            return false;
        };

        const createPlayMethod =
            (selector: string) =>
            (currentTime: number = 0) =>
                handlePlayAudio(selector, currentTime);

        const audioObject = audioConfig.reduce((acc, {key, selector}) => {
            acc[key] = {
                play: createPlayMethod(selector),
                pause: createPauseMethod(selector),
                isPlaying: checkIsPlaying(selector),
            };
            return acc;
        }, {} as IAudio);

        setAudio(audioObject);
    }, [audioConfig]);

    useEffect(() => {
        audioConfig.forEach((config) => {
            const audio = document.querySelector(config.selector) as HTMLAudioElement;

            if (audio) {
                audio.volume = config.key === "background" ? backgroundMusicVolume : systemSoundVolume;
            }
        });
    }, [audioConfig, backgroundMusicVolume, systemSoundVolume]);

    return audio;
}
