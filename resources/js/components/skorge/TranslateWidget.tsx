import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ChevronDown, Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export default function TranslateWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');

    // Mencek bahasa saat ini dari cookie google translate jika ada
    useEffect(() => {
        const checkLang = () => {
            const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;

            if (combo && combo.value) {
                setCurrentLang(combo.value);
            } else {
                const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);

                if (match && match[1]) {
                    setCurrentLang(match[1]);
                }
            }
        };
        // Periksa setelah jeda
        setTimeout(checkLang, 1500);
        
        // Polling if needed
        const intv = setInterval(checkLang, 1000);

        return () => clearInterval(intv);
    }, []);

    const changeLanguage = (langCode: string) => {
        const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;

        if (combo) {
            combo.value = langCode;
            combo.dispatchEvent(new Event('change', { bubbles: true }));
            setCurrentLang(langCode);
        } else {
            // Fallback: set cookie and reload
            document.cookie = `googtrans=/en/${langCode}; path=/`;
            window.location.reload();
        }

        setIsOpen(false);
    };

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="fixed bottom-6 right-6 z-[100] notranslate" translate="no">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className="absolute bottom-full mb-3 right-0 w-48 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-3xl border border-slate-200/50 dark:border-white/5 rounded-3xl shadow-xl overflow-hidden p-1.5"
                    >
                        <button 
                            onClick={() => changeLanguage('id')}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${currentLang === 'id' ? 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <span>Indonesian</span>
                            {currentLang === 'id' && <Check className="w-4 h-4" />}
                        </button>
                        <button 
                            onClick={() => changeLanguage('en')}
                             className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${currentLang === 'en' ? 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <span>English</span>
                            {currentLang === 'en' && <Check className="w-4 h-4" />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                onClick={toggleOpen}
                className={`bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-3xl border border-slate-200/50 dark:border-white/5 pl-2 pr-4 py-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-2.5 transition-all hover:scale-105 group hover:border-slate-300 dark:hover:border-white/10 ${isOpen ? 'ring-2 ring-slate-200 dark:ring-white/10' : ''}`}
            >
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <Languages className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-tight mb-0.5">Translate</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            {currentLang === 'id' ? 'ID' : 'EN'}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </button>
        </div>
    );
}

