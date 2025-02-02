import {MD_SCREEN} from "../shared/constants";
import {GameAvailable} from "../shared/types";

export const checkScreenWidthValid = (
    game: GameAvailable,
    availWidth: number
): {
    isValid: boolean;
    requiredWidth: number;
} => {
    if (game === "15 Puzzle" && availWidth < MD_SCREEN)
        return {
            isValid: false,
            requiredWidth: MD_SCREEN,
        };

    if (game === "Memory" && availWidth < MD_SCREEN)
        return {
            isValid: false,
            requiredWidth: MD_SCREEN,
        };

    return {
        isValid: true,
        requiredWidth: 0,
    };
};
