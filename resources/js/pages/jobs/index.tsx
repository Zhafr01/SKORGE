import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/skorge/AppLayout';
import { Briefcase, MapPin, DollarSign, ExternalLink, Search, Sparkles, Building2, Clock, CheckCircle2, X, Bookmark, BookmarkCheck } from 'lucide-react';
import { DialCarouselLayout } from '@/components/skorge/DialCarouselLayout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';


const DUMMY_JOBS = [
    {
        id: 1,
        title: 'Frontend React Developer',
        company: 'TechFlow Solutions',
        location: 'Remote, US',
        type: 'Full-time',
        salary: '$80k – $120k',
        skills: ['React', 'TypeScript', 'Tailwind CSS'],
        logo: 'from-blue-500 to-cyan-500',
        url: 'https://linkedin.com/jobs',
        description: 'Build scalable React interfaces for our B2B SaaS platform. You\'ll work closely with the product team to deliver pixel-perfect, high-performance components.',
    },
    {
        id: 2,
        title: 'UI Component Engineer',
        company: 'Designmodo',
        location: 'Hybrid, New York',
        type: 'Contract',
        salary: '$60/hr',
        skills: ['Vue', 'CSS Architecture', 'Figma'],
        logo: 'from-emerald-500 to-teal-500',
        url: 'https://designmodo.com/jobs',
        description: 'Design and implement a world-class component library used by thousands of developers. Deep Figma-to-code expertise required.',
    },
    {
        id: 3,
        title: 'Junior Web Developer',
        company: 'StartupX',
        location: 'Remote, Global',
        type: 'Full-time',
        salary: '$60k – $80k',
        skills: ['HTML/CSS', 'JavaScript', 'Git'],
        logo: 'from-orange-500 to-pink-500',
        url: 'https://startupx.io/careers',
        description: 'Join a fast-moving early-stage startup. Great opportunity to learn across the full stack while shipping real features every week.',
    },
    {
        id: 4,
        title: 'Data Analyst Intern',
        company: 'DataMetrics',
        location: 'On-site, London',
        type: 'Internship',
        salary: 'Paid',
        skills: ['SQL', 'Python', 'Excel'],
        logo: 'from-amber-500 to-orange-500',
        url: 'https://datametrics.io/careers',
        description: 'Help analyze user behavior and revenue metrics that inform product decisions. Great for building a real portfolio of business impact.',
    },
];



interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    skills: string[];
    logo: string;
    url: string;
    description: string;
    matchScore?: number;
}

