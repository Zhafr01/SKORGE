import React, { useRef, useState } from 'react';
import AppLayout from '@/components/skorge/AppLayout';
import { Download, Edit3, Briefcase, GraduationCap, Star, Share2, Code2, Sparkles, Copy, Check, Loader } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';

const ALL_ROLES = [
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Designer',
    'Data Analyst',
    'Digital Marketer',
    'Cloud Engineer',
];

const ROLE_SKILLS: Record<string, string[]> = {
    'Frontend Developer': ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Git / GitHub', 'REST APIs'],
    'Backend Developer': ['Laravel', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'Redis'],
    'UI/UX Designer': ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Usability Testing', 'Wireframing'],
    'Data Analyst': ['SQL', 'Python', 'Tableau', 'Power BI', 'Excel', 'Data Storytelling'],
    'Digital Marketer': ['SEO/SEM', 'Google Ads', 'Analytics', 'Social Media', 'Email Marketing', 'A/B Testing'],
    'Cloud Engineer': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'],
};



export default function CVBuilder() {
    const { t } = useTranslation();
    const { user } = useAuth();

    const [targetRole, setTargetRole] = useState('Frontend Developer');
    const [summary, setSummary] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const cvData = {
        name: user?.name || 'Alexander Developer',
        email: user?.email || 'alexander@example.com',
        skills: ROLE_SKILLS[targetRole] || ROLE_SKILLS['Frontend Developer'],
        certifications: [
            { name: `${targetRole} Certification`, issuer: 'SKORGE', date: 'Mar 2026', id: 'CERT-FE-2026-9482' },
            { name: 'Advanced UI Patterns', issuer: 'SKORGE', date: 'Feb 2026', id: 'CERT-UI-2026-1144' },
        ],
        projects: [
            {
                name: 'E-Commerce Dashboard',
                desc: 'Built a fully functional React SPA dashboard with real-time data visualization using Chart.js and Tailwind.',
                link: 'github.com/alex/ecommerce-dash',
            },
            {
                name: 'Job Board Platform',
                desc: 'Integrated RESTful APIs to display, filter, and apply for jobs with secure authentication via Laravel Sanctum.',
                link: 'github.com/alex/job-board',
            },
        ],
    };

    const handleGenerateSummary = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/ai/cv-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: targetRole,
                    skills: ROLE_SKILLS[targetRole] || ROLE_SKILLS['Frontend Developer']
                })
            });
            const data = await response.json();
            setSummary(data.summary);
        } catch (error) {
            console.error('Failed to generate summary:', error);
            setSummary("Passionate professional ready to contribute to your team.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRoleChange = (role: string) => {
        setTargetRole(role);
        setSummary('');
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShareLink = () => {
        const shareUrl = `https://skorge.dev/cv/${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'user'}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    return (
        <AppLayout title={t('cv.title')} description={t('cv.subtitle')}>
            <div className="flex flex-col lg:flex-row gap-8 mt-8">
                {/* CV Editor Sidebar */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                                <Edit3 className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customize CV</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{t('cv.targetRole')}</label>
                                <select
                                    value={targetRole}
                                    onChange={(e) => handleRoleChange(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                                >
                                    {ALL_ROLES.map((role) => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">{t('cv.professionalSummary')}</label>
                                    <button
                                        onClick={handleGenerateSummary}
                                        disabled={isGenerating}
                                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 dark:text-sky-400 text-xs font-bold transition-all disabled:opacity-50 border border-sky-500/20"
                                    >
                                        {isGenerating ? (
                                            <><Loader className="w-3 h-3 animate-spin" /> {t('cv.generating')}</>
                                        ) : (
                                            <><Sparkles className="w-3 h-3" /> {t('cv.generateSummary')}</>
                                        )}
                                    </button>
                                </div>
                                <textarea
                                    rows={5}
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors resize-none text-sm leading-relaxed"
                                />
                                <p className="text-xs text-slate-500 mt-1">{t('cv.editFreely', { defaultValue: 'Edit freely or use AI Generate to tailor it to your role.' })}</p>
                            </div>

                            <p className="text-xs text-slate-500">{t('cv.skillsSynced', { defaultValue: 'Skills, certifications, and projects are synced automatically from your SKORGE profile.' })}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handlePrint}
                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all hover:scale-[1.02]"
                        >
                            <Download className="w-6 h-6" /> {t('cv.printDoc')}
                        </button>
                        <button
                            onClick={handleShareLink}
                            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold transition-all hover:scale-[1.02] shadow-sm"
                        >
                            {copied ? (
                                <><Check className="w-6 h-6 text-emerald-500 dark:text-emerald-400" /> <span className="text-emerald-600 dark:text-emerald-400 text-sm">Copied!</span></>
                            ) : (
                                <><Copy className="w-6 h-6" /> {t('cv.shareLink')}</>
                            )}
                        </button>
                    </div>
                </div>

                {/* CV Preview Pane — updates live as you type */}
                <div className="w-full lg:w-2/3">
                    <div
                        className="bg-white text-slate-900 rounded-2xl p-10 md:p-14 shadow-2xl min-h-[1056px] mx-auto print:shadow-none print:m-0 print:p-0 print:rounded-none"
                        style={{ maxWidth: '816px' }}
                    >
                        {/* CV Header */}
                        <div className="border-b-2 border-slate-200 pb-6 mb-8 text-center md:text-left">
                            <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">{cvData.name}</h1>
                            <h2 className="text-xl font-semibold text-sky-600 mb-3">{targetRole}</h2>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-slate-500">
                                <span>{cvData.email}</span>
                                <span>•</span>
                                <span>Portfolio: skorge.dev/u/{cvData.name.split(' ')[0].toLowerCase()}</span>
                                <span>•</span>
                                <span>{t('cv.availableForHire', { defaultValue: 'Available for Hire' })}</span>
                            </div>
                        </div>

                        {/* Summary — live updated */}
                        <div className="mb-8">
                            <p className="text-slate-700 leading-relaxed">{summary}</p>
                        </div>

                        {/* Projects */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                                <Briefcase className="w-5 h-5 text-sky-600" />
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">{t('cv.projects')}</h3>
                            </div>
                            <div className="space-y-6">
                                {cvData.projects.map((proj, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-800 text-lg">{proj.name}</h4>
                                            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">{t('cv.verifiedProject', { defaultValue: 'Verified Project' })}</span>
                                        </div>
                                        <a href={`https://${proj.link}`} className="text-sm font-medium text-sky-600 hover:underline mb-2 inline-block">{proj.link}</a>
                                        <p className="text-sm text-slate-600 leading-relaxed">{proj.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Certifications */}
                            <div>
                                <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                                    <GraduationCap className="w-5 h-5 text-sky-600" />
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">{t('cv.certifications')}</h3>
                                </div>
                                <div className="space-y-4">
                                    {cvData.certifications.map((cert, i) => (
                                        <div key={i}>
                                            <h4 className="font-bold text-slate-800">{cert.name}</h4>
                                            <div className="flex justify-between text-sm text-slate-500 mt-1">
                                                <span className="font-medium text-sky-600">{cert.issuer}</span>
                                                <span>{cert.date}</span>
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5 font-mono">ID: {cert.id}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Skills — dynamic per role */}
                            <div>
                                <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                                    <Star className="w-5 h-5 text-sky-600" />
                                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">{t('cv.skills')}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {cvData.skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold">
                                            <Code2 className="w-3.5 h-3.5 text-sky-500" />
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
                @media print {
                    body * { visibility: hidden; }
                    .print\\:m-0, .print\\:m-0 * { visibility: visible; }
                    .print\\:m-0 { position: absolute; left: 0; top: 0; width: 100%; }
                }
                `}
            </style>
        </AppLayout>
    );
}
