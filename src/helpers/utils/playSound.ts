export const playSound = (audioFilePath: string, volume: number = 1) => {
    const audio = new Audio(audioFilePath);

    if (audio) {
        audio.currentTime = 0;
        audio.volume = volume;
        audio.play().catch((err) => {
            console.log(err);
        });
    }
};
