export const countdownFormatter = (seconds: number): string => {
    if (seconds < 0) {
        throw new Error("Seconds cannot be negative.");
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Ensure the seconds are always two digits
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
