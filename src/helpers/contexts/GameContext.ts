import {createContext} from "react";
import {GameContext} from "../shared/interfaces/commonInterface";

export default createContext<GameContext>({
    gameName: "",
    stopTheMatch: false,
    messages: [],
    seconds: 0,
    onSetMyMatchStatistics: () => {},
});
