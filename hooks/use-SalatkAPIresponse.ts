"use client";
import { Prayers, SalatkAPIresponse, Status, timings } from '@/types/salatkAPI';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react'
import { useAppSelector } from './hooks';



export default function useSalatkAPIresponse(): { prayers: Prayers[], Data: SalatkAPIresponse } {
    const { city, country, latitude, longitude, lastType } = useAppSelector((state) => state.locatedByCountryOrCoords);

    const [prayers, setprayers] = useState<SalatkAPIresponse>({} as SalatkAPIresponse);
    const [newSalatkAPIresponse, setnewSalatkAPIresponse] = useState<Prayers[]>([]);

    useEffect(() => {
        let url = '';
        if (lastType === 'coords' && latitude && longitude) {
            // الأولوية للإحداثيات إذا كانت آخر اختيار
            url = `https://api.aladhan.com/v1/timings/01-01-2025?latitude=${latitude}&longitude=${longitude}`;
        } else if (lastType === 'location' && city && country) {
            // الأولوية للمدينة والدولة إذا كانت آخر اختيار
            url = `https://api.aladhan.com/v1/timingsByCity/now?city=${city}&country=${country}&state=${city}&method=5`;
        } else if (latitude && longitude) {
            // إذا لم يوجد lastType لكن يوجد إحداثيات
            url = `https://api.aladhan.com/v1/timings/01-01-2025?latitude=${latitude}&longitude=${longitude}`;
        } else if (city && country) {
            // إذا لم يوجد lastType لكن يوجد مدينة ودولة
            url = `https://api.aladhan.com/v1/timingsByCity/now?city=${city}&country=${country}&state=${city}&method=5`;
        }

        if (url) {
            axios.get<SalatkAPIresponse>(url)
                .then((response) => setprayers(response.data))
                .catch((error) => console.error("Error fetching data:", error));
        }
    }, [country, city, latitude, longitude, lastType]);

    useEffect(() => {
        if (prayers) {
            let intervalId = setInterval(() => {
                setnewSalatkAPIresponse(processPrayerTimes(prayers?.data?.timings as timings))
            }, 500);

            return () => clearInterval(intervalId)
        }
    }, [prayers]);

    return { prayers: newSalatkAPIresponse, Data: prayers }
}




function processPrayerTimes(timeTopray: timings): Prayers[] {
    if (!timeTopray) return [];
    return Object.entries(timeTopray).map(([key, value]) => (
        {
            name: key,
            time: value,
            status: determineStatus(key, value),
            elapsed: calculateElapsedTime(value),
            isAzan: isAzanTime(value)
        }))
}


const validPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
var nextPrayer: string | null = null; // لتحديد الصلاة القادمة
var oldTimeofpray: moment.Moment = moment();

function determineStatus(name: string, time: string): Status {
    const [hour, minute] = time.split(":").map(Number);
    const prayerTimeWithFormatMoment = moment().hour(hour).minute(minute).second(0);
    const now = moment();

    if (!validPrayers.includes(name)) {
        if (now.isBefore(prayerTimeWithFormatMoment)) {
            return Status.ACTIVE;
        }
        return Status.NONE_ACTIVE;
    }
    // إذا كانت الصلاة القادمة لم يتم تحديدها بعد
    if (now.isBefore(prayerTimeWithFormatMoment) && (nextPrayer === null || nextPrayer === name)) {
        nextPrayer = name; // تحديد الصلاة القادمة
        oldTimeofpray = prayerTimeWithFormatMoment;
        return Status.CURRENT;
    }
    if (now.isAfter(prayerTimeWithFormatMoment) && nextPrayer === name) {
        nextPrayer = null;
    }
    // إذا كانت الصلاة ليست القادمة
    if (now.isBefore(prayerTimeWithFormatMoment)) {
        return Status.ACTIVE;
    }
    // إذا كانت الصلاة قد انتهت
    return Status.NONE_ACTIVE;
}

function calculateElapsedTime(time: string): string {
    const [hour, minute] = time.split(":").map(Number);
    const timeWithFormatMoment = moment().hour(hour).minute(minute).second(0);
    const now = moment();
    const seconds = moment().seconds();
    const duration = moment.duration(now.diff(timeWithFormatMoment, 'minutes'), 'seconds');
    const hours = String(duration.minutes()).padStart(2, '0');
    const minutes = String(duration.seconds()).padStart(2, '0').replace("-", '');


    return `${hours}:${minutes}:${60 - seconds}`

}

function isAzanTime(time: string): boolean {
    const [hour, minute] = time.split(":").map(Number);
    const timeWithFormatMoment = moment().hour(hour).minute(minute).second(0);
    const now = moment(); // الوقت الحالي
    // const now = moment("4:23:00", "hh:mm"); //test الوقت الحالي

    const startAzanTime = timeWithFormatMoment.clone();
    const endAzanTime = timeWithFormatMoment.clone().add(10, 'seconds');

    // console.log('=================== وقت الأذان ===================');
    // console.log(`الوقت الحالي: ${now.format('HH:mm:ss')}`);
    // console.log(`بداية الأذان: ${startAzanTime.format('HH:mm:ss')}`);
    // console.log(`نهاية الأذان: ${endAzanTime.format('HH:mm:ss')}`);
    // console.log(now.isBetween(startAzanTime, endAzanTime, 'seconds', '[)'));
    // console.log('====================================');

    return now.isBetween(startAzanTime, endAzanTime, 'seconds', '[)');
}