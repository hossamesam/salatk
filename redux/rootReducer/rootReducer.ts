import { combineReducers } from '@reduxjs/toolkit'
import CountrySelectorSlice from '../salatimes/CountrySelectorSlice'
import missionSlice from '../mission/missionSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['locatedByCountryOrCoords'],
}

const missionPersistConfig = {
    key: 'mission',
    storage,
    whitelist: ['mission'],
}

const rootReducer = combineReducers({
    locatedByCountryOrCoords: persistReducer(persistConfig, CountrySelectorSlice),
    missions: persistReducer(missionPersistConfig, missionSlice),
})

// const rootReducer = combineReducers({
//     locatedByCountryOrCoords: CountrySelectorSlice,
//     missions: missionSlice
// })

export default rootReducer