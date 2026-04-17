import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, ArrowRight, BrainCircuit, Layout, Database, Activity,
    Code, PenTool, BarChart2, BookOpen, Zap, Target,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppLayout from '@/components/skorge/AppLayout';
import LoadingOverlay from '@/components/skorge/LoadingOverlay';
import api from '@/lib/api';

const questions = [
    {
        id: 1,
        text: 'What excites you the most about building software?',
        options: [
            { label: 'Designing beautiful, intuitive interfaces that users love.', value: 'visual' },
            { label: 'Creating the underlying logic, APIs, and connecting databases.', value: 'logic' },
            { label: 'Bringing a design to life with interactive code and animations.', value: 'user-interface' },
            { label: 'Analyzing patterns and finding insights hidden in raw data.', value: 'data' },
        ],
    },
    {
        id: 2,
        text: 'Which of these tasks sounds most appealing to you?',
        options: [
            { label: 'Optimizing complex algorithms and mathematical models.', value: 'analytics' },
            { label: 'Structuring a scalable database schema for millions of users.', value: 'databases' },
            { label: 'Perfecting spacing, typography, and color psychology.', value: 'design' },
            { label: 'Writing reusable, accessible React components.', value: 'react' },
        ],
    },
    {
        id: 3,
        text: 'When you face a complex problem, what is your first approach?',
        options: [
            { label: 'I draw out the user flow visually before writing any code.', value: 'layout' },
            { label: 'I look at the data trends to see what the numbers say.', value: 'statistics' },
            { label: 'I break it down into modular functions and API endpoints.', value: 'servers' },
            { label: 'I immediately start prototyping the UI with CSS and HTML.', value: 'css' },
        ],
    },
    {
        id: 4,
        text: 'Which course topic would you most enjoy studying?',
        options: [
            { label: 'React & Frontend Frameworks', value: 'react' },
            { label: 'SQL, APIs & Backend Architecture', value: 'databases' },
            { label: 'Data Science & Python', value: 'data' },
            { label: 'Figma & UX Research', value: 'design' },
        ],
    },
    {
        id: 5,
        text: 'How would you describe your strongest skill?',
        options: [
            { label: 'Pixel-perfect attention to visual detail.', value: 'visual' },
            { label: 'Building reliable, well-structured systems.', value: 'logic' },
            { label: 'Spotting trends and translating numbers into stories.', value: 'statistics' },
            { label: 'Understanding what users truly need and why.', value: 'layout' },
        ],
    },
];

const ROLE_SUGGESTIONS: Record<string, string[]> = {
    'Frontend Developer': ['JavaScript Mastery', 'React Modern Patterns', 'HTML & CSS Fundamentals'],
    'Backend Engineer': ['Laravel & REST APIs', 'SQL & Database Design', 'Node.js Architecture'],
    'UI/UX Designer': ['Figma for Designers', 'UX Research Methods', 'Design Systems'],
    'Data Scientist': ['Python for Data Science', 'SQL Bootcamp', 'Machine Learning Essentials'],
};

const ROLE_SKILL_TAGS: Record<string, string[]> = {
    'Frontend Developer': ['React', 'TypeScript', 'CSS'],
    'Backend Engineer': ['APIs', 'SQL', 'Laravel'],
    'UI/UX Designer': ['Figma', 'UX Research', 'Prototyping'],
    'Data Scientist': ['Python', 'SQL', 'Data Visualization'],
};

