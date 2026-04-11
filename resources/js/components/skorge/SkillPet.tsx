import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpCircle, PenSquare, Heart, Check } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import api from '@/lib/api';

interface SkillPetProps {
    xp: number;
    user: any;
    careerCategory?: string;
    globalRank?: string;
}

export default function SkillPet({ xp, user, careerCategory, globalRank }: SkillPetProps) {
    const { t } = useTranslation();
    const [isEvolving, setIsEvolving] = useState(false);
    const [displayStage, setDisplayStage] = useState(0);
    
    // Interactions
    const [isPetting, setIsPetting] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [petName, setPetName] = useState(user?.pet_name || '');

    const streak = user?.current_streak || 0;
    const isSleepy = streak === 0;
    const isHappy = streak >= 7;

    const isLongAbsent = (() => {
        if (!user?.last_active_at) return false;
        const lastActive = new Date(user.last_active_at);
        const diffDays = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays >= 7;
    })();

    const rankNum = globalRank ? parseInt(globalRank.replace(/\D/g, '')) : 100;
    const isPhantom = globalRank && rankNum <= 2;
    const isGolden = globalRank && rankNum <= 5 && rankNum > 2;

    const getStageInfo = (currentXp: number) => {
        if (currentXp < 500) return { stage: 1, defaultName: 'Spark', title: 'Rookie Spark', nextXp: 500, img: '/pet level 1.png', acc: { x: '50%', y: '45%', scale: 1 } };
        if (currentXp < 2000) return { stage: 2, defaultName: 'Nova', title: 'Growing Learner', nextXp: 2000, img: '/pet level 2.png', acc: { x: '45%', y: '30%', scale: 1.1 } };
        if (currentXp < 6000) return { stage: 3, defaultName: 'Volt', title: 'Skill Hunter', nextXp: 6000, img: '/pet level 3.png', acc: { x: '60%', y: '35%', scale: 1.2 } };
        if (currentXp < 15000) return { stage: 4, defaultName: 'Astra', title: 'Career Beast', nextXp: 15000, img: '/pet level 4.png', acc: { x: '50%', y: '30%', scale: 1.3 } };
        
        return { 
            stage: 5, 
            defaultName: isPhantom ? 'Phantom Eclipse' : (isGolden ? 'Golden Eclipse' : 'Eclipse'), 
            title: isPhantom ? 'Phantom Master' : (isGolden ? 'Golden Master' : 'Legendary Mentor'), 
            nextXp: 15000, 
            max: true, 
            img: '/pet level 5 pose 1.png',
            acc: { x: '50%', y: '25%', scale: 1.4 }
        };
    };

    const currentActualInfo = getStageInfo(xp);

    useEffect(() => {
        if (displayStage === 0) setDisplayStage(currentActualInfo.stage);
        if (user?.pet_name) setPetName(user.pet_name);
    }, [xp, user]);

    const displayBaseXp = displayStage === 1 ? 0 :
                          displayStage === 2 ? 500 :
                          displayStage === 3 ? 2000 :
                          displayStage === 4 ? 6000 : 15000;

    const activeInfo = getStageInfo(displayStage > 0 ? displayBaseXp : xp); 
    const pendingEvolution = displayStage > 0 && currentActualInfo.stage > displayStage;

    const handleEvolve = () => {
        setIsEvolving(true);
        setTimeout(() => {
            setDisplayStage(currentActualInfo.stage);
            setTimeout(() => setIsEvolving(false), 2000);
        }, 3000);
    };

    let progress = 0;
    if (displayStage >= 5 || pendingEvolution) progress = 100;
    else progress = Math.min(100, Math.max(0, ((xp - displayBaseXp) / (activeInfo.nextXp - displayBaseXp)) * 100));

    // Dynamic Theme (Light + Dark compatible)
    const getTheme = () => {
        if (isPhantom) return { bg: 'bg-white dark:bg-slate-950', border: 'border-purple-200 dark:border-purple-900/50', bar: 'from-gray-400 to-purple-400 dark:from-gray-500 dark:to-purple-400', text: 'text-purple-600 dark:text-purple-400', glow: 'from-purple-300/40 dark:from-purple-600/40' };
        if (isGolden) return { bg: 'bg-amber-50 dark:bg-amber-950', border: 'border-amber-200 dark:border-amber-700/50', bar: 'from-yellow-400 to-amber-300 dark:from-yellow-400 dark:to-amber-200', text: 'text-amber-600 dark:text-yellow-400', glow: 'from-amber-200/50 dark:from-amber-500/40' };
        
        switch(careerCategory) {
            case 'Engineering': return { bg: 'bg-white dark:bg-slate-950', border: 'border-cyan-200 dark:border-cyan-900/40', bar: 'from-cyan-400 to-blue-500 dark:from-cyan-500 dark:to-blue-500', text: 'text-cyan-600 dark:text-cyan-400', glow: 'from-cyan-300/30 dark:from-cyan-500/30' };
            case 'Design': return { bg: 'bg-white dark:bg-slate-950', border: 'border-pink-200 dark:border-pink-900/40', bar: 'from-pink-400 to-purple-500 dark:from-pink-500 dark:to-purple-500', text: 'text-pink-600 dark:text-pink-400', glow: 'from-pink-300/30 dark:from-pink-500/30' };
            case 'Data': return { bg: 'bg-white dark:bg-slate-950', border: 'border-teal-200 dark:border-teal-900/40', bar: 'from-emerald-400 to-teal-400 dark:from-emerald-500 dark:to-teal-400', text: 'text-emerald-700 dark:text-emerald-400', glow: 'from-emerald-300/30 dark:from-emerald-500/30' };
            case 'Business': return { bg: 'bg-white dark:bg-slate-950', border: 'border-orange-200 dark:border-orange-900/40', bar: 'from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-500', text: 'text-amber-700 dark:text-amber-400', glow: 'from-amber-300/30 dark:from-amber-500/30' };
            default: return { bg: 'bg-slate-50 dark:bg-slate-950', border: 'border-sky-200 dark:border-sky-900/40', bar: 'from-sky-400 to-sky-600 dark:from-sky-500 dark:to-sky-700', text: 'text-sky-600 dark:text-sky-400', glow: 'from-sky-300/30 dark:from-sky-500/30' };
        }
    };
    const theme = getTheme();

    let petFilterClass = '';
    if (isPhantom) petFilterClass = 'invert hue-rotate-180 brightness-150 saturate-200';
    else if (isGolden) petFilterClass = 'sepia saturate-200 hue-rotate-[-15deg] brightness-125 contrast-125 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]';

    const handlePetClick = () => {
        if (isPetting || isEvolving) return;
        setIsPetting(true);
        setTimeout(() => setIsPetting(false), 1500);
    };

    const handleSaveName = () => {
        setIsEditingName(false);
        api.post('/user/pet', { pet_name: petName }).catch(() => {});
    };

    const displayName = petName || activeInfo.defaultName;

    const getPetMessage = () => {
        if (isEvolving) return "Wah, aku berevolusi! ✨";
        if (pendingEvolution) return "Kekuatanku penuh! Ayo evolusi! 🌟";
        if (isPetting) return "Hehe, geli! ❤️";
        if (isLongAbsent) return "Aku merindukanmu! Sudah lama tidak belajar... 😢";
        if (isSleepy) return "Aku menunggumu kembali belajar... 💤";
        if (isHappy) return `Luar biasa! Streak ${streak} hari! 🔥`;
        if (activeInfo.stage === 1) return "Ayo belajar! 1 langkah lagi.";
        if (activeInfo.stage === 2) return "Skill baru hampir terbuka!";
        if (activeInfo.stage === 4) return "Selesaikan 1 video hari ini! 🎯";
        if (activeInfo.stage === 5) return "Kamu adalah legenda UpSkills!";
        return "Terus tingkatkan XP-mu!";
    };

    return (
        <div className={`relative w-full ${theme.bg} ${theme.border} border rounded-3xl p-4 sm:p-6 overflow-hidden group shadow-xl flex flex-col items-center justify-between transition-colors`}>
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${theme.glow} to-transparent rounded-full blur-[80px] pointer-events-none opacity-50 dark:opacity-100`} />
            <div className={`absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr ${theme.glow} to-transparent rounded-full blur-[80px] pointer-events-none opacity-50 dark:opacity-100`} />

            {/* Header */}
            <div className="w-full flex flex-wrap justify-between items-center gap-3 relative z-20">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.glow} flex items-center justify-center shadow-sm`}>
                        <Sparkles className={`w-4 h-4 text-slate-700 dark:text-white`} />
                    </div>
                    <h3 className="text-xs font-black text-slate-700 dark:text-white tracking-widest uppercase opacity-90">Companion</h3>
                </div>
                <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <div className={`text-[10px] font-black px-3 py-1 ${theme.text} uppercase tracking-wider`}>
                        STAGE {activeInfo.stage}
                    </div>
                </div>
            </div>

            {/* Float-cropped Pet Container (No circle borders) */}
            <div 
                className="relative w-full max-w-sm h-48 sm:h-56 mt-4 mb-2 cursor-pointer z-20 group/orb shrink-0 flex items-center justify-center pointer-events-auto"
                onClick={handlePetClick}
                title="Pet me!"
            >
                {/* Speech Bubble */}
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-[10px] font-black px-4 py-2 rounded-2xl shadow-xl z-50 whitespace-nowrap transition-all duration-300 pointer-events-none origin-bottom ${isPetting || isEvolving ? 'scale-100 opacity-100' : 'scale-90 opacity-0 md:group-hover/orb:scale-100 md:group-hover/orb:opacity-100'}`}>
                    {getPetMessage()}
                    <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 rotate-45 w-3 h-3 bg-white dark:bg-slate-800 border-b border-r border-slate-200 dark:border-slate-700"></div>
                </div>

                {isPetting && <Heart className="absolute -top-4 right-1/4 text-pink-500 w-10 h-10 animate-[bounce_1s_infinite] drop-shadow-lg z-40" fill="currentColor" />}
                {isSleepy && !isEvolving && !isPetting && <div className="absolute top-0 right-1/4 text-3xl font-black text-slate-500 dark:text-slate-400 animate-pulse z-40">Zzz</div>}

                {/* The raw, unconstrained Pet Image */}
                <div className={`w-full max-w-sm mx-auto h-full relative flex items-center justify-center transition-transform duration-500 pointer-events-none ${isPetting ? 'scale-105' : 'group-hover/orb:scale-[1.02]'}`}>
                    <div 
                        className={`absolute inset-0 w-full h-full ${isSleepy ? 'grayscale opacity-70' : 'animate-[float_4s_infinite]'}`}
                        style={{ animationDuration: isHappy ? '2s' : '4s' }}
                    >
                        <img 
                            src={activeInfo.img} 
                            className={`w-full h-full object-contain transition-all duration-[2000ms] mix-blend-multiply dark:mix-blend-screen ${isEvolving ? 'scale-[1.5] blur-md brightness-200' : 'scale-100'} ${petFilterClass}`}
                            style={{ transformOrigin: 'center' }}
                            alt="Pet"
                        />
                    </div>
                </div>

                {isEvolving && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-full bg-white animate-ping opacity-80 rounded-full" style={{ animationDuration: '1s' }} />
                    </div>
                )}
            </div>

            {/* Footer Name & XP */}
            <div className="w-full flex-1 flex flex-col justify-end relative z-20">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-inner">
                    
                    <div className="flex flex-col items-center mb-4">
                        {isEditingName ? (
                            <div className="flex items-center justify-center gap-2 mb-1 w-full">
                                <input 
                                    type="text" 
                                    value={petName} 
                                    onChange={(e) => setPetName(e.target.value)}
                                    className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold text-center text-lg px-4 py-1 rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-none focus:border-sky-500 w-32 md:w-40"
                                    placeholder="Name..."
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                                    onBlur={handleSaveName}
                                />
                                <button onClick={handleSaveName} className="text-emerald-500 dark:text-emerald-400 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shrink-0"><Check className="w-5 h-5" /></button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 group/name cursor-pointer" onClick={() => setIsEditingName(true)}>
                                <h4 className="text-2xl font-black text-slate-800 dark:text-white tracking-wide">{displayName}</h4>
                                <PenSquare className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover/name:text-slate-600 dark:group-hover/name:text-slate-300 transition-colors" />
                            </div>
                        )}
                        <p className={`text-[10px] font-black ${theme.text} uppercase tracking-[0.2em] opacity-80 mt-1`}>{activeInfo.title}</p>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            <span>{xp} XP</span>
                            <span className={activeInfo.max ? theme.text : ''}>{activeInfo.max ? 'MAX LVL' : `${activeInfo.nextXp} XP`}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 relative">
                            <div 
                                className={`h-full bg-gradient-to-r ${pendingEvolution && !isEvolving ? 'from-amber-400 to-amber-200 animate-pulse' : theme.bar} rounded-full`}
                                style={{ width: `${progress}%`, transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                            />
                        </div>
                        
                        <div className="h-10 mt-2">
                            {pendingEvolution && !isEvolving && (
                                <button 
                                    onClick={handleEvolve}
                                    className="w-full h-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white dark:text-slate-900 font-black tracking-widest text-[11px] uppercase shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                                >
                                    <ArrowUpCircle className="w-4 h-4 animate-bounce" /> Evolve Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
