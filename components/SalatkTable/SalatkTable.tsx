"use client";
import useSalatkAPIresponse from '@/hooks/use-SalatkAPIresponse';
import React, {  useEffect, useState } from 'react';
import { Status } from '@/types/salatkAPI';
import { Howl } from 'howler';
import { FaClock, FaCheckCircle, FaTimesCircle, FaMinusCircle } from 'react-icons/fa';
import { Clock } from '../clock/clock';
import Locate from './component/Locate';
import { useAppSelector } from '@/hooks/hooks';

function SalatkTable() {
    const { prayers, Data } = useSalatkAPIresponse();
    const [lastAdhanPrayer, setLastAdhanPrayer] = useState<string | null>(null);
    const statustimelocal = useAppSelector((state) => state.locatedByCountryOrCoords)

    useEffect(() => {
        console.log('====================================');
        console.log(prayers, Data);
        console.log('====================================');
    }, [prayers, Data])

    const playAdhan = () => {
        const sound = new Howl({
            src: ['/azan.mp3'], // تأكد من وضع ملف الأذان في مجلد public
            volume: 0.7,
        });
        sound.play();
    };

    useEffect(() => {
        if (prayers) {
            const currentPrayer = prayers.find((prayer) => prayer.status === Status.CURRENT);
            if (currentPrayer && currentPrayer.name !== lastAdhanPrayer && currentPrayer.isAzan) {
                setLastAdhanPrayer(currentPrayer.name);
                playAdhan();
            }
        }
    }, [prayers, lastAdhanPrayer]); // أضف المتغير هنا

    if (!prayers) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold text-gray-600">Loading...</div>
            </div>
        );
    }

    const prayerNamesArabic: { [key: string]: string } = {
        Fajr: "الفجر",
        Dhuhr: "الظهر",
        Asr: "العصر",
        Maghrib: "المغرب",
        Isha: "العشاء",
        Imsak: "الإمساك",
        Midnight: "منتصف الليل",
        Firstthird: "الثلث الأول من الليل",
        Lastthird: "الثلث الأخير من الليل",
        Sunset: "الغروب",
        Sunrise: "الشروق",
    };
    const cancelTimes: string[] = [
        "Imsak",
        "Midnight",
        "Firstthird",
        "Lastthird",
        "Sunset",
        "Sunrise",
    ]


    return (
        <div className="p-6 flex flex-col gap-2 bg-gradient-to-b from-emerald-100 to-gray-100 min-h-screen">
            <Locate />

            <h1 className="text-5xl font-extrabold text-center text-emerald-700 ">
                مواقيت الصلاة
            </h1>
            <div>
                <h2 className="text-2xl font-bold text-center pb-2 ">
                    الموقع
                </h2>
                <h2 className="text-2xl font-bold text-center mb-4">
                    {
                        statustimelocal.lastType === 'location' ?
                            <span className='text-emerald-600'>{statustimelocal.city} {statustimelocal.country}</span>
                            : statustimelocal.lastType === 'coords' ?
                                <span dir='ltr' className='text-emerald-600'>
                                    {statustimelocal.latitude} : خط العرض
                                    <br />
                                    {statustimelocal.longitude} : خط الطول
                                </span>
                                : ""
                    }
                </h2>
            </div>
            <Clock />
            {
                Data !== undefined ? <div className="p-1 text-slate-500 dark:text-slate-400 justify-center text-center">
                    {Data.data?.date?.hijri?.month.days}  {Data.data?.date?.hijri?.month.ar} {Data.data?.date?.hijri?.year} هـ
                </div> : ""
            }


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {prayers.map((prayer, index) => (
                    <div
                        key={index}
                        className={`relative p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 ${prayer.status === Status.CURRENT
                            ? 'bg-emerald-600 row-start-1 row-span-1 col-start-1  col-span-full  text-white animate-pulse'
                            : 'bg-white text-gray-800'
                            }`}
                    >
                        <div className="absolute top-1 right-1 ">
                            {prayer.status === Status.CURRENT && (
                                <span className="px-3 py-1 text-sm font-semibold bg-yellow-400 text-gray-800 rounded-full">
                                    الصلاة المنتظرة
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl  font-bold text-center mb-4 pt-2 ">
                            {prayerNamesArabic[prayer.name]} ({prayer.name})
                        </h2>
                        <p className="text-center text-nowrap text-lg font-medium mb-2 flex items-center justify-center gap-2">
                            <FaClock className="text-emerald-500" />
                            {prayer.time}
                        </p>
                        <p className="text-center text-sm text-gray-600 mb-2">
                            {prayer.status === Status.ACTIVE && !cancelTimes.includes(prayer.name) ? (
                                <span className="flex items-center justify-center gap-2 text-red-500">
                                    <FaTimesCircle /> الصلاة القادمة
                                </span>
                            ) : cancelTimes.includes(prayer.name) ? <br />
                                : prayer.status === Status.CURRENT ?
                                    <span className="flex items-center font-bold justify-center gap-2 text-yellow-500">
                                        <FaMinusCircle />
                                        في الانتظار
                                    </span>

                                    : prayer.status === Status.NONE_ACTIVE && !cancelTimes.includes(prayer.name) ? (
                                        <span className="  flex items-center justify-center gap-2 text-emerald-500">
                                            <FaCheckCircle /> انتهت
                                        </span>
                                    ) : (
                                        ''
                                    )}
                        </p>
                        <p className={`text-center text-sm  ${prayer.status === Status.CURRENT && " bg-emerald-600 text-white "}`}>
                            {
                                prayer.status === Status.NONE_ACTIVE ?
                                    <>
                                        <span>الوقت المنقضي: &nbsp;&nbsp; </span>
                                        <span dir='rtl'>{prayer.elapsed}</span>
                                    </>
                                    :
                                    prayer.elapsed ?
                                        <>
                                            <span>الوقت المتبقي:&nbsp;&nbsp;</span>
                                            <span dir='ltr'>{prayer.elapsed}</span>
                                        </>
                                        : ''
                            }
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SalatkTable;