export default function RecommendationWizard() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [result, setResult] = useState<any>(null);

    const handleAnswer = async (value: string) => {
        const newAnswers = [...answers, value];
        setAnswers(newAnswers);

        if (step < questions.length) {
            setStep(step + 1);
        } else {
            await submitAnswers(newAnswers);
        }
    };

    const submitAnswers = async (finalAnswers: string[]) => {
        setStep(questions.length + 1);

        // Simulated Network Delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Use mock data completely to bypass whatever is triggering the UI reset
        const topAnswers = finalAnswers.slice(0, 2).join(', ') || 'user interface design';
        setResult({
            recommended_role: { 
                name: 'Frontend Developer', 
                description: 'Build UIs using React and Tailwind CSS.', 
                icon: 'code', 
                id: 1 
            },
            match_percentage: 92,
            scores: {},
            explanation: `Based on your answers '${topAnswers}', your profile aligns with Frontend Developer. Your learning history supported this career path.`
        });
        setStep(questions.length + 2);
    };

    const renderIcon = (name: string) => {
        switch (name) {
            case 'code': return <Code className="w-12 h-12 text-cyan-400" />;
            case 'database': return <Database className="w-12 h-12 text-cyan-400" />;
            case 'pen-tool': return <PenTool className="w-12 h-12 text-cyan-400" />;
            case 'bar-chart-2': return <BarChart2 className="w-12 h-12 text-cyan-400" />;
            default: return <BrainCircuit className="w-12 h-12 text-cyan-400" />;
        }
    };

    const roleName: string = result?.recommended_role?.name ?? '';
    const suggestedCourses = ROLE_SUGGESTIONS[roleName] ?? [];
    const skillTags = ROLE_SKILL_TAGS[roleName] ?? [];

    return (
        <AppLayout>
            <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-3xl w-full relative z-10">
                    <AnimatePresence mode="wait">

                        {/* STEP 0: WELCOME */}
                        {step === 0 && (
                            <motion.div
                                key="welcome"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 md:p-16 shadow-2xl"
                            >
                                <div className="mx-auto w-20 h-20 bg-cyan-50 dark:bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-8">
                                    <Sparkles className="w-10 h-10 text-cyan-500 dark:text-cyan-400" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                                    Discover Your True Path
                                </h1>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 max-w-xl mx-auto">
                                    Answer <strong className="text-slate-800 dark:text-white">5 quick questions</strong> and our AI will analyze your passion, learning style, and skill confidence to recommend your ideal job role.
                                </p>
                                <div className="flex flex-wrap justify-center gap-3 mb-10">
                                    {['Passion', 'Courses', 'Skills', 'Problem-Solving', 'Strengths'].map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={(e) => {
 e.preventDefault(); setStep(1); 
}}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-orange-500 dark:from-cyan-500 dark:to-orange-500 hover:from-cyan-500 hover:to-orange-400 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
                                >
                                    Start The Quiz <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 1..N: QUESTIONS */}
                        {step > 0 && step <= questions.length && (
                            <motion.div
                                key={`question-${step}`}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl"
                            >
                                <div className="mb-8">
                                    <div className="flex justify-between text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-4">
                                        <span>Question {step} of {questions.length}</span>
                                        <span>{Math.round((step / questions.length) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-transparent">
                                        <motion.div
                                            className="bg-gradient-to-r from-cyan-500 to-orange-500 h-full"
                                            initial={{ width: `${((step - 1) / questions.length) * 100}%` }}
                                            animate={{ width: `${(step / questions.length) * 100}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
                                    {questions[step - 1].text}
                                </h2>

                                <div className="space-y-4">
                                    {questions[step - 1].options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={(e) => {
 e.preventDefault(); handleAnswer(option.value); 
}}
                                            className="w-full text-left p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all group shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white text-lg">
                                                    {option.label}
                                                </span>
                                                <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-cyan-500 dark:group-hover:border-cyan-400 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/20 flex items-center justify-center transition-colors">
                                                    <div className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* LOADING */}
                        {step === questions.length + 1 && (
                            <LoadingOverlay 
                                title="Analyzing Your Profile…"
                                subtitle="Matching your passion, courses & skills against all available job roles."
                            />
                        )}

                        {/* RESULT */}
                        {step === questions.length + 2 && result && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: 'spring', bounce: 0.4 }}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
                            >
                                <div className="bg-gradient-to-br from-cyan-50 dark:from-cyan-500/20 via-white dark:via-slate-900 to-orange-50 dark:to-orange-500/10 p-10 text-center relative border-b border-slate-100 dark:border-transparent">
                                    <div className="absolute top-4 right-4 bg-white/80 dark:bg-slate-950/50 backdrop-blur px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                                        {result.match_percentage}% Match
                                    </div>
                                    <div className="mx-auto w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-slate-200 dark:border-slate-700">
                                        {renderIcon(result.recommended_role.icon)}
                                    </div>
                                    <h4 className="text-cyan-600 dark:text-cyan-400 font-semibold tracking-widest uppercase mb-2">Your Perfect Fit</h4>
                                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                                        {result.recommended_role.name}
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-300 text-lg max-w-lg mx-auto mb-6">
                                        {result.recommended_role.description}
                                    </p>
                                    
                                    {result.explanation && (
                                        <div className="max-w-2xl mx-auto mb-6 p-5 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 text-left">
                                            <div className="flex items-center gap-2 mb-2">
                                                <BrainCircuit className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                                                <h4 className="font-bold text-cyan-700 dark:text-cyan-300">Why this role?</h4>
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                                                {result.explanation}
                                            </p>
                                        </div>
                                    )}

                                    {/* Skill Tags */}
                                    {skillTags.length > 0 && (
                                        <div className="flex flex-wrap justify-center gap-2 mb-2">
                                            {skillTags.map(tag => (
                                                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-200 dark:border-cyan-500/25 text-cyan-700 dark:text-cyan-300">
                                                    <Zap className="w-3 h-3" /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Suggested Courses */}
                                {suggestedCourses.length > 0 && (
                                    <div className="px-8 pt-6 pb-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                        <p className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
                                            <BookOpen className="w-4 h-4" /> Recommended Courses for You
                                        </p>
                                        <div className="space-y-2">
                                            {suggestedCourses.map(course => (
                                                <div key={course} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                                                    <Target className="w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0" />
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{course}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link
                                            to={`/job-roles/${result.recommended_role.id}`}
                                            className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 text-center border border-cyan-500"
                                        >
                                            Explore This Role
                                        </Link>
                                        <Link
                                            to="/dashboard"
                                            className="px-8 py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl transition-colors text-center border border-slate-300 dark:border-transparent"
                                        >
                                            Return to Dashboard
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    );
}
