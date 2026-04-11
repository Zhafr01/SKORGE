import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/skorge/AppLayout';
import { CourseCard } from '@/components/skorge/CourseCard';
import { ProgressBar } from '@/components/skorge/UIComponents';
import { Target, Award, Zap, TrendingUp, Compass, Clock, CheckCircle2, Play, Sparkles, X, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';
import api from '@/lib/api';
import SkillPet from '@/components/skorge/SkillPet';

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

    useEffect(() => {
        if (!isAuthenticated) return;
        api.get('/user/dashboard')
            .then((res) => {
                const d = res.data?.data || res.data;
                setActivePaths(d.active_paths || []);
                setOngoingCourses(d.ongoing_courses || []);
                setStats(d.stats || DEFAULT_STATS);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [isAuthenticated]);

    const displayName = authUser?.name?.split(' ')[0] ?? 'Explorer';
    const xp = authUser?.xp_points ?? 0;

    return (
        <AppLayout
            title={t('dashboard.title').replace('{name}', displayName)}
            description={t('dashboard.subtitle')}
        >
            {/* AI Recommendation Banner */}
            {recommendation && (
                <div className="mb-6 relative overflow-hidden bg-gradient-to-r from-sky-50 to-orange-50 dark:from-sky-900/60 dark:to-orange-900/40 border border-sky-200 dark:border-sky-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-0.5">{t('dashboard.aiMatch', { defaultValue: 'AI Career Match' })}</p>
                            <p className="text-slate-800 dark:text-white font-bold">{t('dashboard.aiMatchDesc', { defaultValue: 'Based on your answers, we recommend:' })} <span className="text-sky-600 dark:text-sky-300">{recommendation.role}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 relative z-10 shrink-0">
                        <Link
                            to={`/job-roles/${recommendation.id}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm transition-all hover:scale-105"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: t('dashboard.statXp', { defaultValue: 'Total XP' }), value: xp, icon: Zap, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', hover: 'hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)] hover:shadow-amber-500/20' },
                    { label: t('dashboard.statCourses', { defaultValue: 'Courses Done' }), value: stats.coursesCompleted, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', hover: 'hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)] hover:shadow-emerald-500/20' },
                    { label: t('dashboard.statHours', { defaultValue: 'Learning Hours' }), value: stats.hoursLearning, icon: Clock, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-500/10', border: 'border-sky-200 dark:border-sky-500/20', hover: 'hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)] hover:shadow-sky-500/20' },
                    { label: t('dashboard.statStreak', { defaultValue: 'Current Streak' }), value: `${stats.currentStreak} ${t('dashboard.days', { defaultValue: 'Days' })}`, icon: TrendingUp, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20', hover: 'hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)] hover:shadow-rose-500/20' },
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left 2/3) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Career Path */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-100 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 right-0 p-8 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity pointer-events-none">
                            <Target className="w-48 h-48 text-sky-600 dark:text-sky-500" />
                        </div>

                        <div className="relative z-10 w-full flex flex-col items-start text-left">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                <Compass className="w-5 h-5 text-sky-600 dark:text-sky-400" /> {t('dashboard.careerObjective', { defaultValue: 'Current Career Objective' })}
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
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-500/10 px-2 py-1 rounded inline-block mb-2">
                                                {activePaths[0].job_role.category}
                                            </span>
                                            <h3 className="text-3xl font-black text-slate-800 dark:text-white">{activePaths[0].job_role.name}</h3>
                                        </div>
                                        <div className="mt-4 sm:mt-0 sm:text-right">
                                            <div className="text-3xl font-black text-sky-600 dark:text-sky-400">{activePaths[0].progress}%</div>
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
                                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all hover:scale-105 text-center flex items-center justify-center gap-2"
                                            >
                                                <Play className="w-4 h-4" />
                                                {t('dashboard.continueLearningBtn', { defaultValue: 'Continue Learning' })}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 w-full">
                                    <p className="text-slate-500 dark:text-slate-400 mb-6">{t('dashboard.noPathDesc', { defaultValue: "You haven't selected a target career path yet." })}</p>
                                    <Link to="/job-roles" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all hover:scale-105">
                                        <Target className="w-4 h-4" /> {t('dashboard.explorePathsBtn', { defaultValue: 'Explore Career Paths' })}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resume Learning Grid */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('dashboard.resumeLearning') ?? 'Resume Learning'}</h2>
                        {ongoingCourses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {ongoingCourses.map((c: any) => (
                                    <CourseCard key={c.id} course={c} href={`/courses/${c.id}`} progress={c.progress} status={c.status} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl p-8 text-center">
                                <p className="text-slate-500 dark:text-slate-400 mb-4">{t('dashboard.noCourses', { defaultValue: 'You have not started any courses.' })}</p>
                                <Link to="/courses" className="text-sky-600 font-bold hover:underline">{t('dashboard.findCourseBtn', { defaultValue: 'Find a Course to Start' })}</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (Right 1/3) */}
                <div className="space-y-8">
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
                </div>
            </div>
        </AppLayout>
    );
}
