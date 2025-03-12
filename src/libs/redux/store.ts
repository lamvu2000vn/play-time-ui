import {configureStore} from "@reduxjs/toolkit";
import {deviceInfoReducer} from "./features/deviceInfo/deviceInfoSlice";
import {authReducer} from "./features/auth/authSlice";
import {gameListReducer} from "./features/gameList/gameListSlice";
import {itemTypeListReducer} from "./features/itemTypeList/itemTypeListSlice";
import {roomInfoReducer} from "./features/roomInfo/roomInfoSlice";
import {matchInfoReducer} from "./features/matchInfo/matchInfoSlice";
import {baseMatchInfoReducer} from "./features/baseMatchInfo/baseMatchInfoSlice";
import {ticTacToeMatchInfoReducer} from "./features/ticTacToeMatchInfo/ticTacToeMatchInfoSlice";
import {memoryMatchInfoReducer} from "./features/memoryMatchInfo/memoryMatchInfoSlice";
import {fifteenPuzzleMatchInfoReducer} from "./features/fifteenPuzzleMatchInfo/fifteenPuzzleMatchInfoSlice";
import {listenerMiddleware} from "./listenerMiddleware";
import {inMatchDataReducer} from "./features/inMatchData/inMatchDataSlice";
import {uiReducer} from "./features/ui/uiSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            deviceInfo: deviceInfoReducer,
            gameList: gameListReducer,
            itemTypeList: itemTypeListReducer,
            ui: uiReducer,
            // game
            inMatchData: inMatchDataReducer,
            roomInfo: roomInfoReducer,
            matchInfo: matchInfoReducer,
            baseMatchInfo: baseMatchInfoReducer,
            ticTacToeMatchInfo: ticTacToeMatchInfoReducer,
            memoryMatchInfo: memoryMatchInfoReducer,
            fifteenPuzzleMatchInfo: fifteenPuzzleMatchInfoReducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
