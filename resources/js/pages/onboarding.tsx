import React, { useState } from 'react';
import AppLayout from '@/components/skorge/AppLayout';
import { Bot, Sparkles, ChevronRight, CheckCircle2, Crosshair, Code2, LineChart, Target, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

const QUESTIONS = [
    {
        id: 'interest',
        question: "What excites you the most?",
        options: [
            { id: 'logic', label: "Solving complex logic puzzles", icon: Code2 },
            { id: 'visuals', label: "Making things look beautiful & intuitive", icon: Sparkles },
            { id: 'numbers', label: "Finding hidden patterns in numbers", icon: LineChart },
            { id: 'strategy', label: "Planning growth and strategy", icon: Target },
        ]
    },
    {
        id: 'experience',
        question: "What's your current experience level?",
        options: [
            { id: 'beginner', label: "Complete Beginner", desc: "Never coded or designed before." },
            { id: 'intermediate', label: "Intermediate", desc: "Know the basics, need structure." },
            { id: 'advanced', label: "Advanced", desc: "Looking for job-ready polish." },
        ]
    },
    {
        id: 'goal',
        question: "What is your main goal for the next 6 months?",
        options: [
            { id: 'job', label: "Land a new full-time job" },
            { id: 'freelance', label: "Start freelancing" },
            { id: 'upskill', label: "Upskill for my current role" },
        ]
    }
];

export default function AIOnboarding() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleSelectOption = (questionId: string, optionId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleNext = () => {
        if (step === QUESTIONS.length - 1) {
            setIsAnalyzing(true);
            const recommendation = getRecommendation();
            // Persist answers so AI job matching and CV builder can use them
            localStorage.setItem('skorge_onboarding', JSON.stringify(answers));
            setTimeout(() => {
                navigate('/dashboard', { state: { recommendation } });
            }, 3000);
        } else {
            setStep(s => s + 1);
        }
    };

    const getRecommendation = () => {
        if (answers.interest === 'visuals') return { id: 3, role: 'UI/UX Designer', level: answers.experience };
        if (answers.interest === 'numbers') return { id: 2, role: 'Data Analyst', level: answers.experience };
        return { id: 1, role: 'Frontend Developer', level: answers.experience };
    };

    if (isAnalyzing) {
        return (
            <AppLayout hideSidebar hideFooter>
                <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
                    <div className="relative w-32 h-32 mb-8">
                        <div className="absolute inset-0 bg-sky-500 rounded-full animate-ping opacity-20" />
                        <div className="absolute inset-2 bg-gradient-to-tr from-sky-500 to-orange-500 rounded-full animate-spin flex items-center justify-center shadow-lg shadow-sky-500/50" style={{ animationDuration: '3s' }}>
                            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center">
                                <Bot className="w-10 h-10 text-sky-400" />
                            </div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white mb-4 animate-pulse">Running SKORGE AI Model...</h2>
                    <p className="text-slate-400 max-w-md mx-auto">
                        Analyzing your background, benchmarking against current industry demands, and constructing your optimal learning path.
                    </p>
                </div>
            </AppLayout>
        );
    }

    const currentQuestion = QUESTIONS[step];
    const hasAnswered = !!answers[currentQuestion.id];

    return (
        <AppLayout hideSidebar hideFooter>
            <div className="max-w-3xl mx-auto pt-10 pb-20">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-sky-400" />
                        <span className="text-sky-400 font-bold text-sm">AI Career Navigator</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Let's find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-orange-400">perfect role.</span>
                    </h1>
                </div>

                {/* Question Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-1.5 bg-slate-800 w-full">
                        <div 
                            className="h-full bg-gradient-to-r from-sky-500 to-orange-500 transition-all duration-500" 
                            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-8 mt-4 text-center">
                        {currentQuestion.question}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((opt) => {
                            const Icon = (opt as any).icon;
                            const isSelected = answers[currentQuestion.id] === opt.id;
                            
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                                    className={`relative p-6 rounded-2xl border-2 text-left transition-all group ${
                                        isSelected 
                                        ? 'border-sky-500 bg-sky-500/10 ring-4 ring-sky-500/10' 
                                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-600 hover:bg-slate-800'
                                    }`}
                                >
                                    {Icon && (
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isSelected ? 'bg-sky-500/20' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                                            <Icon className={`w-6 h-6 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                                        </div>
                                    )}
                                    <h3 className={`font-bold text-lg mb-1 transition-colors ${isSelected ? 'text-sky-400' : 'text-white'}`}>
                                        {opt.label}
                                    </h3>
                                    {(opt as any).desc && (
                                        <p className="text-sm text-slate-400">{(opt as any).desc}</p>
                                    )}
                                    
                                    {/* Selection Indicator */}
                                    <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                        isSelected ? 'border-sky-500 bg-sky-500 scale-100' : 'border-slate-700 scale-0 group-hover:scale-100'
                                    }`}>
                                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="mt-12 flex justify-between items-center border-t border-slate-800/50 pt-8">
                        <button 
                            onClick={() => setStep(s => Math.max(0, s - 1))}
                            className={`px-6 py-3 font-semibold text-slate-400 hover:text-white transition-colors ${step === 0 ? 'invisible' : ''}`}
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!hasAnswered}
                            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all ${
                                hasAnswered 
                                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:scale-[1.02]' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            {step === QUESTIONS.length - 1 ? 'Generate Career Path' : 'Continue'} 
                            {step === QUESTIONS.length - 1 ? <Rocket className="w-5 h-5 ml-1" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
