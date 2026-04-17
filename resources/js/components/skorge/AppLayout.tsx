import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import type { ReactNode} from 'react';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Sidebar from './Sidebar';
import TranslateWidget from './TranslateWidget';

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
    hideSidebar?: boolean;
    hideFooter?: boolean;
    fullWidth?: boolean;
}

export default function AppLayout({ children, title, description, hideSidebar, hideFooter, fullWidth }: AppLayoutProps) {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');

        return saved === 'true';
    });
    const { isAuthenticated } = useAuth();
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        if (!isAuthenticated) {
return;
}

        // Interactive cursor setup
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Post heartbeat every 60 seconds of active session
        const interval = setInterval(() => {
            api.post('/user/heartbeat', { duration: 60 })
                .catch(err => console.error("Heartbeat failed:", err));
        }, 60000);

        return () => {
            clearInterval(interval);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isAuthenticated, mouseX, mouseY]);

    const handleToggleCollapse = () => {
        setSidebarCollapsed((prev: boolean) => {
            const next = !prev;
            localStorage.setItem('sidebarCollapsed', String(next));

            return next;
        });
    };

    return (
        <div className="min-h-screen bg-[#eef2f6] dark:bg-[#090e17] font-sans text-slate-800 dark:text-slate-200 selection:bg-cyan-500/30 overflow-hidden relative">
            
            {/* Ambient Background Lights */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
                <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-cyan-400/20 dark:bg-cyan-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
                <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-purple-400/20 dark:bg-fuchsia-600/15 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[800px] h-[400px] bg-orange-400/20 dark:bg-rose-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-60"></div>
            </div>

            {/* Interactive Cursor Glow (Stay in background) */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen opacity-100 dark:opacity-70"
                style={{
                    background: useMotionTemplate`radial-gradient(400px circle at ${smoothX}px ${smoothY}px, rgba(14, 165, 233, 0.25), transparent 80%)`
                }}
            />

            {!hideSidebar && <Sidebar isCollapsed={false} toggleCollapse={handleToggleCollapse} />}

            <main className="flex flex-col min-h-screen relative z-0 w-full pt-24">
                {(title || description) && (
                    <header className="px-6 py-20 md:py-28 lg:py-32 w-full flex flex-col items-center justify-center text-center relative pointer-events-none">
                        {/* Dramatic Center Headline for Dribbble-like visual hierarchy */}
                        <div className="max-w-4xl mx-auto flex flex-col items-center">
                            {title && (
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-sm leading-[1.1] mb-6">
                                    {title}
                                </h1>
                            )}
                            {description && (
                                <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl lg:text-2xl max-w-3xl font-medium leading-relaxed">
                                    {description}
                                </p>
                            )}
                        </div>
                    </header>
                )}
                
                <div className="flex-1 w-full relative z-10">
                    <div className={fullWidth ? "w-full pb-32" : "px-4 md:px-8 max-w-7xl mx-auto w-full pb-32"}>
                        {children}
                    </div>
                </div>
            </main>

            <TranslateWidget />
        </div>
    );
}
