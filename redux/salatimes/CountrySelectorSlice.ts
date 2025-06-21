import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import actGetSalatkTimes from './act/actGetSalatkTimes'

export interface CounterState {
    city: string,
    country: string,
    latitude: number,
    longitude: number,
    lastType: 'location' | 'coords' | null,
}

const initialState: CounterState = {
    city: 'giza',
    country: "EG",
    latitude: 0,
    longitude: 0,
    lastType: null,
}

export const CountrySelectorSlice = createSlice({
    name: 'CountrySelect',
    initialState,
    reducers: {
        choiceCityAndCountry: (state, action: PayloadAction<{ city: string, country: string }>) => {
            state.city = action.payload.city
            state.country = action.payload.country
            state.lastType = 'location'
            // console.log('==============from redux==========================');
            // console.log(state.city);
            // console.log(state.country);
            // console.log('====================================');
        },
        choiceCoords: (state, action: PayloadAction<{ latitude: number, longitude: number, }>) => {
            state.latitude = action.payload.latitude
            state.longitude = action.payload.longitude
            state.lastType = 'coords'
            // console.log('==============from redux==========================');
            // console.log(state.latitude);
            // console.log(state.longitude);
            // console.log('====================================');
        },
    },
})

// Action creators are generated for each case reducer function
export const { choiceCityAndCountry, choiceCoords } = CountrySelectorSlice.actions
export { actGetSalatkTimes }
export default CountrySelectorSlice.reducer