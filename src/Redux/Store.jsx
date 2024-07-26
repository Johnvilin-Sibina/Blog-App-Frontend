import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './Slice/userSlice'
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import { persistStore } from "redux-persist";
import themeReducer from './Slice/themeSlice'

const rootReducer = combineReducers({
    user:userReducer,
    theme:themeReducer
})

const persistConfig = {
    key:'root',
    storage,
    version:1
}

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>{
        return getDefaultMiddleware({serializableCheck:false})
    }
})

export const persistor = persistStore(store)