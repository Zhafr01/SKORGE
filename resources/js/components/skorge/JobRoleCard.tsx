import { ArrowRight, Briefcase, Zap, BookOpen, Clock } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';

interface JobRoleCardProps {
    role: any;
    href: string;
    isFeatured?: boolean; // Kept for prop-type compatibility, but ignored in layout
}

export function JobRoleCard({ role, href }: JobRoleCardProps) {
    const { t } = useTranslation();

    return (
        <Link 
            to={href}
            className="group flex flex-col border border-white/60 dark:border-white/5 rounded-[2rem] p-8 transition-all duration-700 hover:border-cyan-400/50 hover:shadow-[0_20px_50px_rgba(14,165,233,0.2)] hover:-translate-y-3 relative overflow-hidden h-full min-h-[300px]"
        >
            {/* Immersive Animated Background inside Card */}
            <div className="absolute inset-0 z-0 bg-white/60 dark:bg-[#0B1120]/80 backdrop-blur-2xl">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-cyan-400/30 to-purple-500/30 rounded-full blur-[50px] group-hover:scale-150 group-hover:from-cyan-400/50 transition-all duration-1000"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-fuchsia-400/20 to-orange-400/20 rounded-full blur-[50px] group-hover:scale-150 transition-all duration-1000"></div>
            </div>

            <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-white to-slate-50 dark:from-cyan-500/20 dark:to-purple-500/20 border border-white dark:border-white/10 flex items-center justify-center text-cyan-500 dark:text-cyan-300 shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-xl shadow-cyan-500/10">
                    {role.icon === 'code' ? <Zap className="w-8 h-8 drop-shadow-[0_2px_4px_rgba(14,165,233,0.5)]" /> : <Briefcase className="w-8 h-8 drop-shadow-[0_2px_4px_rgba(14,165,233,0.5)]" />}
                </div>
                
                <div className="flex gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-slate-900/10 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm">
                        {role.category || 'Engineering'}
                    </span>
                </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors duration-300 relative z-10 drop-shadow-sm">
                {role.name}
            </h3>

            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed line-clamp-2 mt-1 mb-6 group-hover:line-clamp-4 transition-all duration-500 ease-in-out flex-grow relative z-10 font-medium">
                {role.description || "Master the precise skills required by top employers to land this role."}
            </p>

            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 mb-2 relative z-10">
                <div className="overflow-hidden flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs text-cyan-800 dark:text-cyan-200 font-bold bg-white/50 dark:bg-white/10 backdrop-blur border border-white/50 dark:border-white/20 p-3 rounded-2xl shadow-sm">
                        <Zap className="w-4 h-4 text-amber-500"/> {t('roles.highDemand', { defaultValue: 'High Demand Path' })}
                    </div>
                </div>
            </div>

            {/* Bottom Metrics */}
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-200/50 dark:border-white/10 group-hover:border-cyan-500/40 transition-colors relative z-10">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                        <BookOpen className="w-5 h-5 text-cyan-500 drop-shadow-sm" />
                        <span className="text-sm font-black">{role.courses_count || '12'} <span className="font-bold text-slate-400 text-[10px] uppercase">{t('dashboard.statCourses', { defaultValue: 'Modules' }).split(' ')[0]}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                        <Clock className="w-5 h-5 text-orange-400 drop-shadow-sm" />
                        <span className="text-sm font-black">{(role.courses_count || 12) * 5} <span className="font-bold text-slate-400 text-[10px] uppercase">{t('dashboard.statHours', { defaultValue: 'Hours' }).split(' ')[1] || 'Jam'}</span></span>
                    </div>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
}
