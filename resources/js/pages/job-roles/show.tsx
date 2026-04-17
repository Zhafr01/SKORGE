import { Target, Zap, Briefcase, Award, CheckCircle2, ArrowRight, Terminal } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/skorge/AppLayout';
import { CourseCard } from '@/components/skorge/CourseCard';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

const DUMMY_ROLE = {
    id: 1,
    name: 'Frontend Developer',
    category: 'Engineering',
    description:
        'Master React, Vue, and modern CSS architecture to build stunning user interfaces. Frontend engineers are in massive demand globally, serving as the critical bridge between product design and user interaction.',
    icon: 'code',
};

const DUMMY_COURSES = [
    { id: 1, title: 'HTML & CSS Fundamentals', level: 'Beginner', duration_minutes: 120, field: 'IT' },
    { id: 2, title: 'JavaScript Mastery', level: 'Intermediate', duration_minutes: 240, field: 'IT' },
    { id: 3, title: 'React Modern Patterns', level: 'Advanced', duration_minutes: 180, field: 'IT' },
];

export default function JobRoleShow() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [role, setRole] = useState<any>(DUMMY_ROLE);
    const [pathCourses, setPathCourses] = useState<any[]>(DUMMY_COURSES);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        if (!id) {
 return; 
}

        api.get(`/job-roles/${id}`)
            .then((res) => setRole(res.data))
            .catch(() => {});
        api.get(`/job-roles/${id}/courses`)
            .then((res) => {
                const courses = res.data?.data ?? res.data;

                if (Array.isArray(courses) && courses.length > 0) {
setPathCourses(courses);
}
            })
            .catch(() => {});

        if (isAuthenticated) {
            api.get(`/job-roles/${id}/learning-path`)
                .then((res) => setIsEnrolled(!!res.data))
                .catch(() => {});
        }
    }, [id, isAuthenticated]);

    const handleStartPath = async () => {
        if (!isAuthenticated) {
            navigate('/login');

            return;
        }

        setIsStarting(true);

        try {
            await api.post('/learning-paths/start', { job_role_id: role.id });
            setIsEnrolled(true);
        } catch {
            // Fall into enrolled state for demo
            setIsEnrolled(true);
        } finally {
            setIsStarting(false);
        }
    };

    const handleOpenWorkspace = () => {
        // Navigate to the first course in the path
        if (pathCourses.length > 0) {
            navigate(`/courses/${pathCourses[0].id}`);
        }
    };

    const totalMinutes = pathCourses.reduce((acc, c) => acc + (c.duration_minutes || 60), 0);

    return (
        <AppLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content (Left) */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Header Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded">
                                {role.category}
                            </span>
                        </div>

                        <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">{role.name}</h1>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-8">{role.description}</p>

                        {!isEnrolled ? (
                            <button
                                onClick={handleStartPath}
                                disabled={isStarting}
                                className="h-12 px-8 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white font-bold transition-all hover:scale-105 shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                            >
                                <Target className="w-5 h-5" />
                                {isStarting ? 'Starting...' : 'Start Learning Path'}
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Path In Progress
                                </div>
                                <button
                                    onClick={() => pathCourses[0] && navigate(`/courses/${pathCourses[0].id}`)}
                                    className="h-12 px-6 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-bold transition-colors flex items-center gap-2"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Learning Path Courses */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">The Learning Journey</h2>
                        </div>

                        <div className="relative border-l-2 border-slate-800 ml-5 space-y-8 pb-4">
                            {pathCourses.map((course: any, idx: number) => {
                                const status = !isEnrolled ? 'locked' : idx === 0 ? 'completed' : idx === 1 ? 'unlocked' : 'locked';

                                return (
                                    <div key={course.id} className="relative pl-8">
                                        <div className={`absolute -left-[11px] top-4 w-5 h-5 rounded-full border-4 border-slate-950 ${
                                            status === 'completed' ? 'bg-emerald-500' : status === 'unlocked' ? 'bg-cyan-500' : 'bg-slate-700'
                                        }`} />
                                        <CourseCard
                                            course={course}
                                            href={`/courses/${course.id}`}
                                            status={status}
                                            progress={status === 'completed' ? 100 : status === 'unlocked' ? 45 : 0}
                                        />
                                    </div>
                                );
                            })}

                            {/* Project Work Simulation */}
                            <div className="relative pl-8 mt-4 pb-4">
                                <div className="absolute -left-[11px] top-6 w-5 h-5 rounded border-2 border-slate-950 bg-cyan-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] flex items-center justify-center">
                                    <Terminal className="w-3 h-3 text-white" />
                                </div>
                                <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] uppercase tracking-widest font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">Work Simulation</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Build an E-Commerce Dashboard</h3>
                                            <p className="text-sm text-slate-400 max-w-lg mb-3">Experience a realistic 3-day sprint. You'll receive a Figma design file, an API spec from the imaginary backend team, and a deadline to deliver the working React SPA.</p>
                                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                                                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> Virtual Internship</span>
                                                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Auto-Graded</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleOpenWorkspace}
                                            disabled={!isEnrolled}
                                            className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                                                isEnrolled
                                                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-cyan-500/30 hover:scale-105'
                                                    : 'bg-slate-800/50 text-slate-600 border border-slate-800 cursor-not-allowed'
                                            }`}
                                        >
                                            <Terminal className="w-4 h-4" /> Open Workspace
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Final Destination */}
                            <div className="relative pl-8 mt-4 pb-8">
                                <div className="absolute -left-[15px] top-6 w-7 h-7 rounded-sm rotate-45 border-4 border-slate-950 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                                <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/30 rounded-2xl p-8 flex items-center justify-between group">
                                    <div>
                                        <h3 className="text-2xl font-black text-amber-400 mb-1 flex items-center gap-2">
                                            <Award className="w-6 h-6" /> Final Assessment
                                        </h3>
                                        <p className="text-amber-500/80 font-medium">Earn your certified {role.name} credential.</p>
                                    </div>
                                    <button
                                        disabled={!isEnrolled}
                                        onClick={() => navigate(`/quiz/${id}`)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                                            isEnrolled
                                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30 cursor-pointer hover:scale-110'
                                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400 opacity-40 cursor-not-allowed'
                                        }`}
                                    >
                                        <Target className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-slate-400" /> Role Prerequisites
                        </h3>
                        <ul className="space-y-3">
                            {['Basic Computer Logic', 'English Proficiency', 'Problem Solving Skills'].map((req, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Target Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'TypeScript', 'CSS/Tailwind', 'Git', 'API Integration', 'Performance', 'Testing'].map((skill, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-800 text-sm font-medium text-slate-300 border border-slate-700 hover:border-cyan-500/40 transition-colors">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-900/40 to-slate-900 border border-cyan-500/20 rounded-2xl p-6 text-center">
                        <div className="text-3xl font-black text-white mb-1">{pathCourses.length}</div>
                        <div className="text-sm text-slate-400 mb-1">Courses in this path</div>
                        <div className="text-xs text-slate-500">{totalMinutes} min total • Earn 1 certificate</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
