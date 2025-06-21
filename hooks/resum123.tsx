// "use client"
// import { store } from '@/redux/store';
// import { SalatkAPIresponse } from '@/types/salatkAPI';
// import axios from 'axios';
// import React, { useEffect, useMemo, useRef, useState } from 'react'
// import { Provider } from 'react-redux';
// import { Skeleton } from '../ui/skeleton';
// import Salatkskelton from './component/Salatkskelton';
// import { useAppSelector } from "@/hooks/hooks";
// import useSalatkAPIresponse from '@/hooks/use-SalatkAPIresponse';
// import { createPublicKey } from 'crypto';
// import { FaSpinner } from "react-icons/fa";
// import { Clock } from '../clock/clock';
// import Azan from '../Azan/Azan';

// function SalatkTable() {
//     let idkey = 1
//     const { aladhan, time, timelate, timeShocked } = useSalatkAPIresponse();
//     // const [playSound] = useSound('sound.mp3');
//     // let azan = new Audio('/azan.mp3');
//     const azanAudio = useRef<null | HTMLAudioElement>(null);


//     if (time === "15:06:55" && true) {
//         setInterval(() => {
//             azanAudio.current?.play();
//         }, 1000)
//     }


//     return (
//         <div className='min-w-2/3 mx-auto' dir='ltr'>
//             <div className="flex justify-center">
//                 الساعة الان
//                 <br />
//             </div>
//             <Clock />
//             {timeShocked &&
//                 <Salatkskelton className='w-full h-44 my-4 ' timelate={timeShocked.timeNameSoon} time={timeShocked.timePraySoon} />
//             }

//             <audio ref={azanAudio} src="/azan.mp3" />

//             {timelate !== undefined ? Object.entries(timelate).filter(([key, value]: [string, any]) =>
//                 value == Math.min(Number(value)) && (<Salatkskelton time={value} timelate={key} />))
//                 :
//                 <FaSpinner size={50} className='animate-spin w-full' />

//             }

//             <div className="grid auto-rows-min gap-4 md:grid-cols-3 max-md:grid-cols-2 min-xl:grid-cols-4 justify-center items-center">

//                 {timelate !== undefined ? Object.entries(timelate).map(([key, value]: [string, any]) =>
//                     (<Salatkskelton time={value} timelate={key} />))
//                     : ""
//                 }

//             </div>
//             <div className="bg-muted/50 min-h-[10vh] flex-1 rounded-xl md:min-h-min" />
//         </div>

//     )
// }



// export default SalatkTable
