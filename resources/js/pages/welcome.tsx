import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Target, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/skorge/AppLayout';
import { CourseCard } from '@/components/skorge/CourseCard';
import { JobRoleCard } from '@/components/skorge/JobRoleCard';
import api from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

export default function Welcome() {
    const { t } = useTranslation();
    const [stats, setStats] = useState({ paths: 0, courses: 0, hireRate: 94, verified: 0 });
    const [roles, setRoles] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [introDone, setIntroDone] = useState(() => {
        return sessionStorage.getItem('hasSeenIntro') === 'true';
    });


    useEffect(() => {
        // Consumer API dari Laravel (Axios)
        api.get('/stats/platform').then(res => setStats(res.data)).catch(console.error);
        api.get('/job-roles').then(res => setRoles(res.data)).catch(console.error);
        api.get('/courses').then(res => setCourses(res.data.data || res.data)).catch(console.error);
        
        const handleIntroDone = () => setIntroDone(true);
        window.addEventListener('introFinished', handleIntroDone);

        return () => window.removeEventListener('introFinished', handleIntroDone);
    }, []);

    // Now fully connected to DB! No fallback needed.
    const displayRoles = roles.slice(0, 3);
    const displayCourses = courses;
    const topCourses = courses.slice(0, 3);

    return (
        <AppLayout fullWidth>
            {/* Minimalist Hero Section */}
            <div className="relative w-full min-h-[100vh] flex flex-col justify-center items-center mb-32 py-16 -mt-32 pt-32">
                {/* The Beloved 3D Fluid Ribbon Image Background - FULL BLEED without excessive scaling */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-[#eef2f6] dark:bg-[#090e17] flex justify-center items-center">
                    
                    {/* Light Mode 3D Ribbon Image */}
                    <motion.img 
                        src="/images/new-fluid-light.png" 
                        alt="3D Fluid Ribbon Vector"
                        initial={{ opacity: 0 }} 
                        animate={{ 
                            opacity: introDone ? 0.85 : 0,
                            scale: [1, 1.05, 1],
                            y: [0, -15, 0]
                        }} 
                        transition={{ 
                            opacity: { duration: 2, ease: "easeOut" },
                            scale: { duration: 20, repeat: Infinity, ease: "easeInOut" },
                            y: { duration: 15, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="dark:hidden absolute inset-0 w-full h-full object-cover object-center mix-blend-multiply opacity-85"
                        style={{ filter: 'contrast(1.05) brightness(1.1)' }}
                    />

                    {/* Radial Glow to protect Light Mode text */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0)_60%)] dark:hidden pointer-events-none"></div>

                    {/* Dark Mode 3D Ribbon Image */}
                    <motion.img 
                        src="/images/new-fluid-dark.png" 
                        alt="3D Fluid Ribbon Vector"
                        initial={{ opacity: 0 }} 
                        animate={{ 
                            opacity: introDone ? 0.85 : 0, 
                            scale: [1.05, 1, 1.05],
                            y: [-15, 0, -15]
                        }} 
                        transition={{ 
                            opacity: { duration: 2, ease: "easeOut" },
                            scale: { duration: 25, repeat: Infinity, ease: "easeInOut" },
                            y: { duration: 18, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="hidden dark:block absolute inset-0 w-full h-full object-cover object-center mix-blend-screen opacity-85"
                        style={{ filter: 'contrast(1.05) brightness(1.2)' }}
                    />

                    {/* Radial Glow to protect Dark Mode text */}
                    <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(9,14,23,0.8)_0%,rgba(9,14,23,0)_60%)] pointer-events-none"></div>

                    {/* Subtle vignette/fade to blend smoothly with page content */}
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#eef2f6] to-transparent dark:from-[#090e17] dark:to-transparent pointer-events-none"></div>
                </div>

                <div className="relative z-10 max-w-5xl w-full text-center flex flex-col items-center mt-28">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 40, rotateX: 45 }}
                        animate={introDone ? { opacity: 1, scale: 1, y: 0, rotateX: 0 } : { opacity: 0, scale: 0.8, y: 40, rotateX: 45 }}
                        transition={{ duration: 1, type: "spring", bounce: 0.5 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/40 dark:bg-[#0B1120]/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 text-slate-800 dark:text-cyan-300 text-sm font-bold xl:text-base mb-10 shadow-lg"
                    >
                        <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
                        <span>{t('home.tagline')}</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                        animate={introDone ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 50, filter: "blur(10px)" }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                        className="text-6xl lg:text-8xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.05] mb-8 px-4 relative z-10"
                    >
                        <span className="block">{t('home.hero.title1')}</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 dark:from-cyan-400 dark:via-blue-500 dark:to-orange-400 pb-4 inline-block drop-shadow-lg">
                            {t('home.hero.title2')}
                        </span>
                    </motion.h1>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
                        animate={introDone ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(5px)" }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                        className="relative z-10 p-6 sm:p-8 mb-12 max-w-4xl mx-auto rounded-[2rem] bg-white/40 dark:bg-[#0B1120]/60 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(255,255,255,0.05)]"
                    >
                        <p className="text-xl md:text-2xl text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                            {t('home.hero.subtitle')}
                        </p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={introDone ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-4 justify-center"
                    >
                        <Link to="/job-roles" className="inline-flex justify-center items-center h-16 md:h-20 px-10 md:px-14 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg md:text-xl hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_rgba(255,255,255,0.2)] group">
                            <span className="relative z-10 flex items-center">
                                {t('home.hero.btnPrimary')}
                                <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </span>
                        </Link>
                        <Link to="/courses" className="inline-flex justify-center items-center h-16 md:h-20 px-10 md:px-14 rounded-full bg-white/50 dark:bg-[#0B1120]/50 backdrop-blur-xl text-slate-900 dark:text-white font-black text-lg md:text-xl transition-all duration-300 border border-slate-200/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 hover:scale-105 shadow-lg">
                            {t('home.hero.btnSecondary')}
                        </Link>
                    </motion.div>
                </div>

                {/* Stats */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                    className="relative z-10 w-full max-w-5xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 px-4 bg-transparent border-t-0"
                >
                    <div className="flex flex-col items-center">
                        <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">{stats.paths > 0 ? `${stats.paths}+` : '...'}</div>
                        <div className="text-xs md:text-sm font-semibold tracking-widest text-slate-500 uppercase text-center">{t('home.stats.paths')}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">{stats.courses > 0 ? `${stats.courses}+` : '...'}</div>
                        <div className="text-xs md:text-sm font-semibold tracking-widest text-slate-500 uppercase text-center">{t('home.stats.courses')}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">{stats.hireRate}%</div>
                        <div className="text-xs md:text-sm font-semibold tracking-widest text-slate-500 uppercase text-center">{t('home.stats.hireRate')}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-amber-500" /> {stats.verified > 0 ? stats.verified : '...'}
                        </div>
                        <div className="text-xs md:text-sm font-semibold tracking-widest text-slate-500 uppercase text-center">{t('home.stats.verified')}</div>
                    </div>
                </motion.div>
            </div>

            {/* ═══ Scroll-driven Logo Reveal → Top 3 Courses ═══ */}
            <LogoScrollSection courses={topCourses} />

            {/* Featured Career Paths */}
            <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className="mb-32 mt-20 px-4 md:px-8 max-w-7xl mx-auto w-full"
            >
                <div className="flex flex-col mb-16 text-center lg:text-left lg:flex-row lg:items-end justify-between gap-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    >
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 flex flex-col lg:flex-row items-center lg:items-end gap-4 tracking-tighter leading-none">
                            <motion.div 
                                className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shrink-0 shadow-2xl shadow-purple-500/20"
                                whileHover={{ scale: 1.1, rotate: 10 }}
                            >
                                <Target className="w-8 h-8 text-white" />
                            </motion.div>
                            <span>{t('dashboard.roles.sectionTitle')}</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl">{t('dashboard.roles.sectionSubtitle')}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link to="/job-roles" className="inline-flex items-center text-white bg-slate-900 dark:bg-white dark:text-slate-900 font-bold px-8 py-4 rounded-full transition-all hover:scale-110 shadow-xl duration-300 text-lg">
                            {t('dashboard.roles.viewAll')} <ArrowRight className="w-5 h-5 ml-3" />
                        </Link>
                    </motion.div>
                </div>
                
                {/* Career Path Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {displayRoles.map((role: any, index: number) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full"
                        >
                            <JobRoleCard role={role} href={`/job-roles/${role.id}`} isFeatured={index === 0} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

        </AppLayout>
    );
}

/* ─────────────────────────────────────────────────────────────────
   LogoScrollSection  –  simple whileInView (no sticky / no blank)
   Logo fades + scales in when section enters viewport.
   Top-3 courses appear below with a staggered slide-up.
───────────────────────────────────────────────────────────────── */
function LogoScrollSection({ courses }: { courses: any[] }) {
    return (
        <section className="w-full py-24 px-4 md:px-8 flex flex-col items-center gap-16">

            {/* ── Logo reveal ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-6"
            >
                {/* Soft glow behind logo */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-80 h-80 rounded-full bg-cyan-400/10 dark:bg-cyan-400/8 blur-3xl pointer-events-none" />
                    <img
                        src="/logo vector.svg"
                        alt="SKORGE"
                        className="relative w-40 md:w-60 lg:w-80 h-auto select-none pointer-events-none"
                        style={{
                            filter:
                                'drop-shadow(0 0 32px rgba(0,210,255,0.30)) ' +
                                'drop-shadow(0 0 12px rgba(255,115,0,0.20))',
                        }}
                        draggable={false}
                    />
                </div>
            </motion.div>

            {/* ── Section label ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
            >
                <p className="text-xs font-black tracking-[0.45em] uppercase text-cyan-500 dark:text-cyan-400 mb-3">
                    Top Courses
                </p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                    Start Learning Today
                </h2>
            </motion.div>

            {/* ── Top 3 course cards ── */}
            {courses.length > 0 && (
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {courses.map((course: any, i: number) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <CourseCard course={course} href={`/courses/${course.id}`} />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* ── CTA ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Link
                    to="/courses"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-base hover:scale-105 transition-transform duration-300 shadow-xl"
                >
                    View All Courses <ArrowRight className="w-5 h-5" />
                </Link>
            </motion.div>
        </section>
    );
}
