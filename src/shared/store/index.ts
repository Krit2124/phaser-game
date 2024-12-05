import { combineReducers, configureStore } from "@reduxjs/toolkit";

import characterReducer from "./reducers/character/characterSlice";

const rootReducer = combineReducers({
    character: characterReducer,
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    });
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch'];