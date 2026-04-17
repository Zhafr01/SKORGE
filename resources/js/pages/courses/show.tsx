import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, Lock, MessageSquare, ChevronRight, Award, Bookmark, Send, Check, Maximize, Minimize, FileEdit, Sparkles, ExternalLink } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppLayout from '@/components/skorge/AppLayout';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';

const DEMO_VIDEOS = [
    { id: 1, title: 'Introduction to React Hooks', duration_seconds: 712, unlocked: true, completed: false, youtube_id: 'TNhaISOUy6Q' },
    { id: 2, title: 'Building Custom Hooks', duration_seconds: 956, unlocked: false, completed: false, youtube_id: 'J-g9ZJha8FE' },
    { id: 3, title: 'Context API Explained', duration_seconds: 1083, unlocked: false, completed: false, youtube_id: 'rFnfvhtrNbQ' },
    { id: 4, title: 'Performance Optimisation', duration_seconds: 843, unlocked: false, completed: false, youtube_id: '8-M-VUFfm5Y' },
];

const DEMO_COURSE = {
    id: 1,
    title: 'React Modern Patterns',
    level: 'Advanced',
    field: 'IT',
    description: 'Take your React skills to the next level. Master hooks, context, suspense, and modern performance optimisation techniques used by top engineering teams worldwide.',
    slug: 'react-modern-patterns',
};

const STORAGE_KEY_PREFIX = 'skorge_course_';
const NOTES_KEY_PREFIX = 'skorge_notes_';

interface Comment {
    author: string;
    msg: string;
    ago: string;
}

export default function CourseShow() {
    const { id } = useParams();
    const { t } = useTranslation();
    const { user, refreshUser } = useAuth();
    const [course, setCourse] = useState<any>(DEMO_COURSE);
    const [videos, setVideos] = useState<any[]>([]);
    const [activeVideo, setActiveVideo] = useState<any>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [activeTab, setActiveTab] = useState<'discussion'|'notes'>('discussion');
    const [notes, setNotes] = useState('');
    const [isChatExpanded, setIsChatExpanded] = useState(false);
    
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentPosted, setCommentPosted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [embedError, setEmbedError] = useState(false);

    const storageKey = `${STORAGE_KEY_PREFIX}${id}`;
    const notesKey = `${NOTES_KEY_PREFIX}${id}`;
    const myCoursesKey = 'skorge_my_courses';

    // Initialization
    useEffect(() => {
        const savedProgress = localStorage.getItem(storageKey);
        let initialVideos = DEMO_VIDEOS;

        if (savedProgress) {
            const parsed = JSON.parse(savedProgress);
            let prevCompleted = true;
            initialVideos = initialVideos.map((v, i) => {
                const isCompleted = parsed.completed?.includes(v.id) ?? false;
                const isUnlocked = prevCompleted || isCompleted || i === 0;
                prevCompleted = isCompleted;

                return { ...v, completed: isCompleted, unlocked: isUnlocked };
            });
        }

        setVideos(initialVideos);
        setActiveVideo(initialVideos.find((v) => !v.completed && v.unlocked) || initialVideos[0] || null);

        const savedMyCourses: number[] = JSON.parse(localStorage.getItem(myCoursesKey) || '[]');
        setIsEnrolled(savedMyCourses.includes(Number(id)));

        const savedNotes = localStorage.getItem(notesKey);

        if (savedNotes) {
setNotes(savedNotes);
}
    }, [id]);

    // Reset embed error when video changes
    useEffect(() => {
        setEmbedError(false);
    }, [activeVideo?.id]);

    // Data Fetching
    useEffect(() => {
        if (!id) {
return;
}

        api.get(`/courses/${id}`).then((res) => setCourse(res.data)).catch(() => {});
        api.get(`/courses/${id}/videos`).then((res) => {
            const vids = res.data?.data ?? res.data;

            if (Array.isArray(vids) && vids.length > 0) {
                let prevCompleted = true;
                const formatted = vids.map((v: any, i: number) => {
                    const isCompleted = v.completed === true; // From API now
                    const isUnlocked = prevCompleted || isCompleted || i === 0;
                    prevCompleted = isCompleted;

                    return { ...v, completed: isCompleted, unlocked: isUnlocked };
                });
                setVideos(formatted);
                setActiveVideo(formatted.find((v: any) => !v.completed && v.unlocked) || formatted[0]);
            }
        }).catch(() => {});
    }, [id]);

    const handleToggleEnrollment = () => {
        const savedMyCourses: number[] = JSON.parse(localStorage.getItem(myCoursesKey) || '[]');
        const courseId = Number(id);
        const updated = isEnrolled ? savedMyCourses.filter((c) => c !== courseId) : [...savedMyCourses, courseId];
        localStorage.setItem(myCoursesKey, JSON.stringify(updated));
        setIsEnrolled(!isEnrolled);
    };

    const handleMarkComplete = () => {
        if (!activeVideo) {
return;
}

        const updatedVideos = [...videos];
        const index = updatedVideos.findIndex(v => v.id === activeVideo.id);

        if (index > -1) {
            updatedVideos[index].completed = true;

            if (index + 1 < updatedVideos.length) {
                updatedVideos[index + 1].unlocked = true;
            }
        }

        setVideos(updatedVideos);

        if (user) {
            api.post(`/videos/${activeVideo.id}/progress`, { watched_percent: 100, completed: true }).then((res) => {
                const gamification = res.data?.gamification;

                if (gamification?.xp_earned > 0) {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 2000);
                }

                refreshUser?.();
            }).catch(() => {});
        }

        // Auto-advance conditionally
        if (index > -1 && index + 1 < updatedVideos.length) {
            setTimeout(() => setActiveVideo(updatedVideos[index + 1]), 600);
        }
    };

    const handlePostComment = () => {
        if (!commentText.trim() || !activeVideo) {
return;
}
        
        api.post(`/videos/${activeVideo.id}/comments`, { message: commentText.trim() })
            .then((res) => {
                const newComment = res.data.data;
                setComments([newComment, ...comments]);
                setCommentText('');
                setCommentPosted(true);
                setTimeout(() => setCommentPosted(false), 2500);
            })
            .catch(() => {});
    };
    
    // Fetch comments for active video
    useEffect(() => {
        if (!activeVideo?.id) {
return;
}
        
        api.get(`/videos/${activeVideo.id}/comments`)
            .then((res) => {
                setComments(res.data.data ?? res.data);
            })
            .catch(() => {});
    }, [activeVideo?.id]);

    const handleSaveNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
        localStorage.setItem(notesKey, e.target.value);
    };

    const completedCount = videos.filter((v) => v.completed).length;
    const progressPct = videos.length > 0 ? Math.round((completedCount / videos.length) * 100) : 0;
    const formatDuration = (secs: number) => {
        const hrs = Math.floor(secs / 3600);
        const mins = Math.floor((secs % 3600) / 60);
        const s = secs % 60;

        if (hrs > 0) {
return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
}

        return `${mins}:${s.toString().padStart(2, '0')}`;
    };
    const extractYoutubeId = (urlOrId: string | undefined): string | null => {
        if (!urlOrId) {
return null;
}

        const match = urlOrId.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);

        if (match) {
return match[1];
}

        if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
