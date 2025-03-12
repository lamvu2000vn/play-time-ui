import {createListenerMiddleware, addListener} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "./store";
import {setMatchInfoListeners} from "./features/matchInfo/matchInfoSlice";

export const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening.withTypes<RootState, AppDispatch>();
export type AppStartListening = typeof startAppListening;

export const addAppListener = addListener.withTypes<RootState, AppDispatch>();
export type AppAddListener = typeof addAppListener;

setMatchInfoListeners(startAppListening);
