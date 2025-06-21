import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './rootReducer/rootReducer'

// const persistConfig = {
//     key: 'root',
//     storage,
//     whitelist: ['locatedByCountryOrCoords'],
// }

// const missionPersistConfig = {
//     key: 'mission',
//     storage,
//     whitelist: ['missions'],
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer)
// const missionPersistedReducer = persistReducer(missionPersistConfig, rootReducer)

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [
                'persist/PERSIST',
                'persist/REHYDRATE',
                'persist/PAUSE',
                'persist/FLUSH',
                'persist/PURGE',
                'persist/REGISTER',
            ],
        },
    }),
})

export const persistor = persistStore(store)

export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch