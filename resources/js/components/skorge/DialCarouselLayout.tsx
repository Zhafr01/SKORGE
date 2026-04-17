import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface DialCarouselLayoutProps<T> {
    items: T[];
    renderDetail: (activeItem: T, activeIndex: number) => React.ReactNode;
    renderDialItemText: (item: T, index: number) => string;
    renderDialItemIcon: (item: T, index: number) => React.ReactNode;
    onToggleView: () => void;
    title?: string;
    subtitle?: string;
}

export function DialCarouselLayout<T>({
    items,
    renderDetail,
    renderDialItemText,
    renderDialItemIcon,
    onToggleView,
    title = "Curated Selection",
    subtitle = "Discover unique paths"
}: DialCarouselLayoutProps<T>) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 for down/next, -1 for up/prev
    const isScrollingRef = useRef(false);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Prevent background scrolling while in this view
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();

        // Use synchronous ref to prevent double-triggering during fast wheel spin
        if (isScrollingRef.current) {
return;
}

        // Lower threshold slightly for better responsiveness
        if (e.deltaY > 30) {
            // Scroll down -> next item
            setDirection(1);
            setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
            lockScroll();
        } else if (e.deltaY < -30) {
            // Scroll up -> previous item
            setDirection(-1);
            setActiveIndex((prev) => Math.max(prev - 1, 0));
            lockScroll();
        }
    }, [items.length]);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
return;
}

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [handleWheel]);

    const lockScroll = () => {
        isScrollingRef.current = true;

        if (scrollTimeout.current) {
clearTimeout(scrollTimeout.current);
}

        scrollTimeout.current = setTimeout(() => {
            isScrollingRef.current = false;
        }, 800); // Wait for animation to almost finish before allowing next scroll
    };

    // Calculate rotation math
    const STEP_ANGLE = 22; // Degrees between each item on the dial
    const CIRCLE_ROTATION = activeIndex * STEP_ANGLE;

    const contentVariants = {
        enter: (direction: number) => ({
            opacity: 0,
            x: direction > 0 ? -100 : 100,
            filter: "blur(10px)",
            scale: 0.9
        }),
        center: {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            scale: 1
        },
        exit: (direction: number) => ({
            opacity: 0,
            x: direction > 0 ? 100 : -100,
            filter: "blur(10px)",
            scale: 0.9
        })
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 top-0 left-0 w-screen h-screen z-50 bg-[#eef2f6] dark:bg-[#090e17] text-slate-900 dark:text-white flex overflow-hidden font-sans"
        >
            {/* Ambient Lighting Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-cyan-400/20 dark:bg-cyan-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
                <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-purple-400/20 dark:bg-fuchsia-600/15 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50"></div>
            </div>

            {/* Top Bar for Toggle */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="absolute top-8 left-8 right-8 flex justify-between items-center z-[100] pointer-events-none"
            >
                <div className="flex flex-col drop-shadow-md">
                    <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">{title}</p>
                    <h2 className="text-2xl tracking-tighter font-black uppercase text-slate-900 dark:text-white">{subtitle}</h2>
                </div>

                <div className="pointer-events-auto">
                    <button
                        onClick={onToggleView}
                        className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-xl"
                    >
                        <LayoutGrid className="w-5 h-5" />
                        <span className="font-bold text-sm tracking-wide">All Item</span>
                    </button>
                </div>
            </motion.div>

            {/* Left Side: Active Item Content */}
            {/* Outer wrapper is full screen height and scrollable */}
            <div className="absolute left-0 top-0 w-full md:w-[60%] lg:w-1/2 h-screen z-20 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* Inner wrapper guarantees at least full height to allow vertical centering, but expands if content is taller */}
                {/* Reduced padding to maximize available screen real estate */}
                <div className="min-h-full w-full flex flex-col justify-center px-8 lg:px-16 lg:pl-20 pt-28 pb-32">
                    <AnimatePresence mode="popLayout" custom={direction}>
                        <motion.div
                            key={`content-${activeIndex}`}
                            custom={direction}
                            variants={contentVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="w-full flex flex-col relative"
                        >
                            {items[activeIndex] ? renderDetail(items[activeIndex], activeIndex) : null}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Arrow Navigation placed absolute at bottom left so they don't consume precious vertical space in the content flow */}
            <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-12 flex gap-3 z-[100]">
                <button
                    disabled={activeIndex === 0}
                    onClick={() => {
 setDirection(-1); setActiveIndex(p => Math.max(0, p - 1)); 
}}
                    className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-xl border border-slate-200 dark:border-slate-700 pointer-events-auto"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                    disabled={activeIndex === items.length - 1}
                    onClick={() => {
 setDirection(1); setActiveIndex(p => Math.min(items.length - 1, p + 1)); 
}}
                    className="w-12 h-12 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl pointer-events-auto"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {/* Right Side: The Premium Glass Dial */}
            {/* Positioned exactly on the right edge (right-0 translate-x-[50%]) to form a perfect half-circle cutoff */}
            <div className="fixed right-0 translate-x-[50%] top-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none z-10 transition-all duration-500">
                <div className="absolute inset-0 pointer-events-none z-30">
                    <motion.div
                        className="w-full h-full rounded-full border-[1px] border-slate-300/30 dark:border-white/10 relative flex items-center justify-center shadow-[0_0_100px_rgba(0,0,0,0.05)]"
                        animate={{ rotate: CIRCLE_ROTATION }}
                        transition={{ type: "spring", stiffness: 50, damping: 20, mass: 1 }}
                    >

                        {/* Rotary Track Rings (Multiple for thickness) */}
                        <div className="absolute inset-[40px] rounded-full border-[30px] border-white/60 dark:border-slate-800/60 backdrop-blur-xl shadow-inner pointer-events-none"></div>
                        <div className="absolute inset-[80px] rounded-full border-[1px] border-slate-300/50 dark:border-slate-700/50 pointer-events-none"></div>

                        {/* Inner Core */}
                        <div className="absolute inset-[130px] rounded-full bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-3xl border border-white/50 dark:border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.1)] pointer-events-none flex items-center justify-center">
                            {/* Decorative Center Hub */}
                            <div className="w-[80px] h-[80px] rounded-full bg-slate-100 dark:bg-slate-950 shadow-[inset_0_10px_20px_rgba(0,0,0,0.1)] border border-slate-300 dark:border-slate-800 flex items-center justify-center">
                                <div className="w-[30px] h-[30px] rounded-full border-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"></div>
                            </div>
                        </div>

                        {/* Render all items perfectly centered on the massive 40px glass track */}
                        {items.map((item, idx) => {
                            const angle = 180 - (idx * STEP_ANGLE);
                            const isActive = idx === activeIndex;
                            const distance = Math.abs(idx - activeIndex);

                            // Hide items that wrap around too far to the right
                            if (distance > 5) {
return null;
}

                            return (
                                <div
                                    key={`dial-item-${idx}`}
                                    className="absolute w-[100px] h-[100px] top-1/2 left-1/2 -ml-[50px] -mt-[50px] z-50 pointer-events-auto"
                                    style={{
                                        // Area is 900px. Radius is 450px. track inset is 40px, border is 30px.
                                        // Center of track = 450 - 40 - 15 = 395px.
                                        transform: `rotate(${angle}deg) translateY(-50%) translateX(395px) rotate(${-angle}deg)`
                                    }}
                                >

                                    <motion.div
                                        animate={{ rotate: -CIRCLE_ROTATION }}
                                        transition={{ type: "spring", stiffness: 50, damping: 20, mass: 1 }}
                                        className="w-full h-full flex items-center justify-center cursor-pointer group"
                                        onClick={() => {
                                            setDirection(idx > activeIndex ? 1 : -1);
                                            setActiveIndex(idx);
                                        }}
                                    >
                                        <div className="relative flex items-center justify-center">
                                            {/* Text Label aligned OUTSIDE the circle (Left side of the icon) */}
                                            {/* We use right-[100%] to push it leftwards because the icons are on the left edge of the ring */}
                                            <motion.div
                                                animate={{
                                                    opacity: isActive ? 1 : Math.max(0, 0.4 - (distance * 0.1)),
                                                    scale: isActive ? 1 : 0.9,
                                                    x: isActive ? -12 : 0,
                                                    color: isActive ? "var(--tw-prose-body)" : "var(--tw-prose-muted)"
                                                }}
                                                className="absolute right-[calc(100%+20px)] flex flex-col items-end uppercase tracking-widest font-black whitespace-nowrap pointer-events-none"
                                            >
                                                <span className="text-[11px] block opacity-60 mb-1 tracking-[0.2em] font-extrabold">TOP {idx + 1}</span>
                                                <span className="text-sm max-w-[220px] truncate block text-slate-800 dark:text-white drop-shadow-sm leading-tight">
                                                    {renderDialItemText(item, idx)}
                                                </span>
                                            </motion.div>

                                            {/* The Circle Node (Finger Hole) */}
                                            <motion.div
                                                animate={{
                                                    scale: isActive ? 1.2 : 1,
                                                    backgroundColor: isActive ? '#0ea5e9' : 'rgba(255, 255, 255, 0.4)',
                                                    borderColor: isActive ? '#0ea5e9' : 'rgba(255,255,255,1)',
                                                    color: isActive ? '#fff' : 'currentColor'
                                                }}
                                                className={`w-[80px] h-[80px] rounded-full flex items-center justify-center border-2 transition-colors shadow-lg backdrop-blur-md dark:bg-slate-900/50 ${isActive ? 'shadow-[0_0_30px_rgba(14,165,233,0.5)] border-transparent' : 'hover:bg-white/60 dark:hover:bg-slate-800 dark:border-white/10 dark:text-slate-300 text-slate-700'}`}
                                            >
                                                {renderDialItemIcon(item, idx)}
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>

        </div>
    );
}

export default DialCarouselLayout;
