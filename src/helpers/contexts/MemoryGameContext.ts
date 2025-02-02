import {createContext} from "react";
import {MemoryContext} from "../shared/interfaces/games/memoryInterfaces";

export default createContext<MemoryContext>({
    playFlipCardSound: () => {},
    playCollectCardSound: () => {},
});
