import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userReducer from "../reducers/UserReducer";
import ProjectReducer from "../reducers/ProjectReducer";
import ReloadProjectReducer from "../reducers/ReloadProjectReducer";

const combineReducer = combineReducers({
 user: userReducer,
 project: ProjectReducer,
 reload: ReloadProjectReducer,
})

export const store = configureStore({
  reducer: combineReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
