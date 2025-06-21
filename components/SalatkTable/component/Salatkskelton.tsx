import { cn } from '@/lib/utils'
import React from "react";


let pray = {
    Fajr: "الفجر",
    Sunrise: "الشروق",
    Dhuhr: "الظهر",
    Asr: " العصر",
    Sunset: "الغروب",
    Maghrib: "المغرب",
    Isha: "العشاء",
    Imsak: "الإمساك",
    Midnight: "منتصف الليل",
    Firstthird: "الثلث الأول من الليل",
    Lastthird: "الثلث الأخير من الليل",
}

function Salatkskelton({ className, time, timelate }: { className?: string, time?: string, timelate?: string }) {

    return (
        <>
            {/* {praysoon !== undefined ? <div> صلاة {praysoon}</div> : ""} */}
            <div
                data-slot="skeleton"
                className={cn(" aspect-video rounded-xl justify-center items-center flex flex-col  bg-emerald-200 ", className)}
            >

                <div className='text-xl'>{Object.entries(pray).map(([key, value]) => (timelate == key ? value : ''))}</div>
                <div className='text-xl'>{time}</div>
                <div className='text-xl'>{timelate}</div>
            </div>
        </>
    )
}

export default Salatkskelton
