import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export enum Missionstatus {
    Warn = '0',
    Succeeded = '1',
    Failed = '-1',
}

export interface CounterState {
    mission: {
        missionId: string,
        missionObject?: string,
        missionStatus?: Missionstatus,
    }[]
}

const initialState: CounterState = {
    mission: [
        {
            missionObject: '',
            missionId: '',
            missionStatus: Missionstatus.Warn,
        }
    ]
}

export const missionSlice = createSlice({
    name: 'mission',
    initialState,
    reducers: {
        setMission: (state, action: PayloadAction<{ missionObject?: string, missionStatus?: Missionstatus }>) => {
            state.mission.push({
                missionObject: action.payload.missionObject,
                missionId: Date.now().toString(),
                missionStatus: action.payload.missionStatus || Missionstatus.Warn,
            });
        },
        updateMissionStatus: (state, action: PayloadAction<{ missionId: string, missionStatus: Missionstatus }>) => {
            const mission = state.mission.find(m => m.missionId === action.payload.missionId);
            if (mission) {
                mission.missionStatus = action.payload.missionStatus;
            }
        },
        deleteMission: (state, action: PayloadAction<{ missionId: string }>) => {
            state.mission = state.mission.filter(m => m.missionId !== action.payload.missionId);
        },
        updateMissionObject: (state, action: PayloadAction<{ missionId: string, missionObject: string }>) => {
            const mission = state.mission.find(m => m.missionId === action.payload.missionId);
            if (mission) {
                mission.missionObject = action.payload.missionObject;
            }
        }
    },
})

export const { setMission, updateMissionStatus, deleteMission, updateMissionObject } = missionSlice.actions
export default missionSlice.reducer