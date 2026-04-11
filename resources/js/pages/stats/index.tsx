import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/skorge/AppLayout';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { Award, Zap, TrendingUp, Target, Crown, ChevronRight, CheckCircle2, Flame, Hourglass, Lock } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import SkillPet from '@/components/skorge/SkillPet';

export default function StatsIndex() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [rewards, setRewards] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [leaderRes, rewardRes] = await Promise.all([
                    api.get('/stats/leaderboard'),
                    api.get('/stats/rewards')
                ]);
                setLeaderboard(leaderRes.data?.data || []);
                setRewards(rewardRes.data?.data || null);
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const xp = user?.xp_points || 0;
    const dbLevel = user?.level || 1;
    const level = Math.max(dbLevel, Math.floor(xp / 500) + 1);
    
    // Calculate progress to next level
    // Formula: next_level * 500
    const xpRequired = level * 500;
    const xpProgress = Math.min((xp / xpRequired) * 100, 100);

    return (
        <AppLayout
            title={t('stats.title')}
            description={t('stats.subtitle')}
        >
            <div className="space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Daily Streak */}
                    <div className="bg-gradient-to-br from-orange-50 dark:from-orange-500/10 to-orange-100/50 dark:to-rose-500/5 border border-orange-200 dark:border-orange-500/20 rounded-3xl p-6 flex items-center justify-between group hover:border-orange-300 dark:hover:border-orange-500/40 transition-all shadow-sm">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.1)] dark:shadow-[0_0_30px_rgba(249,115,22,0.2)] group-hover:scale-110 transition-transform">
                                <Flame className="w-8 h-8 text-orange-500 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">{t('stats.streak')}</p>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white">{user?.current_streak || 0} <span className="text-lg text-slate-500 dark:text-slate-400 font-medium">{t('stats.days')}</span></h3>
                            </div>
                        </div>
                        <div className="hidden sm:block text-right">
                            <p className="text-xs text-orange-600/70 dark:text-orange-500/70 font-semibold uppercase tracking-wider">{t('stats.streakSubtitle1')}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('stats.streakSubtitle2')}</p>
                        </div>
                    </div>

                    {/* Total Hours */}
                    <div className="bg-gradient-to-br from-emerald-50 dark:from-emerald-500/10 to-emerald-100/50 dark:to-teal-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-3xl p-6 flex items-center justify-between group hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all shadow-sm">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)] dark:shadow-[0_0_30px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
                                <Hourglass className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">{t('stats.time')}</p>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white">{user?.learning_hours || 0} <span className="text-lg text-slate-500 dark:text-slate-400 font-medium">{t('stats.hours')}</span></h3>
                            </div>
                        </div>
                        <div className="hidden sm:block text-right">
                            <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70 font-semibold uppercase tracking-wider">{t('stats.timeSubtitle1')}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('stats.timeSubtitle2')}</p>
                        </div>
                    </div>
                </div>

                {/* Top Section: Progress Ring & Pet */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Ring & Level */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:border-sky-300 dark:hover:border-sky-500/30 transition-colors shadow-sm">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 dark:bg-sky-500/5 rounded-full blur-3xl group-hover:bg-sky-100 dark:group-hover:bg-sky-500/10 transition-colors" />
                        
                        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                            {/* SVG Ring Background */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="88" strokeWidth="12" stroke="currentColor" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                                <circle 
                                    cx="96" cy="96" r="88" 
                                    strokeWidth="12" stroke="currentColor" fill="transparent" 
                                    className="text-sky-500 transition-all duration-1000 ease-out" 
                                    strokeDasharray={552.92} /* 2 * PI * r */
                                    strokeDashoffset={552.92 - (552.92 * xpProgress) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-slate-900 dark:text-white">{level}</span>
                                <span className="text-sm font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mt-1">{t('stats.level')}</span>
                            </div>
                        </div>

                        <div className="text-center z-10">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{xp} / {xpRequired} XP</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('stats.earnMore').replace('{amount}', String(xpRequired - xp)).replace('{next}', String(level + 1))}</p>
                        </div>
                    </div>

                    {/* Virtual Pet */}
                    <div className="lg:col-span-2 flex flex-col justify-center">
                        <SkillPet
                            xp={xp}
                            user={user}
                            globalRank={rewards?.rank_percent != null ? `Top ${rewards.rank_percent}%` : undefined}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Leaderboard */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-sm">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" /> {t('stats.leaderboard')}
                            </h3>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full">{t('stats.top10')}</span>
                        </div>
                        
                        <div className="flex-1 p-2">
                            {loading ? (
                                <div className="h-64 flex justify-center items-center text-slate-500">Loading...</div>
                            ) : (
                                <div className="space-y-1">
                                    {leaderboard.map((u, index) => (
                                        <div key={u.id} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${user?.id === u.id ? 'bg-sky-50 dark:bg-sky-900/40 border border-sky-200 dark:border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.05)] dark:shadow-[0_0_20px_rgba(14,165,233,0.1)]' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm
                                                    ${index === 0 ? 'bg-amber-400 text-amber-950 shadow-[0_0_15px_rgba(251,191,36,0.3)] dark:shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 
                                                    index === 1 ? 'bg-slate-200 dark:bg-slate-300 text-slate-800 dark:text-slate-900' : 
                                                    index === 2 ? 'bg-orange-300 dark:bg-orange-400 text-orange-950' : 'text-slate-500 font-bold'}`}>
                                                    #{index + 1}
                                                </div>
                                                <div>
                                                    <div className="text-slate-900 dark:text-white font-bold">{u.name} {user?.id === u.id && <span className="text-sky-600 dark:text-sky-400 ml-1">{t('stats.you')}</span>}</div>
                                                    <div className="text-xs text-slate-500 uppercase font-semibold">{t('stats.level')} {u.level}</div>
                                                </div>
                                            </div>
                                            <div className="text-sky-600 dark:text-sky-400 font-black tracking-wider bg-sky-100 dark:bg-sky-500/10 px-3 py-1 rounded-full">{u.xp_points} XP</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rewards & Prizes */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-sm">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Target className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> {t('stats.milestones')}
                            </h3>
                        </div>
                        
                        <div className="flex-1 p-6">
                            {loading ? (
                                <div className="h-64 flex justify-center items-center text-slate-500">Loading...</div>
                            ) : (
                                <div className="space-y-4">
                                    {rewards?.prizes?.map((prize: any) => (
                                        <div key={prize.id} className={`group relative p-5 rounded-2xl border transition-all duration-300 flex items-center gap-5 ${prize.unlocked ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/40' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80 dark:opacity-60'}`}>
                                            {prize.unlocked && (
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 dark:bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-200/50 dark:group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
                                            )}

                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${prize.unlocked ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'}`}>
                                                {prize.unlocked ? <CheckCircle2 className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
                                            </div>

                                            <div className="flex-1">
                                                <h4 className={`text-lg font-bold mb-0.5 ${prize.unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{prize.name}</h4>
                                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-500">{prize.description}</p>
                                                {prize.xp_required && (
                                                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1 flex items-center gap-1">
                                                        <Zap className="w-3 h-3"/>
                                                        {prize.unlocked ? t('stats.achieved') : `${prize.xp_required} XP required`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