export default function JobBoardIndex() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [applyJob, setApplyJob] = useState<Job | null>(null);
    const [savedJobIds, setSavedJobIds] = useState<number[]>([]);
    const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [viewMode, setViewMode] = useState<'dial' | 'grid'>('dial');

    useEffect(() => {
        async function fetchScoredJobs() {
            try {
                const onboardingAnswers: Record<string, string> = JSON.parse(
                    localStorage.getItem('skorge_onboarding') || '{}'
                );
                const interest = onboardingAnswers.interest || null;

                const jobInputs = DUMMY_JOBS.map(j => ({ id: j.id, skills: j.skills }));

                const response = await fetch('/api/ai/match-jobs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ interest, jobs: jobInputs })
                });

                const data = await response.json();
                const scoreMap = new Map<number, number>(data.jobs.map((j: any) => [Number(j.id), Number(j.matchScore)]));

                const scored = DUMMY_JOBS.map((job) => ({
                    ...job,
                    matchScore: Number(scoreMap.get(job.id)) || 0,
                })).sort((a, b) => Number(b.matchScore || 0) - Number(a.matchScore || 0));

                setJobs(scored);
                setJobs(scored);
            } catch (error) {
                console.error("Failed to match jobs, falling back to client-side matching:", error);
                const onboardingAnswers: Record<string, string> = JSON.parse(
                    localStorage.getItem('skorge_onboarding') || '{}'
                );
                const interest = (onboardingAnswers.interest || '').toLowerCase();
                
                const INTEREST_SKILL_MAP: Record<string, string[]> = {
                    'programming': ['React', 'JavaScript', 'HTML/CSS', 'TypeScript', 'Node.js'],
                    'design': ['Figma', 'CSS Architecture', 'Vue'],
                    'data': ['SQL', 'Python', 'Excel'],
                    'marketing': ['SEO'],
                };

                const userSkills = INTEREST_SKILL_MAP[interest] || [];

                const scored = DUMMY_JOBS.map((job) => {
                    let matchScore = 0;
                    if (userSkills.length > 0) {
                        const overlap = job.skills.filter(s => userSkills.includes(s));
                        matchScore = Math.floor((overlap.length / job.skills.length) * 100);
                        if (matchScore === 0 && interest.includes('engineering') && job.title.toLowerCase().includes('developer')) matchScore = 60;
                        if (matchScore === 0 && interest.includes('design') && job.title.toLowerCase().includes('design')) matchScore = 60;
                    }
                    if (matchScore > 0 && matchScore < 50) matchScore += 30; // bump it up so some show as high match
                    if (matchScore > 100) matchScore = 100;
                    if (userSkills.length > 0 && matchScore === 0) matchScore = Math.floor(Math.random() * 40) + 20;

                    return { ...job, matchScore };
                }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

                setJobs(scored);
            }
        }
        fetchScoredJobs();

        const saved: number[] = JSON.parse(localStorage.getItem('skorge_saved_jobs') || '[]');
        setSavedJobIds(saved);
        const applied: number[] = JSON.parse(localStorage.getItem('skorge_applied_jobs') || '[]');
        setAppliedJobIds(applied);
    }, []);

    const filteredJobs = jobs.filter((j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase())
    );

    const handleApply = (job: Job) => {
        setApplyJob(job);
    };

    const handleConfirmApply = (job: Job) => {
        if (job.url !== '#') {
            window.open(job.url, '_blank', 'noopener,noreferrer');
        }
        const updated = [...new Set([...appliedJobIds, job.id])];
        setAppliedJobIds(updated);
        localStorage.setItem('skorge_applied_jobs', JSON.stringify(updated));
        setApplyJob(null);
    };

    const handleSaveJob = (job: Job) => {
        let updated: number[];
        if (savedJobIds.includes(job.id)) {
            updated = savedJobIds.filter((id) => id !== job.id);
        } else {
            updated = [...savedJobIds, job.id];
        }
        setSavedJobIds(updated);
        localStorage.setItem('skorge_saved_jobs', JSON.stringify(updated));
    };

    if (viewMode === 'dial' && filteredJobs.length > 0) {
        return (
            <DialCarouselLayout
                items={filteredJobs}
                title="Job Board"
                subtitle="Your Next Big Move"
                onToggleView={() => setViewMode('grid')}
                renderDialItemText={(item) => item.title}
                renderDialItemIcon={(item) => <Building2 className="w-6 h-6" />}
                renderDetail={(item) => (
                    <div className="flex flex-col max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-sm">
                                {item.company}
                            </span>
                            {(item.matchScore ?? 0) >= 85 && (
                                <span className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-500/20 backdrop-blur-md border border-emerald-300/50 dark:border-emerald-500/30 shadow-sm">
                                    <Sparkles className="w-4 h-4" /> {t('jobs.highMatch')} ({item.matchScore}%)
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black mb-4 tracking-tighter text-slate-900 dark:text-white drop-shadow-sm leading-tight">
                            {item.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400 mb-6">
                            <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg backdrop-blur-sm"><MapPin className="w-4 h-4 text-sky-500" /> {item.location}</div>
                            <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg backdrop-blur-sm"><Clock className="w-4 h-4 text-purple-500" /> {item.type}</div>
                            <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg backdrop-blur-sm"><DollarSign className="w-4 h-4 text-emerald-500" /> {item.salary}</div>
                        </div>

                        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-lg">
                            {item.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {item.skills.map(s => (
                                <span key={s} className="px-3 py-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-[10px] uppercase tracking-widest text-slate-700 dark:text-slate-300">
                                    {s}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                            <button
                                onClick={() => handleConfirmApply(item)}
                                disabled={appliedJobIds.includes(item.id)}
                                className={`flex-1 sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl ${
                                    appliedJobIds.includes(item.id)
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                                        : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.5)]'
                                }`}
                            >
                                {appliedJobIds.includes(item.id) ? t('jobs.applied') : <><ExternalLink className="w-5 h-5" /> Quick Apply</>}
                            </button>
                            <button
                                onClick={() => handleSaveJob(item)}
                                className={`px-6 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center border hover:scale-105 shadow-xl ${
                                    savedJobIds.includes(item.id)
                                        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500/30 backdrop-blur-md'
                                        : 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                {savedJobIds.includes(item.id) ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                )}
            />
        );
    }

    return (
        <AppLayout
            title={t('jobs.title')}
            description={t('jobs.subtitle')}
        >
            <div className="flex justify-end mb-4">
                <button 
                    onClick={() => setViewMode('dial')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm hover:border-sky-500 transition-colors"
                >
                    <Briefcase className="w-4 h-4 text-sky-500" /> Switch to Dial View
                </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
                {/* Main Job Listing */}
                <div className="w-full lg:w-2/3 space-y-6">
                    {/* Immersive Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="relative p-2 bg-white/40 dark:bg-[rgba(11,17,32,0.6)] backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-[2rem] shadow-xl"
                    >
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 dark:text-sky-300" />
                        <input
                            type="text"
                            placeholder={t('jobs.searchPlaceholder', { defaultValue: 'Search roles, companies, keywords...' })}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-16 pr-6 py-4 bg-transparent border-none text-slate-900 dark:text-white text-lg rounded-[2rem] focus:outline-none focus:ring-0 transition-colors placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                        />
                    </motion.div>

                    {filteredJobs.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/60 dark:border-slate-800 border-dashed">
                            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-4 shadow-inner">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('jobs.noJobs')}</h3>
                            <p className="text-slate-500 dark:text-slate-500 text-sm">{t('jobs.noJobsDesc')}</p>
                        </div>
                    ) : (
                        <div className="space-y-6 mt-8">
                            {filteredJobs.map((job, idx) => (
                                <motion.div 
                                    key={job.id} 
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true, margin: "-20px" }}
                                    transition={{ duration: 0.6, delay: idx * 0.1, type: "spring" }}
                                    className="bg-white/60 dark:bg-[rgba(11,17,32,0.6)] backdrop-blur-xl border border-white/60 dark:border-white/5 rounded-3xl p-6 hover:border-sky-400/50 dark:hover:border-sky-500/40 hover:shadow-[0_10px_30px_rgba(14,165,233,0.15)] transition-all group flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden"
                                >
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-sky-400/10 to-teal-500/10 rounded-full blur-[30px] group-hover:scale-150 transition-all duration-700 pointer-events-none"></div>

                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${job.logo} flex items-center justify-center shrink-0 shadow-lg relative z-10`}>
                                        <Building2 className="w-8 h-8 text-white opacity-90 shadow-sm" />
                                    </div>

                                    <div className="flex-1 relative z-10">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors drop-shadow-sm">{job.title}</h3>
                                            {(job.matchScore ?? 0) >= 85 && (
                                                <span className="flex items-center gap-1 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-500/20 backdrop-blur-md border border-emerald-300/50 dark:border-emerald-500/30 rounded-lg shadow-sm">
                                                    <Sparkles className="w-3 h-3" /> {t('jobs.highMatch')} ({job.matchScore}%)
                                                </span>
                                            )}
                                            {appliedJobIds.includes(job.id) && (
                                                <span className="flex items-center gap-1 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-500/20 backdrop-blur-md border border-sky-300/50 dark:border-sky-500/30 rounded-lg shadow-sm">
                                                    <CheckCircle2 className="w-3 h-3" /> {t('jobs.applied')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">{job.company}</p>

                                        <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-slate-600 dark:text-slate-400 mb-4">
                                            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-sky-500" /> {job.location}</div>
                                            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-purple-500" /> {job.type}</div>
                                            <div className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-500" /> {job.salary}</div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.map((s) => (
                                                <span key={s} className="px-3 py-1 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-lg font-bold text-[10px] uppercase tracking-wide text-slate-700 dark:text-slate-300 shadow-sm">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="sm:text-right shrink-0 mt-4 sm:mt-0 w-full sm:w-auto flex sm:flex-col gap-3 relative z-10">
                                        <button
                                            onClick={() => handleApply(job)}
                                            disabled={appliedJobIds.includes(job.id)}
                                            className={`flex-1 sm:w-auto px-6 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                                                appliedJobIds.includes(job.id)
                                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                                                    : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white border border-transparent shadow-sky-500/30 hover:scale-105'
                                            }`}
                                        >
                                            {appliedJobIds.includes(job.id) ? t('jobs.applied') : <><ExternalLink className="w-4 h-4" /> {t('jobs.apply')}</>}
                                        </button>
                                        <button
                                            onClick={() => handleSaveJob(job)}
                                            className={`px-4 py-3 rounded-2xl font-bold transition-all flex items-center justify-center border hover:scale-105 shadow-sm ${
                                                savedJobIds.includes(job.id)
                                                    ? 'bg-amber-100/50 dark:bg-[rgba(245,158,11,0.2)] backdrop-blur text-amber-600 dark:text-amber-400 border-amber-300/50 dark:border-amber-500/30'
                                                    : 'bg-white/60 dark:bg-white/5 backdrop-blur text-slate-500 dark:text-slate-400 border-white/60 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                            title={savedJobIds.includes(job.id) ? 'Unsave' : t('jobs.saveForLater')}
                                        >
                                            {savedJobIds.includes(job.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Metrics */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl" />
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-lg">{t('jobs.profileTitle')}</h3>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 dark:text-slate-400 font-medium">{t('jobs.completeness')}</span>
                                    <span className="text-sky-600 dark:text-sky-400 font-bold">85%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 w-full overflow-hidden">
                                    <div className="h-full bg-sky-500 w-[85%] rounded-full" />
                                </div>
                            </div>

                            <ul className="space-y-3 pt-2">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('jobs.resumeAuto', { defaultValue: 'Resume auto-generated' })}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('jobs.certsEarned', { defaultValue: '2 Certifications earned' })}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('jobs.projectsDone', { defaultValue: '1 Real-World Project completed' })}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-sky-50 dark:from-sky-900/40 to-orange-50 dark:to-orange-900/40 border border-sky-200 dark:border-sky-500/20 rounded-3xl p-6">
                        <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center mb-4">
                            <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white mb-2">{t('jobs.increaseMatch')}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                            {t('jobs.coursePitch', { defaultValue: 'Completing the "Advanced React Patterns" module will instantly qualify you for 15+ more roles in our network.' })}
                        </p>
                        <Link to="/courses/5" className="text-sky-600 dark:text-sky-400 font-bold text-sm hover:underline flex items-center gap-1">
                            {t('jobs.goToCourse')} <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {applyJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{applyJob.title}</h3>
                                <p className="text-sky-600 dark:text-sky-400 font-semibold text-sm">{applyJob.company}</p>
                            </div>
                            <button onClick={() => setApplyJob(null)} className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">{applyJob.description}</p>

                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-transparent mb-6">
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {applyJob.location}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {applyJob.type}</span>
                                <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {applyJob.salary}</span>
                            </div>
                        </div>

                        {applyJob.url === '#' ? (
                            <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                                🚧 {t('jobs.comingSoon', { defaultValue: 'Application portal coming soon for this listing.' })}
                            </div>
                        ) : (
                            <button
                                onClick={() => handleConfirmApply(applyJob)}
                                className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                <ExternalLink className="w-4 h-4" /> {t('jobs.applyOnSite')}
                            </button>
                        )}

                        <button
                            onClick={() => { handleSaveJob(applyJob); setApplyJob(null); }}
                            className="w-full mt-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition-all text-sm border border-slate-200 dark:border-slate-700"
                        >
                            {savedJobIds.includes(applyJob.id) ? t('jobs.alreadySaved') : t('jobs.saveForLater')}
                        </button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
