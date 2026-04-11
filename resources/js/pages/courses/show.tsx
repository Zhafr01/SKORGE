import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/skorge/AppLayout';
import { Play, CheckCircle2, Lock, MessageSquare, ChevronRight, Award, Bookmark, Send, Check, Maximize, Minimize, FileEdit, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import clsx from 'clsx';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';

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
    const { refreshUser } = useAuth();
    const [course, setCourse] = useState<any>(DEMO_COURSE);
    const [videos, setVideos] = useState<any[]>([]);
    const [activeVideo, setActiveVideo] = useState<any>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [activeTab, setActiveTab] = useState<'discussion'|'notes'>('discussion');
    const [notes, setNotes] = useState('');
    
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>([
        { author: 'Alex', msg: 'The custom hooks section is 🔥 Finally understood closures!', ago: '2h ago' },
        { author: 'Mira', msg: 'Super clear explanation. Best React content online.', ago: '5h ago' },
    ]);
    const [commentPosted, setCommentPosted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

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
        if (savedNotes) setNotes(savedNotes);
    }, [id]);

    // Data Fetching
    useEffect(() => {
        if (!id) return;
        api.get(`/courses/${id}`).then((res) => setCourse(res.data)).catch(() => {});
        api.get(`/courses/${id}/videos`).then((res) => {
            const vids = res.data?.data ?? res.data;
            if (Array.isArray(vids) && vids.length > 0) {
                // Apply strict progression logic to fetched videos
                const savedProgress = localStorage.getItem(storageKey);
                let parsedCompleted: number[] = [];
                if (savedProgress) parsedCompleted = JSON.parse(savedProgress).completed || [];
                
                let prevCompleted = true;
                const formatted = vids.map((v: any, i: number) => {
                    const isCompleted = parsedCompleted.includes(v.id);
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
        if (!activeVideo) return;

        const updatedVideos = [...videos];
        const index = updatedVideos.findIndex(v => v.id === activeVideo.id);

        if (index > -1) {
            updatedVideos[index].completed = true;
            if (index + 1 < updatedVideos.length) {
                updatedVideos[index + 1].unlocked = true;
            }
        }

        setVideos(updatedVideos);

        const completedIds = updatedVideos.filter((v) => v.completed).map((v) => v.id);
        localStorage.setItem(storageKey, JSON.stringify({ completed: completedIds }));

        // Award XP based on video duration (minimum 60 seconds to earn 1 XP)
        const duration = activeVideo.duration_seconds ?? 300;
        api.post('/user/heartbeat', { duration }).then(() => {
            refreshUser?.();
        }).catch(() => {});

        // Celebration trigger
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);

        // Auto-advance
        if (index + 1 < updatedVideos.length) {
            setTimeout(() => {
                setActiveVideo(updatedVideos[index + 1]);
            }, 600);
        }
    };

    const handlePostComment = () => {
        if (!commentText.trim()) return;
        setComments([{ author: 'You', msg: commentText.trim(), ago: 'Just now' }, ...comments]);
        setCommentText('');
        setCommentPosted(true);
        setTimeout(() => setCommentPosted(false), 2500);
    };

    const handleSaveNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
        localStorage.setItem(notesKey, e.target.value);
    };

    const completedCount = videos.filter((v) => v.completed).length;
    const progressPct = videos.length > 0 ? Math.round((completedCount / videos.length) * 100) : 0;
    const formatDuration = (secs: number) => `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`;
    const youtubeId = activeVideo?.youtube_id;
    const isActiveVideoCompleted = activeVideo && videos.find((v) => v.id === activeVideo.id)?.completed;
    const isReadyForQuiz = progressPct === 100;

    if (!activeVideo) return null;

    return (
        <AppLayout hideSidebar={isTheaterMode}>
            <div className={clsx("flex flex-col gap-8 transition-all duration-500", isTheaterMode ? "xl:flex-col" : "xl:flex-row")}>
                
                {/* Main Content Area (Video Player) */}
                <div className={clsx("space-y-6 transition-all duration-500", isTheaterMode ? "w-full" : "xl:w-2/3")}>
                    
                    {/* Player */}
                    <div className="relative group">
                        <div className={clsx("rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-black relative transition-all duration-500", isTheaterMode ? "h-[75vh]" : "aspect-video")}>
                            {youtubeId ? (
                                <iframe
                                    key={youtubeId}
                                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                                    title={activeVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-900 dark:to-sky-950 flex flex-col items-center justify-center">
                                    <div className="w-20 h-20 rounded-full bg-sky-600/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                                        <Play className="w-8 h-8 ml-2" />
                                    </div>
                                    <p className="mt-6 text-slate-500 font-medium">Click to Play Video</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Video Info Panel */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8 backdrop-blur-md relative overflow-hidden">
                        {showConfetti && (
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-sky-500/10 pointer-events-none animate-pulse" />
                        )}
                        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-4 relative z-10">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-500/10 px-3 py-1.5 rounded-full mb-3 inline-block border border-sky-200 dark:border-sky-500/20">
                                    {course.level}
                                </span>
                                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">{activeVideo.title}</h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 shrink-0">
                                <button
                                    onClick={() => setIsTheaterMode(!isTheaterMode)}
                                    className="h-11 px-4 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200 dark:hover:text-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                                >
                                    {isTheaterMode ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                                    {isTheaterMode ? t('course.exitTheater') : t('course.theater')}
                                </button>
                                
                                <button
                                    onClick={handleToggleEnrollment}
                                    className={`h-11 px-4 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                                        isEnrolled
                                            ? 'bg-sky-100 dark:bg-sky-600/20 text-sky-600 dark:text-sky-400 border border-sky-300 dark:border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.2)]'
                                            : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/50'
                                    }`}
                                >
                                    {isEnrolled ? <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" /> : <Bookmark className="w-4 h-4" />}
                                    {isEnrolled ? t('course.enrolled') : t('course.enroll')}
                                </button>

                                {!isActiveVideoCompleted ? (
                                    <button
                                        onClick={handleMarkComplete}
                                        className="h-11 px-6 rounded-xl font-bold text-sm transition-all flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                    >
                                        <Check className="w-4 h-4" /> {t('course.mark Complete')}
                                    </button>
                                ) : (
                                    <div className="h-11 px-6 rounded-xl font-bold text-sm flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                                        <CheckCircle2 className="w-5 h-5" /> {t('course.completed')}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-4xl relative z-10">{course.description}</p>
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
                                <div className="font-bold text-sky-600 dark:text-sky-400 text-lg">{progressPct}%</div>
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
                                <span className="text-sky-600 dark:text-sky-400">{progressPct}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 dark:bg-slate-950 rounded-full mt-3 overflow-hidden shadow-inner">
                                <div className="h-full bg-gradient-to-r from-sky-400 to-sky-500 dark:from-sky-600 dark:to-sky-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPct}%` }} />
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-[500px] overflow-y-auto custom-scrollbar">
                            {videos.map((v: any, index: number) => {
                                const isActive = activeVideo?.id === v.id;
                                const isCompleted = v.completed;
                                return (
                                    <button
                                        key={v.id}
                                        onClick={() => v.unlocked && setActiveVideo(v)}
                                        disabled={!v.unlocked}
                                        className={clsx(
                                            "w-full text-left p-5 flex gap-4 transition-all duration-300 relative group",
                                            isActive ? 'bg-sky-50 dark:bg-sky-500/10' : v.unlocked ? 'hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer' : 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-950/20'
                                        )}
                                    >
                                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500 rounded-r-full shadow-none dark:shadow-[0_0_10px_rgba(14,165,233,0.8)]" />}

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
                                                <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.5)]">
                                                    <Play className="w-3 h-3 ml-0.5" />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-400 transition-colors" />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <h4 className={`text-sm font-semibold mb-1 truncate ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
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
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg">
                        <div className="flex border-b border-slate-200 dark:border-slate-800">
                            <button 
                                onClick={() => setActiveTab('discussion')} 
                                className={`flex-1 py-4 font-bold text-sm text-center transition-colors border-b-2 ${activeTab === 'discussion' ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/5' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'}`}
                            >
                                <MessageSquare className="w-4 h-4 inline-block mr-2" /> Discussion
                            </button>
                            <button 
                                onClick={() => setActiveTab('notes')} 
                                className={`flex-1 py-4 font-bold text-sm text-center transition-colors border-b-2 ${activeTab === 'notes' ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/5' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'}`}
                            >
                                <FileEdit className="w-4 h-4 inline-block mr-2" /> My Notes
                            </button>
                        </div>
                        
                        <div className="p-6 h-[280px] flex flex-col">
                            {activeTab === 'discussion' ? (
                                <>
                                    <div className="space-y-4 mb-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                                        {comments.map((c, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className={clsx(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0",
                                                    i === 0 && c.author === 'You' ? 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-teal-500/20' : 
                                                    i % 2 === 0 ? 'bg-gradient-to-br from-sky-400 to-blue-600' : 'bg-gradient-to-br from-orange-400 to-rose-600'
                                                )}>
                                                    {c.author[0]}
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex-1">
                                                    <p className="text-xs font-bold text-sky-600 dark:text-sky-400 mb-1">{c.author} <span className="text-slate-400 dark:text-slate-500 font-normal ml-2">{c.ago}</span></p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.msg}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 mt-auto shrink-0 pt-2">
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                                            placeholder="Join the discussion..."
                                            className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm rounded-xl px-4 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium placeholder-slate-400 dark:placeholder-slate-600"
                                        />
                                        <button
                                            onClick={handlePostComment}
                                            disabled={!commentText.trim()}
                                            className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                                                commentText.trim()
                                                    ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                            }`}
                                        >
                                            {commentPosted ? <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> : <Send className="w-5 h-5" />}
                                        </button>
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
                                        className="flex-1 w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-800 dark:text-slate-300 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors custom-scrollbar resize-none"
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
                                className="bg-gradient-to-br from-sky-500 to-indigo-600 dark:from-sky-600 dark:to-indigo-700 rounded-3xl p-8 text-center shadow-2xl dark:shadow-[0_0_50px_rgba(14,165,233,0.3)] border border-sky-300 dark:border-sky-400/50 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 dark:bg-white/10 rounded-full blur-3xl group-hover:bg-white/30 dark:group-hover:bg-white/20 transition-colors" />
                                <div className="w-20 h-20 mx-auto bg-white/30 dark:bg-white/20 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-md shadow-xl border border-white/40 dark:border-white/20">
                                    <Award className="w-10 h-10 text-white" />
                                </div>
                                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-white/30 dark:bg-white/20 rounded-full border border-white/50 dark:border-white/30 text-white text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                                    <Sparkles className="w-3 h-3" /> Unlocked
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2 font-display">{t('quiz.conquer')}</h3>
                                <p className="text-sky-50 mb-8 font-medium">{t('quiz.mastered')}</p>

                                <Link
                                    to={`/quiz/${id}`}
                                    className="w-full h-14 flex items-center justify-center gap-3 rounded-xl bg-white text-sky-700 hover:text-sky-900 font-black text-lg transition-transform hover:scale-105 shadow-xl"
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
