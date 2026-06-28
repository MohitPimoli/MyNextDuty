import { createStore, combineReducers, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import { authReducer } from "./reducers/auth.reducer";
import { feedReducer } from "./reducers/feed.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "switch"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  feed: feedReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunk)); //, applyMiddleware(thunk)
export const persistor = persistStore(store);
