import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LoadingOverlayProps {
    title: string;
    subtitle?: string;
}

const OptimizedLoadingVideo = React.memo(() => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.defaultMuted = true;
            videoRef.current.muted = true;
            videoRef.current.playbackRate = 1.8;
            
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.error("AutoPlay prevented:", error));
            }
        }
    }, []);

    return (
        <video 
            ref={videoRef}
            src="/loading-loop.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-[125%] h-[125%] max-w-none object-cover brightness-105"
        />
    );
});

export default function LoadingOverlay({ title, subtitle }: LoadingOverlayProps) {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        // Increment progress gradually up to 99%
        const interval = setInterval(() => {
            setProgress(prev => {
                // Slower increment as it gets closer to 99
                const step = Math.max(0.2, (99 - prev) * 0.05);
                const next = prev + step;
                return next >= 99 ? 99 : next;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center overflow-hidden rounded-full bg-black border border-slate-800/80 shadow-[0_0_80px_rgba(14,165,233,0.3)]">
                <OptimizedLoadingVideo />
            </div>
            
            <div className="flex flex-col items-center z-10 max-w-md w-full px-8">
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 text-center">{title}</h3>
                {subtitle && <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mb-8 text-center">{subtitle}</p>}
                
                <div className="flex flex-col items-center w-full">
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-4 overflow-hidden shadow-inner">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full"
                            style={{ width: `${progress}%` }}
                            transition={{ ease: "easeOut" }}
                        />
                    </div>
                    <span className="text-sky-600 dark:text-sky-400 font-bold text-2xl tracking-tight">{Math.floor(progress)}%</span>
                </div>
            </div>
        </div>
    );
}
