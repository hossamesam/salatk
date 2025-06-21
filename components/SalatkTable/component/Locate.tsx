
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React from 'react'
import CountrySelector from './select-country'
import { FaMapLocation } from "react-icons/fa6";

export default function Locate() {
    return (
        <Dialog >
            <DialogTrigger>
                <div className="flex rounded-full z-10 w-24 h-24 border-2 backdrop-blur-2xl border-zinc-700 shadow-zinc-700  hover:shadow-white-950 flex-col items-center justify-center   bg-zinc-700 text-zinc-200  left-7 bottom-7 fixed  shadow-lg cursor-pointer hover:bg-emerald-200 hover:text-zinc-950 hover:border-zinc-700  transition duration-300">
                    <FaMapLocation color='red' size={50} className='absolute  shadow-red-800 -top-4 left-5' />
                    <div className=" font-bold text-center z-40">تحديد الموقع </div>
                </div>
            </DialogTrigger>
            <DialogContent className='w-full'>
                <DialogHeader>
                    <DialogTitle className='flex items-center justify-center'>حدد موقعك لحساب مواقيت الصلاة </DialogTitle>
                </DialogHeader>
                <DialogDescription  >
                    <CountrySelector />
                </DialogDescription>

            </DialogContent>
        </Dialog>
    )
}
