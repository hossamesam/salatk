"use client"

import { useEffect, useState } from "react"

export function Clock() {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const hours = time.getHours().toString().padStart(2, "0")
    const minutes = time.getMinutes().toString().padStart(2, "0")
    const seconds = time.getSeconds().toString().padStart(2, "0")

    return (
        <div className="flex flex-col items-center">
            <div className="text-6xl font-bold tracking-tighter text-slate-800 dark:text-slate-100 font-mono">
                {hours}:{minutes}:{seconds}
            </div>
            <div className="mt-4 text-slate-500 dark:text-slate-400">
                {time.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </div>
        </div>
    )
}
