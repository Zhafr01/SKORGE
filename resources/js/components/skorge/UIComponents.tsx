import React from 'react';

interface ProgressBarProps {
    progress: number;
    className?: string;
    showLabel?: boolean;
}

export function ProgressBar({ progress, className = '', showLabel = true }: ProgressBarProps) {
    // Ensure progress is between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    
    return (
        <div className={`w-full ${className}`}>
            {showLabel && (
                <div className="flex justify-between items-end mb-1.5">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Progress</span>
                    <span className="text-xs font-bold text-sky-400">{clampedProgress}%</span>
                </div>
            )}
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-sky-500 to-orange-500 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${clampedProgress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------

interface SkillBadgeProps {
    skill: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export function SkillBadge({ skill, level }: SkillBadgeProps) {
    const levelColors = {
        Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        Advanced: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${level ? levelColors[level] : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
            {skill}
        </span>
    );
}
