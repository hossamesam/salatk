import { SalatkAPIresponse } from '@/types/salatkAPI';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const actGetSalatkTimes = createAsyncThunk('salatimes/actGetSalatkTimes', async (): Promise<SalatkAPIresponse> => {

     const response = await axios.get('https://api.aladhan.com/v1/timingsByCity/now?city=giza&country=EG&state=giza&method=5');
     return response.data.data;
})
export default actGetSalatkTimes