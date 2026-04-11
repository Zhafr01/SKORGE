import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen, Lock, Unlock } from 'lucide-react';
import { ProgressBar } from './UIComponents';
import { useTranslation } from '@/lib/i18n';

interface CourseCardProps {
    course: any;
    href: string;
    progress?: number;
    status?: 'locked' | 'unlocked' | 'completed';
}

export function CourseCard({ course, href, progress, status }: CourseCardProps) {
    const isLocked = status === 'locked';
    const { t } = useTranslation();
    
    return (
        <Link 
            to={isLocked ? '#' : href} 
            className={`group relative flex flex-col bg-white/60 dark:bg-[rgba(11,17,32,0.6)] backdrop-blur-2xl border ${isLocked ? 'border-white/40 dark:border-white/5 opacity-60' : 'border-white/60 dark:border-white/5 hover:border-sky-400/50 dark:hover:border-sky-500/40'} rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] hover:-translate-y-2 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} h-full`}
        >
            {/* Ambient Inner Glow Effect */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-sky-400/20 to-teal-500/20 rounded-full blur-[40px] group-hover:scale-150 group-hover:from-sky-400/40 transition-all duration-700 z-0"></div>

            {/* Full Card Cover Image */}
            <div className="absolute inset-0 z-0">
                {course.thumbnail ? (
                    <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-tr ${
                        course.field === 'IT' ? 'from-blue-900 to-sky-900' : 
                        course.field === 'Design' ? 'from-fuchsia-900 to-pink-900' : 
                        'from-emerald-900 to-teal-900'
                    } transition-transform duration-700 group-hover:scale-110`}></div>
                )}
            </div>

            {/* Cinematic Gradient Overlay (Dark to transparent) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/70 to-transparent z-10 transition-opacity duration-500 opacity-90 group-hover:opacity-75"></div>
            
            {/* Lock Overlay */}
            {isLocked && (
                <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm z-20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center shadow-2xl">
                        <Lock className="w-6 h-6 text-slate-400" />
                    </div>
                </div>
            )}
            
            {status === 'completed' && (
                <div className="absolute top-4 right-4 z-30 bg-emerald-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur flex items-center gap-1.5">
                    <Unlock className="w-3 h-3" />
                    {t('course.completed')}
                </div>
            )}

            {/* Top Badges */}
            <div className="absolute top-4 left-4 z-30 flex gap-2">
                <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                    {t('courses.level.' + course.level.toLowerCase(), { defaultValue: course.level })}
                </span>
                <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    {course.duration_minutes}m
                </span>
            </div>

            {/* Content Body (Floating on Bottom) */}
            <div className="p-6 flex flex-col flex-1 relative z-30 justify-end min-h-[300px]">
                <h3 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-md group-hover:text-sky-300 transition-colors">
                    {course.title}
                </h3>
                <p className="text-sm text-slate-300 line-clamp-2 mb-6 drop-shadow-sm font-medium">
                    {course.description || t('course.defaultDesc', { defaultValue: 'Master the foundations of this critical skill to advance your targeted career path.' })}
                </p>
                
                <div className="mt-auto border-t border-white/20 pt-4">
                    {progress !== undefined ? (
                        <ProgressBar progress={progress} />
                    ) : (
                        <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-medium text-slate-400">SKORGE Expert</span>
                            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                                <span>{t('courses.start', { defaultValue: 'Start Learning' })}</span>
                                <PlayCircle className="w-5 h-5 drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
