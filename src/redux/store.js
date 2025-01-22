import { configureStore, combineReducers } from "@reduxjs/toolkit"
import authSlice from '../slices/authSlice'
import postSlice from '../slices/postSlice'
import socketSlice from '../slices/socketSlice'
import chatSlice from '../slices/chatSlice'
import rtnSlice from '../slices/rtnSlice'
import {

    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    auth: authSlice,
    post: postSlice,
    socketio: socketSlice,
    chat: chatSlice,
    realTimeNotification:rtnSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;