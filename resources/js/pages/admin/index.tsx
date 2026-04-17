import { motion } from 'framer-motion';
import { Users, BookOpen, Briefcase, Zap, TrendingUp, Shield, Clock, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/skorge/AppLayout';
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

const StatCard = ({ label, value, icon: Icon, color, bg, border, href, index }: any) => {
    const cardContent = (
        <div className={`relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-pointer h-full ${border} group z-10`}>
            {/* Ambient Background Glow */}
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${bg} blur-3xl opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 pointer-events-none`} />
            
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mb-4 ${bg} border border-white/20 dark:border-white/5`}>
                <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <div className="relative z-10">
                <div className="text-3xl font-black text-slate-800 dark:text-white mb-1 tracking-tight">{value?.toLocaleString?.() ?? value}</div>
                <div className="text-xs font-bold text-slate-500/80 dark:text-slate-400 uppercase tracking-widest">{label}</div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex h-full"
        >
            {href ? <Link to={href} className="w-full">{cardContent}</Link> : <div className="w-full">{cardContent}</div>}
        </motion.div>
    );
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariant = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
};

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
        <AppLayout title="Admin Command Center" description="Premium analytics and platform overview">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-[120px]" />
            </div>

            {/* Header Badge */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-black tracking-widest uppercase shadow-lg shadow-rose-500/5"
            >
                <Shield className="w-4 h-4" />
                System Administrator
            </motion.div>

            {/* Key Metrics */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-40 bg-slate-200/50 dark:bg-slate-800/40 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                    <StatCard index={0} label="Total Users" value={stats?.total_users} icon={Users} color="text-cyan-600 dark:text-cyan-400" bg="bg-cyan-100 dark:bg-cyan-500/20" border="border-cyan-200 dark:border-cyan-500/30 hover:border-cyan-400" href="/admin/users" />
                    <StatCard index={1} label="Total Courses" value={stats?.total_courses} icon={BookOpen} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-100 dark:bg-emerald-500/20" border="border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-400" href="/admin/courses" />
                    <StatCard index={2} label="Job Roles" value={stats?.total_job_roles} icon={Briefcase} color="text-amber-600 dark:text-amber-400" bg="bg-amber-100 dark:bg-amber-500/20" border="border-amber-200 dark:border-amber-500/30 hover:border-amber-400" href="/admin/job-roles" />
                    <StatCard index={3} label="Total XP Earned" value={stats?.total_xp} icon={Zap} color="text-orange-600 dark:text-orange-400" bg="bg-orange-100 dark:bg-orange-500/20" border="border-orange-200 dark:border-orange-500/30 hover:border-orange-400" />
                    <StatCard index={4} label="Active Today" value={stats?.active_today} icon={TrendingUp} color="text-violet-600 dark:text-violet-400" bg="bg-violet-100 dark:bg-violet-500/20" border="border-violet-200 dark:border-violet-500/30 hover:border-violet-400" />
                    <StatCard index={5} label="Admin Accounts" value={stats?.total_admins} icon={Shield} color="text-rose-600 dark:text-rose-400" bg="bg-rose-100 dark:bg-rose-500/20" border="border-rose-200 dark:border-rose-500/30 hover:border-rose-400" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Recent Registrations */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-slate-200/20 dark:shadow-none"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                            <Clock className="w-6 h-6 text-cyan-500" />
                            Recent Registrations
                        </h2>
                        <Link to="/admin/users" className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-14 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : recentUsers.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-4 font-medium">No users yet.</p>
                    ) : (
                        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3">
                            {recentUsers.map((u) => (
                                <motion.div variants={itemVariant} key={u.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-300 group">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-orange-400 flex items-center justify-center text-white font-black text-base shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-bold text-slate-800 dark:text-white truncate">{u.name}</p>
                                        <p className="text-xs font-semibold text-slate-400 truncate tracking-wide">{u.email}</p>
                                    </div>
                                    <span className="text-sm font-black text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-200/50 dark:border-amber-500/20">{u.xp_points} XP</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>

                {/* Top Users by XP */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-slate-200/20 dark:shadow-none relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                            <Zap className="w-6 h-6 text-amber-500" />
                            Top Users by XP
                        </h2>
                    </div>
                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-14 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : topUsers.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-4 font-medium">No users yet.</p>
                    ) : (
                        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-3 relative z-10">
                            {topUsers.map((u, i) => (
                                <motion.div variants={itemVariant} key={u.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-300 group">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border group-hover:scale-110 transition-transform ${
                                        i === 0 ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500/30' :
                                        i === 1 ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600' :
                                        'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20'
                                    }`}>
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-bold text-slate-800 dark:text-white truncate">{u.name}</p>
                                        <p className="text-xs font-semibold text-slate-400 tracking-wide">{u.current_streak ?? 0} day streak</p>
                                    </div>
                                    <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">{u.xp_points?.toLocaleString?.()} XP</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
                {[
                    { label: 'Manage Users', desc: 'View, edit roles, delete users', href: '/admin/users', icon: Users, color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
                    { label: 'Manage Courses', desc: 'Videos, levels, metadata', href: '/admin/courses', icon: BookOpen, color: 'from-emerald-400 to-emerald-600', shadow: 'shadow-emerald-500/20' },
                    { label: 'Manage Job Roles', desc: 'Create paths, link courses', href: '/admin/job-roles', icon: Briefcase, color: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/20' },
                ].map((action, i) => (
                    <Link
                        key={action.href}
                        to={action.href}
                        className={`group relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/50 rounded-3xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 hover:${action.shadow}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3`}>
                            <action.icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{action.label}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{action.desc}</p>
                        
                        <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500 transition-colors duration-300">
                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                    </Link>
                ))}
            </motion.div>

            {/* System Actions Standalone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-6 mb-12 flex justify-center"
            >
                <Link
                    to="/admin/system"
                    className="group w-full max-w-lg flex items-center gap-4 bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/50 rounded-2xl p-4 hover:-translate-y-1 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300"
                >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-slate-800 dark:text-white truncate">System Overview</h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">Database, monitoring, & architecture</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-700/50 flex items-center justify-center shrink-0 group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20 transition-colors">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                    </div>
                </Link>
            </motion.div>
        </AppLayout>
    );
}
