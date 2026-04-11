import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/skorge/AppLayout';
import { Users, BookOpen, Briefcase, Zap, TrendingUp, CircleUser, Clock, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';

interface AdminStats {
    total_users: number;
    total_admins: number;
    total_courses: number;
    total_job_roles: number;
    total_xp: number;
    active_today: number;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    xp_points: number;
    created_at: string;
}

interface TopUser {
    id: number;
    name: string;
    email: string;
    xp_points: number;
    current_streak: number;
}

const StatCard = ({ label, value, icon: Icon, color, bg, border, href }: any) => (
    <Link
        to={href ?? '#'}
        className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 cursor-pointer ${border}`}
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <div className="text-2xl font-black text-slate-800 dark:text-white">{value?.toLocaleString?.() ?? value}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
        </div>
    </Link>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [topUsers, setTopUsers] = useState<TopUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats')
            .then((res) => {
                const d = res.data?.data;
                setStats(d.stats);
                setRecentUsers(d.recent_users ?? []);
                setTopUsers(d.top_users ?? []);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <AppLayout title="Admin Panel" description="Platform management & analytics overview">
            {/* Admin badge */}
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-sm font-bold">
                <Shield className="w-4 h-4" />
                Administrator Access
            </div>

            {/* Stat Cards */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <StatCard label="Total Users" value={stats?.total_users} icon={Users} color="text-sky-500" bg="bg-sky-100 dark:bg-sky-500/10" border="border-sky-200 dark:border-sky-500/20" href="/admin/users" />
                    <StatCard label="Total Courses" value={stats?.total_courses} icon={BookOpen} color="text-emerald-500" bg="bg-emerald-100 dark:bg-emerald-500/10" border="border-emerald-200 dark:border-emerald-500/20" href="/admin/courses" />
                    <StatCard label="Job Roles" value={stats?.total_job_roles} icon={Briefcase} color="text-amber-500" bg="bg-amber-100 dark:bg-amber-500/10" border="border-amber-200 dark:border-amber-500/20" href="/admin/job-roles" />
                    <StatCard label="Total XP Earned" value={stats?.total_xp} icon={Zap} color="text-orange-500" bg="bg-orange-100 dark:bg-orange-500/10" border="border-orange-200 dark:border-orange-500/20" />
                    <StatCard label="Active Today" value={stats?.active_today} icon={TrendingUp} color="text-violet-500" bg="bg-violet-100 dark:bg-violet-500/10" border="border-violet-200 dark:border-violet-500/20" />
                    <StatCard label="Admin Accounts" value={stats?.total_admins} icon={Shield} color="text-rose-500" bg="bg-rose-100 dark:bg-rose-500/10" border="border-rose-200 dark:border-rose-500/20" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Registrations */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-sky-500" />
                            Recent Registrations
                        </h2>
                        <Link to="/admin/users" className="text-sm text-sky-500 hover:text-sky-400 font-semibold flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : recentUsers.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-4">No users yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentUsers.map((u) => (
                                <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{u.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                                    </div>
                                    <span className="text-xs font-bold text-amber-500">{u.xp_points} XP</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Users by XP */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Top Users by XP
                        </h2>
                    </div>
                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : topUsers.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-4">No users yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {topUsers.map((u, i) => (
                                <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${
                                        i === 0 ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                                        i === 1 ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300' :
                                        'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                                    }`}>
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{u.name}</p>
                                        <p className="text-xs text-slate-400">{u.current_streak ?? 0} day streak</p>
                                    </div>
                                    <span className="text-sm font-black text-amber-500">{u.xp_points?.toLocaleString?.()} XP</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Manage Users', desc: 'View, edit roles, delete users', href: '/admin/users', icon: Users, color: 'from-sky-500 to-sky-600' },
                    { label: 'Manage Courses', desc: 'Create, edit, delete courses', href: '/admin/courses', icon: BookOpen, color: 'from-emerald-500 to-emerald-600' },
                    { label: 'Manage Job Roles', desc: 'Create, edit, delete job roles', href: '/admin/job-roles', icon: Briefcase, color: 'from-amber-500 to-orange-500' },
                ].map((action) => (
                    <Link
                        key={action.href}
                        to={action.href}
                        className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                    >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg mb-4`}>
                            <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white mb-1">{action.label}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{action.desc}</p>
                        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 transition-colors absolute bottom-5 right-5" />
                    </Link>
                ))}
            </div>
        </AppLayout>
    );
}
