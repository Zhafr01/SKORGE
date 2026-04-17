import { Target, Sparkles, ArrowRight, Briefcase } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/skorge/AppLayout';
import { DialCarouselLayout } from '@/components/skorge/DialCarouselLayout';
import { JobRoleCard } from '@/components/skorge/JobRoleCard';
import api from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

const DUMMY_ROLES = [
    { id: 1, name: 'Frontend Developer', category: 'Engineering', courses_count: 8, icon: 'code', description: 'Kuasai React, Vue, dan arsitektur CSS modern untuk membangun antarmuka pengguna yang memukau.' },
    { id: 2, name: 'Data Analyst', category: 'Data', courses_count: 10, icon: 'chart', description: 'Pelajari SQL, Python, dan Tableau untuk mengekstrak wawasan yang dapat ditindaklanjuti dari data mentah.' },
    { id: 3, name: 'UI/UX Designer', category: 'Design', courses_count: 6, icon: 'design', description: 'Rancang pengalaman digital yang interaktif menggunakan Figma dan metodologi riset pengguna.' },
    { id: 4, name: 'Backend Developer', category: 'Engineering', courses_count: 12, icon: 'code', description: 'Bangun API yang skalabel dan arsitektur server menggunakan Laravel, Node.js, dan pemodelan database tingkat lanjut.' },
    { id: 5, name: 'Digital Marketer', category: 'Marketing', courses_count: 7, icon: 'briefcase', description: 'Kuasai SEO, SEM, dan pemasaran performa untuk mendorong akuisisi pengguna secara masif.' },
    { id: 6, name: 'Cloud Engineer', category: 'Engineering', courses_count: 9, icon: 'code', description: 'Terapkan dan kelola infrastruktur cloud yang skalabel di AWS, GCP, dan Azure.' },
];

const CATEGORIES = ['All', 'Engineering', 'Data', 'Design', 'Marketing'];

export default function JobRoleIndex() {
    const { t } = useTranslation();
    const [allRoles, setAllRoles] = useState<any[]>(DUMMY_ROLES);
    const [activeCategory, setActiveCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'dial' | 'grid'>('dial');

    useEffect(() => {
        api.get('/job-roles')
            .then((res) => {
                const data = res.data?.data ?? res.data;

                if (Array.isArray(data) && data.length > 0) {
setAllRoles(data);
}
            })
            .catch(() => {});
    }, []);

    const filtered = activeCategory === 'All' ? allRoles : allRoles.filter((r) => r.category === activeCategory);

    // If Dial mode, hijack the page and render our massive custom Dial component
    if (viewMode === 'dial' && filtered.length > 0) {
        return (
            <DialCarouselLayout
                items={filtered}
                title="Discover Paths"
                subtitle="Your Future Career"
                onToggleView={() => setViewMode('grid')}
                renderDialItemText={(item) => item.name}
                renderDialItemIcon={(item) => <Briefcase className="w-6 h-6" />}
                renderDetail={(item) => (
                    <div className="flex flex-col max-w-2xl">
                        <div className="inline-flex max-w-max items-center px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 mb-6 font-bold text-sm">
                            <Sparkles className="w-4 h-4 mr-2" />
                            {item.category}
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter text-slate-900 dark:text-white drop-shadow-md">
                            {item.name}
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-xl">
                            {item.description}
                        </p>
                        <div className="flex items-center gap-4">
                            <Link
                                to={`/job-roles/${item.id}`}
                                className="bg-cyan-500 hover:bg-cyan-400 text-white shadow-[0_10px_30px_rgba(14,165,233,0.3)] hover:shadow-[0_10px_40px_rgba(14,165,233,0.5)] transition-all font-bold text-lg px-8 py-4 rounded-2xl flex items-center gap-2"
                            >
                                Explorer Path <ArrowRight className="w-5 h-5" />
                            </Link>
                            <div className="px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-slate-500 dark:text-slate-400 font-medium">
                                <strong className="text-slate-800 dark:text-white">{item.courses_count}</strong> Courses Built-in
                            </div>
                        </div>
                    </div>
                )}
            />
        );
    }

    return (
        <AppLayout
            title={t('roles.title')}
            description={t('roles.subtitle')}
        >
            <div className="flex justify-end mb-4">
                <button 
                    onClick={() => setViewMode('dial')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm hover:border-cyan-500 transition-colors"
                >
                    <Briefcase className="w-4 h-4 text-cyan-500" /> Switch to Dial View
                </button>
            </div>

            {/* Recommendation Banner */}
            <div className="mb-8 rounded-3xl bg-gradient-to-r from-cyan-50 dark:from-cyan-500/20 to-orange-50 dark:to-orange-500/10 border border-cyan-100 dark:border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('roles.ai.title')}</h2>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xl">{t('roles.ai.subtitle')}</p>
                </div>
                <Link
                    to="/job-roles/recommendation"
                    className="relative z-10 shrink-0 inline-flex items-center gap-2 bg-slate-800 dark:bg-slate-800 hover:bg-slate-700 dark:hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl transition-all border border-slate-700 hover:border-cyan-500/50"
                >
                    {t('roles.ai.btn')} <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                            activeCategory === cat
                                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                        }`}
                    >
                        {cat}
                        {cat !== 'All' && (
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${activeCategory === cat ? 'bg-cyan-500/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                                {allRoles.filter((r) => r.category === cat).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((role: any, index: number) => (
                    <JobRoleCard key={role.id} role={role} href={`/job-roles/${role.id}`} isFeatured={index === 0 && activeCategory === 'All'} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-4">
                        <Target className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('roles.emptyTitle', { defaultValue: 'No career paths in this category' })}</h3>
                    <button onClick={() => setActiveCategory('All')} className="mt-2 text-cyan-600 dark:text-cyan-400 text-sm font-medium hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors">
                        {t('roles.emptyBtn', { defaultValue: 'Show all paths' })}
                    </button>
                </div>
            )}
        </AppLayout>
    );
}
