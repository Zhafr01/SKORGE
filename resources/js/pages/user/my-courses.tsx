import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/skorge/AppLayout';
import { CourseCard } from '@/components/skorge/CourseCard';
import { BookOpen, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

export default function MyCoursesIndex() {
    const { t } = useTranslation();
    const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saved: number[] = JSON.parse(localStorage.getItem('skorge_my_courses') || '[]');
        setEnrolledIds(saved);
        
        api.get('/courses')
            .then(res => setAllCourses(res.data.data || res.data))
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, []);

    const handleRemove = (courseId: number) => {
        const updated = enrolledIds.filter((id) => id !== courseId);
        localStorage.setItem('skorge_my_courses', JSON.stringify(updated));
        setEnrolledIds(updated);
    };

    const items = allCourses.filter(course => enrolledIds.includes(course.id));

    return (
        <AppLayout
            title={t('myCourses.title')}
            description={t('myCourses.subtitle')}
        >
            {isLoading ? (
                <div className="flex justify-center p-10"><div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((course: any) => (
                        <div key={course.id} className="relative group">
                            <CourseCard course={course} href={`/courses/${course.id}`} />
                            <button
                                onClick={() => handleRemove(course.id)}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white flex items-center justify-center border border-rose-500/20 hover:border-rose-500 transition-all opacity-0 group-hover:opacity-100 text-sm font-bold z-10 shadow-sm"
                                title={t('myCourses.unenroll')}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center flex flex-col items-center justify-center bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-6 shadow-inner border border-slate-100 dark:border-slate-700">
                        <BookOpen className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{t('myCourses.empty')}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                        {t('myCourses.emptyDesc')}
                    </p>
                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-transform hover:scale-105 shadow-lg shadow-sky-500/20"
                    >
                        {t('myCourses.browse')} <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </AppLayout>
    );
}
