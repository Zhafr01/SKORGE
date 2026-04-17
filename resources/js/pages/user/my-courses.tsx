import { BookOpen, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/skorge/AppLayout';
import { CourseCard } from '@/components/skorge/CourseCard';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';

export default function MyCoursesIndex() {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            setIsLoading(false);

            return;
        }

        api.get('/user/my-courses')
            .then(res => setCourses(res.data.data || res.data))
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, [isAuthenticated]);

    return (
        <AppLayout
            title={t('myCourses.title')}
            description={t('myCourses.subtitle')}
        >
            {isLoading ? (
                <div className="flex justify-center p-10"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course: any) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            href={`/courses/${course.id}`}
                            progress={course.progress}
                            status={course.status}
                        />
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
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-transform hover:scale-105 shadow-lg shadow-cyan-500/20"
                    >
                        {t('myCourses.browse')} <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </AppLayout>
    );
}
