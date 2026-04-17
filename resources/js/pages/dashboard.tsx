import { motion } from 'framer-motion';
import { Target, Award, Zap, TrendingUp, Compass, Clock, CheckCircle2, Play, Sparkles, X, ArrowRight, Stars, BookOpen } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppLayout from '@/components/skorge/AppLayout';
import { CourseCard } from '@/components/skorge/CourseCard';
import { JobRoleCard } from '@/components/skorge/JobRoleCard';
import SkillPet from '@/components/skorge/SkillPet';
import { ProgressBar } from '@/components/skorge/UIComponents';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';

const DEFAULT_STATS = { coursesCompleted: 0, hoursLearning: 0, currentStreak: 0, globalRank: 'Unranked' };

export default function Dashboard() {
    const { user: authUser, isAuthenticated } = useAuth();
    const { t } = useTranslation();
    const location = useLocation();
    
    const [activePaths, setActivePaths] = useState<any[]>([]);
    const [ongoingCourses, setOngoingCourses] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(DEFAULT_STATS);
    const [recommendation, setRecommendation] = useState<any>(location.state?.recommendation ?? null);
    const [loading, setLoading] = useState(true);
    const [suggestedRoles, setSuggestedRoles] = useState<any[]>([]);
    const [suggestedCourses, setSuggestedCourses] = useState<any[]>([]);

    useEffect(() => {
        if (!isAuthenticated) {
return;
}

        api.get('/user/dashboard')
            .then((res) => {
                const d = res.data?.data || res.data;
                setActivePaths(d.active_paths || []);
                setOngoingCourses(d.ongoing_courses || []);
                setStats(d.stats || DEFAULT_STATS);
                
                if (!d.active_paths?.length) {
                    api.get('/job-roles')
                        .then(r => setSuggestedRoles((r.data.data || r.data).slice(0, 2)))
                        .catch(() => {});
                }

                if (!d.ongoing_courses?.length) {
                    api.get('/courses')
                        .then(r => setSuggestedCourses((r.data.data || r.data).slice(0, 2)))
                        .catch(() => {});
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [isAuthenticated]);

    const displayName = authUser?.name?.split(' ')[0] ?? 'Explorer';
    const xp = authUser?.xp_points ?? 0;

    return (
        <AppLayout>
            {/* Custom Dashboard Hero */}
            <div className="relative w-full mb-16 pt-32 pb-8 flex flex-col items-center text-center">
                <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto px-6 mt-8">
                    
                    {/* User Profile Avatar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-8 shadow-2xl shadow-cyan-500/20 border-4 border-white/60 dark:border-white/10 relative flex items-center justify-center bg-gradient-to-br from-cyan-400 to-orange-500 text-white font-black text-6xl"
                    >
                        {authUser?.avatar ? (
                            <img 
                                src={authUser.avatar} 
                                alt={`${displayName}'s avatar`} 
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                            />
                        ) : (
                            <span className="hover:scale-110 transition-transform duration-700 drop-shadow-md select-none">
                                {displayName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-800 dark:text-cyan-300 text-sm font-bold mb-6 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>The Journey Continues</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1] mb-6 drop-shadow-sm flex items-center justify-center flex-wrap gap-x-4"
                    >
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-orange-500 dark:from-cyan-400 dark:to-orange-400">{displayName}</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl leading-relaxed"
                    >
                        {t('dashboard.subtitle')}
                    </motion.p>
                </div>
            </div>
            {/* AI Recommendation Banner */}
            {recommendation && (
                <div className="mb-6 relative overflow-hidden bg-gradient-to-r from-cyan-50 to-orange-50 dark:from-cyan-900/60 dark:to-orange-900/40 border border-cyan-200 dark:border-cyan-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-0.5">{t('dashboard.aiMatch', { defaultValue: 'AI Career Match' })}</p>
                            <p className="text-slate-800 dark:text-white font-bold">{t('dashboard.aiMatchDesc', { defaultValue: 'Based on your answers, we recommend:' })} <span className="text-cyan-600 dark:text-cyan-300">{recommendation.role}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 relative z-10 shrink-0">
                        <Link
                            to={`/job-roles/${recommendation.id}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all hover:scale-105"
                        >
                            {t('dashboard.startPath', { defaultValue: 'Start This Path' })} <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setRecommendation(null)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Top Stats Row */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                {[
                    { label: t('dashboard.statXp', { defaultValue: 'Total XP' }), value: xp, icon: Zap, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', hover: 'hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)] hover:shadow-amber-500/20' },
                    { label: t('dashboard.statCourses', { defaultValue: 'Courses Done' }), value: stats.coursesCompleted, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', hover: 'hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)] hover:shadow-emerald-500/20' },
                    { label: t('dashboard.statQuizzes', { defaultValue: 'Quizzes Passed' }), value: stats.quizzesCompleted ?? 0, icon: Target, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-500/10', border: 'border-cyan-200 dark:border-cyan-500/20', hover: 'hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)] hover:shadow-cyan-500/20' },
                    { label: t('dashboard.statStreak', { defaultValue: 'Day Streak' }), value: stats.currentStreak, icon: TrendingUp, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20', hover: 'hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)] hover:shadow-rose-500/20' },
                ].map((stat, i) => (
                    <Link to="/stats" key={i} className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-center gap-4 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ${stat.border} ${stat.hover} cursor-pointer`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-800 dark:text-white">{stat.value}</div>
                            <div className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    </Link>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left 2/3) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2 space-y-8"
                >
                    {/* Active Career Path */}
                    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden group shadow-lg shadow-slate-200/20 dark:shadow-none backdrop-blur-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 right-0 p-8 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity pointer-events-none">
                            <Target className="w-48 h-48 text-cyan-600 dark:text-cyan-500" />
                        </div>

                        <div className="relative z-10 w-full flex flex-col items-start text-left">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                <Compass className="w-5 h-5 text-cyan-600 dark:text-cyan-400" /> {t('dashboard.careerObjective', { defaultValue: 'Current Career Objective' })}
                            </h2>

                            {loading ? (
                                <div className="animate-pulse flex flex-col gap-4 w-full">
                                    <div className="w-1/3 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                </div>
                            ) : activePaths.length > 0 ? (
                                <div className="space-y-6 w-full">
                                    <div className="flex flex-col sm:flex-row justify-between items-start">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/10 px-2 py-1 rounded inline-block mb-2">
                                                {activePaths[0].job_role.category}
                                            </span>
                                            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{activePaths[0].job_role.name}</h3>
                                        </div>
                                        <div className="mt-4 sm:mt-0 sm:text-right">
                                            <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400">{activePaths[0].progress}%</div>
                                            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('dashboard.pathCompletion', { defaultValue: 'Path Completion' })}</div>
                                        </div>
                                    </div>

                                    <ProgressBar progress={activePaths[0].progress} showLabel={false} className="h-3" />

                                    {activePaths[0].next_course && (
                                        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div>
                                                <div className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t('dashboard.upNext', { defaultValue: 'Up Next' })}</div>
                                                <div className="text-lg font-bold text-slate-800 dark:text-white">{activePaths[0].next_course.title}</div>
                                            </div>
                                            <Link
                                                to={`/courses/${activePaths[0].next_course.id}`}
                                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all hover:scale-105 text-center flex items-center justify-center gap-2"
                                            >
                                                <Play className="w-4 h-4" />
                                                {t('dashboard.continueLearningBtn', { defaultValue: 'Continue Learning' })}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-2 w-full">
                                    <div className="relative z-10 w-full flex flex-col items-center md:items-start text-center md:text-left bg-gradient-to-br from-orange-50 dark:from-orange-900/20 to-fuchsia-50 dark:to-fuchsia-900/10 border border-orange-100 dark:border-orange-500/20 rounded-3xl p-8 mb-6 shadow-inner">
                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-400/20 via-transparent to-transparent pointer-events-none rounded-3xl"></div>
                                        <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/10 text-orange-600 dark:text-orange-400">
                                            <Stars className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tighter">
                                            {t('dashboard.noPathTitle', { defaultValue: 'Unlock Your Potential' })}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xl text-lg font-medium leading-relaxed">
                                            {t('dashboard.noPathDesc', { defaultValue: "You haven't selected a target career path yet. Pick a path to start earning XP and mastering high-demand skills." })}
                                        </p>

                                        <Link to="/job-roles" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black transition-all hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(255,255,255,0.1)] group/btn">
                                            <Target className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" /> 
                                            {t('dashboard.explorePathsBtn', { defaultValue: 'Explore All Career Paths' })} 
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>

                                    {suggestedRoles.length > 0 && (
                                        <div className="mt-8">
                                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                                <Zap className="w-5 h-5 text-amber-500" /> 
                                                {t('dashboard.trendingRoles', { defaultValue: 'Trending Paths Near You' })}
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                                                {suggestedRoles.map((role) => (
                                                    <JobRoleCard key={role.id} role={role} href={`/job-roles/${role.id}`} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resume Learning Grid */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                            {t('dashboard.resumeLearning', { defaultValue: 'Resume Learning' })}
                        </h2>
                        {ongoingCourses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {ongoingCourses.map((c: any) => (
                                    <CourseCard key={c.id} course={c} href={`/courses/${c.id}`} progress={c.progress} status={c.status} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 relative overflow-hidden group shadow-sm">
                                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-cyan-400/20 group-hover:scale-150 transition-all duration-1000"></div>
                                
                                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center justify-between">
                                    <div className="text-center md:text-left flex-1 min-w-0 pr-0 md:pr-8">
                                        <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center mb-6 mx-auto md:mx-0 border border-cyan-100 dark:border-cyan-500/20">
                                            <Play className="w-6 h-6 text-cyan-600 dark:text-cyan-400 ml-1" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">
                                            {t('dashboard.noCoursesTitle', { defaultValue: 'Ready to Level Up?' })}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
                                            {t('dashboard.noCourses', { defaultValue: 'You have not started any courses yet. Dive into our catalog and learn a new skill today.' })}
                                        </p>
                                        <Link to="/courses" className="inline-flex items-center gap-2 text-white bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-cyan-600/20">
                                            {t('dashboard.findCourseBtn', { defaultValue: 'Explore Catalog' })} <ArrowRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                    
                                    {suggestedCourses.length > 0 && (
                                        <div className="flex-1 w-full flex flex-col gap-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-8 md:pt-0 pl-0 md:pl-10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                                    {t('dashboard.trending', { defaultValue: 'Trending Courses' })}
                                                </span>
                                            </div>
                                            {suggestedCourses.map(c => (
                                                <Link key={c.id} to={`/courses/${c.id}`} className="group/course relative bg-slate-50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 hover:border-cyan-300 dark:hover:border-cyan-500/50 rounded-2xl p-4 flex gap-4 items-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                                    <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0 overflow-hidden shadow-inner">
                                                        {c.thumbnail_url ? (
                                                            <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover group-hover/course:scale-110 transition-transform duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover/course:text-cyan-600 dark:group-hover/course:text-cyan-300 transition-colors">
                                                            {c.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200/50 dark:bg-slate-700/50 px-2 py-0.5 rounded">
                                                                {c.level || 'Beginner'}
                                                            </span>
                                                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                                {c.field}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Sidebar (Right 1/3) */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-8"
                >
                    {/* Current Standing */}
                    <Link to="/stats" className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-300 dark:hover:border-amber-500/30 hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.15)] transition-all duration-500">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-100 dark:bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-200 dark:group-hover:bg-amber-500/20 transition-colors" />
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 relative border-b border-slate-200 dark:border-slate-800 pb-4">
                            <Award className="w-5 h-5 text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform origin-bottom" /> {t('dashboard.currentStanding', { defaultValue: 'Current Standing' })}
                        </h3>
                        <div className="flex flex-col items-center justify-center py-4 relative">
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-200 dark:to-amber-500 mb-2 transform group-hover:scale-110 transition-transform duration-500">
                                {stats.globalRank}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2 max-w-xs leading-relaxed">
                                {t('dashboard.keepEarning', { defaultValue: 'Keep earning XP to climb the ranks and reach the Top 10%.' })}
                            </p>
                        </div>
                    </Link>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">{t('dashboard.recentActivity', { defaultValue: 'Recent Activity' })}</h3>
                        {stats.coursesCompleted === 0 && stats.hoursLearning === 0 && xp === 0 ? (
                            <p className="text-slate-500 dark:text-slate-400 text-sm text-center">{t('dashboard.noActivity', { defaultValue: 'No recent activity yet. Start exploring!' })}</p>
                        ) : (
                            <div className="space-y-5">
                                {[
                                    { action: t('dashboard.earnedXp', { defaultValue: 'Earned XP' }), target: t('dashboard.xpAccumulated', { xp: xp, defaultValue: `+${xp} XP Accumulated` }), time: t('dashboard.recently', { defaultValue: 'Recently' }), icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-500/10' },
                                ].map((act, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.bg}`}>
                                            <act.icon className={`w-4 h-4 ${act.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{act.action}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{act.target}</p>
                                            <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 block">{act.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <SkillPet 
                        xp={xp} 
                        user={authUser} 
                        globalRank={stats.globalRank}
                        careerCategory={activePaths.length > 0 ? activePaths[0].job_role.category : undefined} 
                    />
                </motion.div>
            </div>
        </AppLayout>
    );
}
