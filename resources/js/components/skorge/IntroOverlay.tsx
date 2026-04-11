import React, { useState, useEffect, useRef } from 'react';

export default function IntroOverlay() {
    const [showIntro, setShowIntro] = useState(() => {
        if (typeof window !== 'undefined') {
            return !sessionStorage.getItem('hasSeenIntro');
        }
        return false;
    });
    
    const [isFading, setIsFading] = useState(false);
    const [playBlocked, setPlayBlocked] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!showIntro) return;

        // Fallback timeout in case video tracking fails
        const fallbackTimer = setTimeout(() => {
            handleVideoEnd();
        }, 12000); 

        return () => clearTimeout(fallbackTimer);
    }, [showIntro]);

    // Force play to handle Strict Mode and browser policies
    useEffect(() => {
        if (showIntro && videoRef.current) {
            // CRITICAL FIX: React sometimes fails to apply muted fast enough for play()
            videoRef.current.defaultMuted = true;
            videoRef.current.muted = true;
            
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("AutoPlay prevented or failed:", error);
                    setPlayBlocked(true);
                });
            }
        }
    }, [showIntro]);

    const handleVideoClick = () => {
        if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play();
            setPlayBlocked(false);
        } else {
            handleVideoEnd();
        }
    };

    const handleVideoEnd = () => {
        if (isFading) return;
        setIsFading(true);
        setTimeout(() => {
            setShowIntro(false);
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('hasSeenIntro', 'true');
                window.dispatchEvent(new Event('introFinished'));
            }
        }, 800); // 800ms duration matching the CSS transition
    };

    if (!showIntro && !isFading) return null;

    return (
        <div className={`fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover transform scale-105"
                onEnded={handleVideoEnd}
                onClick={handleVideoClick} 
                onPlay={() => setPlayBlocked(false)}
            >
                <source src="/loading.mp4" type="video/mp4" />
            </video>

            {playBlocked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
                    <button 
                        onClick={handleVideoClick}
                        className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold backdrop-blur-md hover:bg-white/20 transition-all pointer-events-auto shadow-2xl animate-pulse flex items-center gap-2"
                    >
                        <span>▶</span> Mulai Animasi
                    </button>
                    <button 
                        onClick={handleVideoEnd}
                        className="mt-6 text-slate-400 text-sm hover:text-white pointer-events-auto backdrop-blur-sm px-4 py-2"
                    >
                        Lewati
                    </button>
                </div>
            )}
        </div>
    );
}