return urlOrId;
}

        return null;
    };
    const youtubeId = extractYoutubeId(activeVideo?.youtube_id || activeVideo?.url);
    const youtubeWatchUrl = activeVideo?.url || (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : null);
    const isActiveVideoCompleted = activeVideo && videos.find((v) => v.id === activeVideo.id)?.completed;
    const isReadyForQuiz = progressPct === 100;

    if (!activeVideo) {
return null;
}

    return (
        <AppLayout hideSidebar={isTheaterMode}>
            <div className={clsx("flex flex-col gap-8 transition-all duration-500", isTheaterMode ? "xl:flex-col" : "xl:flex-row")}>
                
                {/* Main Content Area (Video Player) */}
                <div className={clsx("space-y-6 transition-all duration-500", isTheaterMode ? "w-full" : "xl:w-2/3")}>
                    
                    {/* Player */}
                    <div className="relative group">
                        <div className={clsx("rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-black relative transition-all duration-500", isTheaterMode ? "h-[75vh]" : "aspect-video")}>
                            {youtubeId && !embedError ? (
                                <iframe
                                    key={youtubeId}
                                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                                    title={activeVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                    onLoad={(e) => {
                                        try {
                                            const iframe = e.target as HTMLIFrameElement;

                                            if (iframe.contentDocument?.title?.includes('unavailable')) {
                                                setEmbedError(true);
                                            }
                                        } catch {
                                            // Cross-origin — can't check, that's fine (means it loaded)
                                        }
                                    }}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 flex flex-col items-center justify-center text-center px-8">
                                    <div className="w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-500/10 text-red-500 dark:text-red-400 flex items-center justify-center mb-5 border border-red-200 dark:border-red-500/20">
                                        <Play className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Video tidak dapat diputar di sini</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">Pemilik video menonaktifkan pemutaran di situs lain. Tonton langsung di YouTube.</p>
                                    {youtubeWatchUrl && (
                                        <a
                                            href={youtubeWatchUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-red-500/20"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Tonton di YouTube
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Video Info Panel */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8 backdrop-blur-md relative overflow-hidden">
                        {showConfetti && (
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 pointer-events-none animate-pulse" />
                        )}
                        <div className="flex flex-col gap-4 mb-5 relative z-10">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/10 px-3 py-1.5 rounded-full inline-block border border-cyan-200 dark:border-cyan-500/20 w-fit">
                                    {course.level}
                                </span>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() => setIsTheaterMode(!isTheaterMode)}
                                        className="h-9 px-3 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200 dark:hover:text-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                                    >
                                        {isTheaterMode ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                                        {isTheaterMode ? t('course.exitTheater') : t('course.theater')}
                                    </button>
                                    <button
                                        onClick={handleToggleEnrollment}
                                        className={`h-9 px-3 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 ${
                                            isEnrolled
                                                ? 'bg-cyan-100 dark:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/40'
                                                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/50'
                                        }`}
                                    >
                                        {isEnrolled ? <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                                        {isEnrolled ? t('course.enrolled') : t('course.enroll')}
                                    </button>
                                    {!isActiveVideoCompleted ? (
                                        <button
                                            onClick={handleMarkComplete}
                                            className="h-9 px-4 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                        >
                                            <Check className="w-3.5 h-3.5" /> {t('course.mark Complete')}
                                        </button>
                                    ) : (
                                        <div className="h-9 px-4 rounded-lg font-bold text-xs flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> {t('course.completed')}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">{course.title}</h1>
                                <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mt-1.5 flex items-center gap-2">
                                    <Play className="w-3.5 h-3.5" />
                                    <span className="truncate">{activeVideo.title}</span>
                                    <span className="text-slate-400 dark:text-slate-600 font-normal">• {formatDuration(activeVideo.duration_seconds)}</span>
                                </p>
                            </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 max-w-4xl relative z-10">{activeVideo.description || course.description}</p>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-px mb-6" />

                        <div className="flex flex-wrap gap-8 md:gap-16">
                            <div>
                                <div className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-1">{t('course.level')}</div>
                                <div className="font-bold text-slate-900 dark:text-white text-lg">{course.level}</div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-1">{t('course.modules')}</div>
                                <div className="font-bold text-slate-900 dark:text-white text-lg">{videos.length}</div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-1">{t('course.progress')}</div>
                                <div className="font-bold text-cyan-600 dark:text-cyan-400 text-lg">{progressPct}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Playlist & Quiz & Notes) */}
                <div className={clsx("space-y-6 transition-all duration-500 flex-1", isTheaterMode ? "w-full lg:w-3/4 mx-auto" : "xl:w-1/3")}>
                    
                    {/* Course Playlist */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
                            <h3 className="font-bold text-slate-900 dark:text-white text-xl">Course Journey</h3>
                            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2 flex justify-between">
                                <span>{completedCount} of {videos.length} {t('course.completed').toLowerCase()}</span>
                                <span className="text-cyan-600 dark:text-cyan-400">{progressPct}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 dark:bg-slate-950 rounded-full mt-3 overflow-hidden shadow-inner">
                                <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 dark:from-cyan-600 dark:to-cyan-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPct}%` }} />
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-[500px] overflow-y-auto custom-scrollbar">
                            {videos.map((v: any, index: number) => {
                                const isActive = activeVideo?.id === v.id;
                                const isCompleted = v.completed;

                                return (
                                    <button
                                        key={v.id}
                                        onClick={() => {
 if (v.unlocked) {
 setEmbedError(false); setActiveVideo(v); 
} 
}}
                                        disabled={!v.unlocked}
                                        className={clsx(
                                            "w-full text-left p-5 flex gap-4 transition-all duration-300 relative group",
                                            isActive ? 'bg-cyan-50 dark:bg-cyan-500/10' : v.unlocked ? 'hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer' : 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-950/20'
                                        )}
                                    >
                                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-500 rounded-r-full shadow-none dark:shadow-[0_0_10px_rgba(14,165,233,0.8)]" />}

                                        <div className="shrink-0 mt-1">
                                            {isCompleted ? (
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-500/30">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                            ) : !v.unlocked ? (
                                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center border border-slate-300 dark:border-slate-700">
                                                    <Lock className="w-3.5 h-3.5" />
                                                </div>
                                            ) : isActive ? (
                                                <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                                                    <Play className="w-3 h-3 ml-0.5" />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-400 transition-colors" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h4 className={`text-sm font-semibold mb-1 line-clamp-2 leading-snug ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                                {index + 1}. {v.title}
                                            </h4>
                                            <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                                                {formatDuration(v.duration_seconds)}
                                                {!v.unlocked && <span className="text-slate-400 dark:text-slate-600">• Locked</span>}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Interactive Tabs (Notes & Discussion) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg mt-8">
                        <div className="flex border-b border-slate-200 dark:border-slate-800 relative pr-12">
                            <button 
                                onClick={() => setActiveTab('discussion')} 
                                className={`flex-1 py-4 font-bold text-sm text-center transition-colors border-b-2 ${activeTab === 'discussion' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/5' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'}`}
                            >
                                <MessageSquare className="w-4 h-4 inline-block mr-2" /> Discussion
                            </button>
                            <button 
                                onClick={() => setActiveTab('notes')} 
                                className={`flex-1 py-4 font-bold text-sm text-center transition-colors border-b-2 ${activeTab === 'notes' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/5' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'}`}
                            >
                                <FileEdit className="w-4 h-4 inline-block mr-2" /> My Notes
                            </button>
                            
                            <button 
                                onClick={() => setIsChatExpanded(!isChatExpanded)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors pointer-events-auto"
                                title={isChatExpanded ? "Collapse" : "Expand"}
                            >
                                {isChatExpanded ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                            </button>
                        </div>
                        
                        <div className={`p-6 flex flex-col transition-all duration-300 ease-in-out ${isChatExpanded ? 'h-[500px] md:h-[600px]' : 'h-[280px]'}`}>
                            {activeTab === 'discussion' ? (
                                <>
                                    <div className="space-y-4 mb-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                                        {comments.map((c, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className={clsx(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0",
                                                    i === 0 && c.author === 'You' ? 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-teal-500/20' : 
                                                    i % 2 === 0 ? 'bg-gradient-to-br from-cyan-400 to-blue-600' : 'bg-gradient-to-br from-orange-400 to-rose-600'
                                                )}>
                                                    {c.author[0]}
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex-1">
                                                    <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-1">{c.author} <span className="text-slate-400 dark:text-slate-500 font-normal ml-2">{c.ago}</span></p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.msg}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 mt-auto shrink-0 pt-2">
                                        {user ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                                                    placeholder="Join the discussion..."
                                                    className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm rounded-xl px-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium placeholder-slate-400 dark:placeholder-slate-600"
                                                />
                                                <button
                                                    onClick={handlePostComment}
                                                    disabled={!commentText.trim()}
                                                    className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                                                        commentText.trim()
                                                            ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {commentPosted ? <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> : <Send className="w-5 h-5" />}
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm rounded-xl px-4 flex items-center justify-center font-medium h-12">
                                                Login to join the discussion
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col h-full">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                                        <span>Personal Notes</span>
                                        <span className="text-emerald-600 dark:text-emerald-500/70 border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1"><Check className="w-3 h-3"/> Auto-saved</span>
                                    </div>
                                    <textarea 
                                        value={notes}
                                        onChange={handleSaveNotes}
                                        placeholder="Type your personal insights and code snippets here. They are saved automatically to your browser..."
                                        className="flex-1 w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-800 dark:text-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors custom-scrollbar resize-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quiz Gatekeeper Block */}
                    <AnimatePresence mode="popLayout">
                        {isReadyForQuiz ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-br from-cyan-500 to-orange-600 dark:from-cyan-600 dark:to-orange-700 rounded-3xl p-8 text-center shadow-2xl dark:shadow-[0_0_50px_rgba(14,165,233,0.3)] border border-cyan-300 dark:border-cyan-400/50 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 dark:bg-white/10 rounded-full blur-3xl group-hover:bg-white/30 dark:group-hover:bg-white/20 transition-colors" />
                                <div className="w-20 h-20 mx-auto bg-white/30 dark:bg-white/20 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-md shadow-xl border border-white/40 dark:border-white/20">
                                    <Award className="w-10 h-10 text-white" />
                                </div>
                                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-white/30 dark:bg-white/20 rounded-full border border-white/50 dark:border-white/30 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                                    <Sparkles className="w-3 h-3" /> Unlocked
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2 font-display">{t('quiz.conquer')}</h3>
                                <p className="text-cyan-50 mb-8 font-medium">{t('quiz.mastered')}</p>

                                <Link
                                    to={`/quiz/${id}`}
                                    className="w-full h-14 flex items-center justify-center gap-3 rounded-xl bg-white text-cyan-700 hover:text-cyan-900 font-black text-lg transition-transform hover:scale-105 shadow-xl"
                                >
                                    {t('quiz.start')} <ChevronRight className="w-6 h-6" />
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden"
                            >
                                <div className="w-20 h-20 mx-auto bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center mb-5 border border-slate-100 dark:border-slate-800 shadow-inner">
                                    <Lock className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-500 mb-2">{t('quiz.lockedTitle')}</h3>
                                <p className="text-slate-500 dark:text-slate-600 mb-6 text-sm">{t('quiz.lockedDesc')}</p>

                                <div className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-600 font-bold border border-slate-200 dark:border-slate-800 cursor-not-allowed">
                                    {t('quiz.completeFirst')}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    );
}
