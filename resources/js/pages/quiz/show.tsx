import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/skorge/AppLayout';
import LoadingOverlay from '@/components/skorge/LoadingOverlay';
import { Target, CheckCircle2, ChevronRight, AlertCircle, Award, BrainCircuit, Sparkles } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
}

type QuizStatus = 'loading' | 'ready' | 'error';

const TOPIC_FALLBACK_MAP: Record<string, string> = {
    '1': 'HTML & CSS',
    '2': 'JavaScript',
    '3': 'React',
    '4': 'Python',
    '5': 'SQL',
    '6': 'Figma',
};

export default function QuizShow() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, lang } = useTranslation();

    const [status, setStatus] = useState<QuizStatus>('loading');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [topic, setTopic] = useState<string>('');
    const [difficulty, setDifficulty] = useState<string>('intermediate');
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const resolvedTopic = TOPIC_FALLBACK_MAP[id ?? ''] ?? `Course ${id}`;
        setTopic(resolvedTopic);

        // Try to retrieve topic from localStorage (set by CourseCard or course page)
        const storedTopic = localStorage.getItem(`quiz_topic_${id}`);
        const finalTopic = storedTopic ?? resolvedTopic;
        setTopic(finalTopic);

        const storedDifficulty = localStorage.getItem(`quiz_difficulty_${id}`) ?? 'intermediate';
        setDifficulty(storedDifficulty);

        api.post('/ai/generate-quiz', { topic: finalTopic, difficulty: storedDifficulty, lang: lang })
            .then(res => {
                setQuestions(res.data.questions);
                setStatus('ready');
            })
            .catch(() => {
                setStatus('error');
            });
    }, [id, lang]);

    const handleSelectOption = (index: number) => {
        const updated = [...answers];
        updated[currentStep] = index;
        setAnswers(updated);
    };

    const handleNext = () => {
        if (currentStep === questions.length - 1) {
            setShowResults(true);
        } else {
            setCurrentStep(s => s + 1);
        }
    };

    if (status === 'loading') {
        return (
            <LoadingOverlay 
                title={t('quiz.generating')}
                subtitle={t('quiz.analyzing', { topic: topic })}
            />
        );
    }

    if (status === 'error') {
        return (
            <AppLayout title={t('quiz.errorTitle')} description={t('quiz.errorDesc')}>
                <div className="max-w-3xl mx-auto mt-10 text-center">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 shadow-lg">
                        <AlertCircle className="w-16 h-16 text-rose-500 dark:text-rose-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('quiz.errorTitle')}</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">{t('quiz.errorDesc')}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all shadow-md"
                        >
                            {t('quiz.retry')}
                        </button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (showResults) {
        let score = 0;
        answers.forEach((ans, i) => {
            if (ans === questions[i].correct_index) score++;
        });
        const passed = score / questions.length >= 0.6;

        return (
            <AppLayout title={t('quiz.resultsTitle')} description="Final evaluation for this module.">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto mt-10"
                >
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center shadow-2xl">
                        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-white dark:border-slate-800 ${
                            passed ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/20' : 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-500/20'
                        }`}>
                            {passed ? <Award className="w-12 h-12 text-white" /> : <AlertCircle className="w-12 h-12 text-white" />}
                        </div>

                        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                            {passed ? t('quiz.passed') : t('quiz.failed')}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg mb-6 font-medium">
                            <span dangerouslySetInnerHTML={{ __html: t('quiz.score', { score: `<strong class="text-slate-900 dark:text-white mx-1">${score}</strong>`, total: `<strong class="text-slate-900 dark:text-white mx-1">${questions.length}</strong>` }) }} />
                        </p>
                        
                        <div className="max-w-2xl mx-auto mb-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-left shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <BrainCircuit className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                                <h4 className="font-bold text-slate-800 dark:text-slate-200">{t('quiz.aiSummary')}</h4>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                {passed ? t('quiz.excellent', { topic }) : t('quiz.review', { topic })}
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-600 dark:text-sky-400 text-sm font-medium mb-8">
                            <Sparkles className="w-4 h-4" />
                            AI-generated quiz on <span className="font-bold">{topic}</span>
                        </div>

                        <div className="space-y-6 text-left mb-10">
                            {questions.map((q, i) => {
                                const isCorrect = answers[i] === q.correct_index;
                                return (
                                    <div key={q.id} className={`p-5 rounded-2xl border ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20'}`}>
                                        <div className="flex gap-3 mb-2">
                                            {isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-500 shrink-0" /> : <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-500 shrink-0" />}
                                            <h4 className="font-bold text-slate-900 dark:text-white">{q.question}</h4>
                                        </div>
                                        <div className="ml-9">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                {t('quiz.yourAnswer')} <span className={isCorrect ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-rose-600 dark:text-rose-400 font-medium line-through ml-1'}>{q.options[answers[i]] ?? t('quiz.skipped')}</span>
                                            </p>
                                            {!isCorrect && (
                                                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                                                    {t('quiz.correctAnswer')} {q.options[q.correct_index]}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-500 italic border-t border-slate-200 dark:border-slate-800/50 pt-2 mt-2">{q.explanation}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-center gap-4">
                            {!passed && (
                                <button
                                    onClick={() => { setShowResults(false); setCurrentStep(0); setAnswers([]); }}
                                    className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                                >
                                    {t('quiz.retryQuiz')}
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all hover:scale-105 shadow-lg shadow-sky-500/20"
                            >
                                {t('quiz.continue')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AppLayout>
        );
    }

    const question = questions[currentStep];
    const currentAnswer = answers[currentStep];
    const canProceed = currentAnswer !== undefined;
    const isLast = currentStep === questions.length - 1;

    return (
        <AppLayout title="Module Assessment" description={`AI-generated quiz on ${topic}.`}>
            <div className="max-w-3xl mx-auto mt-10">
                {/* Progress */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t('quiz.questionProgress', { current: currentStep + 1, total: questions.length })}</span>
                    </div>
                    <div className="flex gap-2">
                        {questions.map((_, i) => (
                            <div key={i} className={`w-8 h-2 rounded-full transition-colors ${
                                i === currentStep ? 'bg-sky-500' :
                                i < currentStep ? 'bg-sky-200 dark:bg-sky-500/30' : 'bg-slate-200 dark:bg-slate-800'
                            }`} />
                        ))}
                    </div>
                </div>

                {/* AI Badge */}
                <div className="flex items-center gap-2 mb-4 text-sm text-sky-600 dark:text-sky-400 font-medium">
                    <div className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center">
                        <BrainCircuit className="w-4 h-4" />
                    </div>
                    <span>AI-generated quiz — <span className="font-bold">{topic}</span></span>
                </div>

                {/* Question Box */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl"
                    >
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-8 leading-tight">
                            {question.question}
                        </h2>

                        <div className="space-y-4">
                            {question.options.map((opt, i) => {
                                const isSelected = currentAnswer === i;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleSelectOption(i)}
                                        className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-center justify-between group ${
                                            isSelected
                                            ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/10'
                                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-sky-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <span className={`font-medium text-lg transition-colors ${isSelected ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
                                            {opt}
                                        </span>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                            isSelected ? 'border-sky-500 bg-sky-500' : 'border-slate-300 dark:border-slate-700'
                                        }`}>
                                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                            <button
                                onClick={handleNext}
                                disabled={!canProceed}
                                className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all ${
                                    canProceed
                                    ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:scale-105'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                }`}
                            >
                                {isLast ? t('quiz.submit') : t('quiz.next')}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </AppLayout>
    );
}
