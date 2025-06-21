"use client"
import { useEffect, useRef, useState } from 'react';

export default function Azan() {
    const audioRef =  useRef <null | HTMLAudioElement>(null);
    const [permission, setPermission] = useState(false);

    useEffect(() => {
        // تحقق من الإذن المخزن مسبقًا
        const allowed = localStorage.getItem('adhan-allowed');
        if (allowed === 'true') {
            setPermission(true);
        }
    }, []);

    const enableAudio = () => {
        setPermission(true);
        localStorage.setItem('adhan-allowed', 'true');
    };

    // مثال بسيط لتشغيل الأذان بعد وقت (مثلاً بعد 10 ثواني)
    useEffect(() => {
        if (permission) {
            const timer = setTimeout(() => {
                audioRef.current?.play();
            }, 10000); // 10 ثواني
            return () => clearTimeout(timer);
        }
    }, [permission]);

    return (
        <div>
            {!permission && (
                <button onClick={enableAudio} className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                    تشغيل تنبيهات الأذان
                </button>
            )}
            <audio ref={audioRef} src="/azan.mp3" />
        </div>
    );
}