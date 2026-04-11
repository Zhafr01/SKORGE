import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/skorge/AppLayout';
import { CourseCard } from '@/components/skorge/CourseCard';
import { BookOpen, Search, SlidersHorizontal, ArrowRight, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { DialCarouselLayout } from '@/components/skorge/DialCarouselLayout';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

const DUMMY_COURSES = [
    { id: 1, title: 'HTML & CSS Fundamentals', level: 'Beginner', duration_minutes: 120, field: 'IT', thumbnail: '/thumbnails/web-fundamentals.png' },
    { id: 2, title: 'JavaScript Mastery', level: 'Intermediate', duration_minutes: 240, field: 'IT', thumbnail: '/thumbnails/web-fundamentals.png' },
    { id: 3, title: 'Figma Prototyping Masterclass', level: 'Intermediate', duration_minutes: 150, field: 'Design', thumbnail: '/thumbnails/design.png' },
    { id: 4, title: 'SQL Data Extracting', level: 'Beginner', duration_minutes: 90, field: 'Data', thumbnail: '/thumbnails/data.png' },
    { id: 5, title: 'Advanced React Patterns', level: 'Advanced', duration_minutes: 180, field: 'IT', thumbnail: '/thumbnails/web-fundamentals.png' },
    { id: 6, title: 'SEO Masterclass 2026', level: 'Beginner', duration_minutes: 140, field: 'Marketing', thumbnail: '/thumbnails/marketing.png' },
    { id: 7, title: 'Python Crash Course', level: 'Beginner', duration_minutes: 200, field: 'Data', thumbnail: '/thumbnails/data.png' },
    { id: 8, title: 'UI Design Systems', level: 'Intermediate', duration_minutes: 160, field: 'Design', thumbnail: '/thumbnails/design.png' },
    { id: 9, title: 'Node.js & Express API', level: 'Advanced', duration_minutes: 210, field: 'IT', thumbnail: '/thumbnails/web-fundamentals.png' },
];

export default function CourseIndex() {
    const { t } = useTranslation();
    const [allCourses, setAllCourses] = useState<any[]>(DUMMY_COURSES);
    const [search, setSearch] = useState('');
    const [fieldFilter, setFieldFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [viewMode, setViewMode] = useState<'dial' | 'grid'>('dial');

    useEffect(() => {
        api.get('/courses')
            .then((res) => {
                const data = res.data?.data ?? res.data;
                if (Array.isArray(data) && data.length > 0) setAllCourses(data);
            })
            .catch(() => {});
    }, []);

    const filtered = allCourses.filter((c) => {
        const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
        const matchField = !fieldFilter || c.field === fieldFilter;
        const matchLevel = !levelFilter || c.level === levelFilter;
        return matchSearch && matchField && matchLevel;
    });

    // Only show top 5 courses in Dial mode
    const topCourses = filtered.slice(0, 5);

    if (viewMode === 'dial' && topCourses.length > 0) {
        return (
            <DialCarouselLayout
                items={topCourses}
                title="Top Courses"
                subtitle="Curated Vault"
                onToggleView={() => setViewMode('grid')}
                renderDialItemText={(item) => item.title}
                renderDialItemIcon={(item) => <Video className="w-6 h-6" />}
                renderDetail={(item) => (
                    <div className="flex flex-col max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 font-bold text-sm">
                                {item.field}
                            </span>
                            <span className="px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm">
                                {item.level}
                            </span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter text-slate-900 dark:text-white drop-shadow-md leading-tight">
                            {item.title}
                        </h1>
                        
                        <div className="flex items-center gap-4 mb-10">
                            <Link
                                to={`/courses/${item.id}`}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-[0_10px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_10px_40px_rgba(99,102,241,0.5)] transition-all font-bold text-lg px-8 py-4 rounded-2xl flex items-center gap-2"
                            >
                                Start Learning <ArrowRight className="w-5 h-5" />
                            </Link>
                            <div className="px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-slate-500 dark:text-slate-400 font-medium">
                                <strong className="text-slate-800 dark:text-white">{item.duration_minutes}</strong> mins
                            </div>
                        </div>
                    </div>
                )}
            />
        );
    }

    return (
        <AppLayout
            title={t('courses.title')}
            description={t('courses.subtitle')}
        >
            <div className="flex justify-end mb-4 max-w-4xl mx-auto">
                <button 
                    onClick={() => setViewMode('dial')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_5px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_10px_25px_rgba(99,102,241,0.4)] transition-all"
                >
                    <BookOpen className="w-4 h-4" /> View Top Courses Vault
                </button>
            </div>

            {/* Immersive Floating Command Bar */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="flex flex-col md:flex-row gap-4 mb-12 p-3 bg-white/40 dark:bg-[rgba(11,17,32,0.6)] backdrop-blur-xl rounded-full border border-white/60 dark:border-white/10 shadow-xl max-w-4xl mx-auto"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-sky-300" />
                    <input
                        type="text"
                        placeholder={t('courses.search')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-transparent border-none text-slate-800 dark:text-white text-lg rounded-full focus:outline-none focus:ring-0 placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                    />
                </div>
                <div className="h-10 w-px bg-slate-200 dark:bg-white/10 hidden md:block self-center mx-2"></div>
                <div className="flex items-center gap-3 px-4 shrink-0">
                    <SlidersHorizontal className="w-5 h-5 text-sky-500 hidden lg:block" />
                    <select
                        value={fieldFilter}
                        onChange={(e) => setFieldFilter(e.target.value)}
                        className="bg-slate-100 dark:bg-slate-800/50 border-none text-slate-800 dark:text-white text-sm font-semibold rounded-full focus:outline-none focus:ring-0 cursor-pointer px-5 py-3 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                        <option value="">{t('courses.allFields')}</option>
                        <option value="IT">{t('courses.field.it', { defaultValue: 'IT & Software' })}</option>
                        <option value="Design">{t('courses.field.design', { defaultValue: 'Design' })}</option>
                        <option value="Data">{t('courses.field.data', { defaultValue: 'Data Analytics' })}</option>
                        <option value="Marketing">{t('courses.field.marketing', { defaultValue: 'Marketing' })}</option>
                    </select>
                    <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        className="bg-slate-100 dark:bg-slate-800/50 border-none text-slate-800 dark:text-white text-sm font-semibold rounded-full focus:outline-none focus:ring-0 cursor-pointer px-5 py-3 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                        <option value="">{t('courses.allLevels')}</option>
                        <option value="Beginner">{t('courses.level.beginner', { defaultValue: 'Beginner' })}</option>
                        <option value="Intermediate">{t('courses.level.intermediate', { defaultValue: 'Intermediate' })}</option>
                        <option value="Advanced">{t('courses.level.advanced', { defaultValue: 'Advanced' })}</option>
                    </select>
                </div>
            </motion.div>

            {/* Header & Meta */}
            <div className="flex justify-between items-end mb-8 border-b border-slate-200/50 dark:border-white/10 pb-4">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Explore the Vault</h2>
                <p className="text-sm font-bold text-slate-500 dark:text-sky-300">
                    <span dangerouslySetInnerHTML={{ __html: t('courses.showing', { count: `<span class="text-sky-500 dark:text-white text-lg mx-1">${filtered.length}</span>` }) }} />
                </p>
            </div>

            {/* Standard Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 pb-24">
                    {filtered.map((c: any, index: number) => (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: (index % 6) * 0.1, type: "spring", bounce: 0.3 }}
                            className="h-full"
                        >
                            <CourseCard course={c} href={`/courses/${c.id}`} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-4">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('courses.emptyTitle', { defaultValue: 'No courses found' })}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{t('courses.emptyDesc', { defaultValue: 'Try adjusting your search or filters.' })}</p>
                    <button
                        onClick={() => { setSearch(''); setFieldFilter(''); setLevelFilter(''); }}
                        className="mt-4 text-sky-600 dark:text-sky-400 text-sm font-medium hover:text-sky-500 dark:hover:text-sky-300 transition-colors"
                    >
                        {t('courses.clearFilters', { defaultValue: 'Clear all filters' })}
                    </button>
                </div>
            )}
        </AppLayout>
    );
}
