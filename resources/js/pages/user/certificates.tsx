import { Award, Download, ExternalLink, Share2, Search, Zap, Copy, Check, BookOpen, Filter } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/skorge/AppLayout';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';

type CertificateType = 'job_role' | 'course';

interface CertificateData {
    id: string;
    type: CertificateType;
    role: string;
    courseName?: string;
    date_issued: string;
    skills: string[];
    bg: string;
    textColor: string;
    iconColor: string;
}

type FilterTab = 'all' | 'job_role' | 'course';

export default function CertificatesIndex() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [printingId, setPrintingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<FilterTab>('all');
    
    const [certificates, setCertificates] = useState<CertificateData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/user/certificates')
            .then(res => {
                const data = res.data.data.map((c: any) => ({
                    id: c.certificate_number,
                    type: c.type,
                    role: c.job_role?.name || c.course?.job_role?.name || 'Developer',
                    courseName: c.course?.title,
                    date_issued: new Date(c.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    skills: ['Completed', 'Verified'],
                    bg: c.type === 'job_role' 
                        ? 'from-amber-50 dark:from-amber-900 to-orange-50 dark:to-orange-900' 
                        : 'from-cyan-50 dark:from-cyan-900 to-blue-50 dark:to-blue-900',
                    textColor: c.type === 'job_role' ? 'text-amber-700 dark:text-amber-400' : 'text-cyan-700 dark:text-cyan-400',
                    iconColor: c.type === 'job_role' ? 'from-amber-500 to-orange-500' : 'from-cyan-500 to-blue-500',
                }));
                setCertificates(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filtered = certificates.filter(c => {
        const matchesSearch = c.role.toLowerCase().includes(search.toLowerCase()) ||
            c.id.toLowerCase().includes(search.toLowerCase()) ||
            (c.courseName && c.courseName.toLowerCase().includes(search.toLowerCase()));
        const matchesTab = activeTab === 'all' || c.type === activeTab;

        return matchesSearch && matchesTab;
    });

    const jobRoleCount = certificates.filter(c => c.type === 'job_role').length;
    const courseCount = certificates.filter(c => c.type === 'course').length;

    const handleDownloadPdf = (cert: CertificateData) => {
        setPrintingId(cert.id);
        const printStyles = document.createElement('style');
        printStyles.id = 'cert-print-style';
        printStyles.textContent = `
            @media print {
                body * { visibility: hidden !important; }
                #cert-${cert.id}, #cert-${cert.id} * { visibility: visible !important; }
                #cert-${cert.id} {
                    position: fixed !important;
                    top: 0 !important; left: 0 !important;
                    width: 100vw !important;
                    padding: 2rem !important;
                }
            }
        `;
        document.head.appendChild(printStyles);
        setTimeout(() => {
            window.print();
            document.head.removeChild(printStyles);
            setPrintingId(null);
        }, 300);
    };

    const handleShareLinkedIn = (cert: CertificateData) => {
        const publicUrl = `https://skorge.dev/certificates/${cert.id}`;
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`;
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };

    const handleCopyPublicLink = (cert: CertificateData) => {
        const publicUrl = `https://skorge.dev/certificates/${cert.id}`;
        navigator.clipboard.writeText(publicUrl).then(() => {
            setCopiedId(cert.id);
            setTimeout(() => setCopiedId(null), 2500);
        });
    };

    const tabs: { key: FilterTab; label: string; count: number }[] = [
        { key: 'all', label: t('certs.all', { defaultValue: 'All' }), count: certificates.length },
        { key: 'job_role', label: t('certs.jobRole', { defaultValue: 'Job Role' }), count: jobRoleCount },
        { key: 'course', label: t('certs.course', { defaultValue: 'Course' }), count: courseCount },
    ];

    return (
        <AppLayout
            title={t('certs.title', { defaultValue: 'My Certificates' })}
            description={t('certs.subtitle', { defaultValue: 'View and manage your achieved credentials.' })}
        >
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder={t('certs.filterPlaceholder', { defaultValue: 'Search certificates...' })}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
                    />
                </div>
            </div>

            {/* Type Filter Tabs */}
            <div className="flex items-center gap-2 mb-8">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                            activeTab === tab.key
                                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        }`}
                    >
                        {tab.key === 'job_role' && <Award className="w-3.5 h-3.5" />}
                        {tab.key === 'course' && <BookOpen className="w-3.5 h-3.5" />}
                        {tab.key === 'all' && <Filter className="w-3.5 h-3.5" />}
                        {tab.label}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                            activeTab === tab.key
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Empty State / Loading */}
            {loading ? (
                <div className="py-24 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed flex flex-col items-center">
                    <p className="text-slate-500 dark:text-slate-400">Loading certificates...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-24 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed flex flex-col items-center shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-6">
                        <Award className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('certs.empty', { defaultValue: 'No Certificates Found' })}</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">{t('certs.emptyDesc', { defaultValue: "You don't have any certificates matching your criteria. Complete more courses and paths!" })}</p>
                </div>
            ) : null}

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filtered.map((cert) => {
                    const isJobRole = cert.type === 'job_role';
                    const TypeIcon = isJobRole ? Award : BookOpen;
                    const typeLabel = isJobRole
                        ? t('certs.jobRoleCertificate', { defaultValue: 'Job Role Certificate' })
                        : t('certs.courseCertificate', { defaultValue: 'Course Certificate' });
                    const completionText = isJobRole
                        ? t('certs.completedPathFor', { defaultValue: 'has successfully completed the career path for' })
                        : t('certs.completedCourse', { defaultValue: 'has successfully completed the course' });
                    const displayTitle = isJobRole ? cert.role : (cert.courseName || cert.role);

                    return (
                        <div key={cert.id} className="group flex flex-col">
                            {/* Certificate Representation */}
                            <div
                                id={`cert-${cert.id}`}
                                className={`relative aspect-[1.414/1] rounded-t-3xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${cert.bg}`}
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 dark:bg-white/5 rounded-full blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 dark:bg-black/20 rounded-full blur-2xl" />

                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <img src="/logo.png" alt="SKORGE Logo" className="h-8 w-auto object-contain dark:brightness-0 dark:invert" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                                isJobRole
                                                    ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                                                    : 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400'
                                            }`}>
                                                <TypeIcon className="w-3 h-3" />
                                                {typeLabel}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${cert.iconColor} flex items-center justify-center shadow-lg border border-white/20 dark:border-transparent`}>
                                        <TypeIcon className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                <div className="relative z-10 text-center">
                                    <p className="text-slate-600 dark:text-white/60 text-sm mb-2">{t('certs.certifiesThat', { defaultValue: 'This certifies that' })}</p>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 font-serif">{user?.name || 'Student'}</h3>
                                    <p className="text-slate-600 dark:text-white/60 text-sm mb-1">{completionText}</p>
                                    <h4 className={`text-2xl font-bold ${cert.textColor}`}>{displayTitle}</h4>
                                    {!isJobRole && (
                                        <p className="text-slate-500 dark:text-white/40 text-xs mt-1">
                                            {t('certs.partOf', { defaultValue: 'Part of' })} {cert.role} {t('certs.path', { defaultValue: 'path' })}
                                        </p>
                                    )}
                                </div>

                                <div className="relative z-10 flex justify-between items-end border-t border-slate-200 dark:border-white/10 pt-4 mt-8">
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-wider mb-1">{t('certs.dateIssued', { defaultValue: 'Date Issued' })}</div>
                                        <div className="text-sm font-medium text-slate-800 dark:text-white/80">{cert.date_issued}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-wider mb-1">{t('certs.credentialId', { defaultValue: 'Credential ID' })}</div>
                                        <div className="text-sm font-mono text-slate-800 dark:text-white/80">{cert.id}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Panel */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-t-0 rounded-b-3xl p-6 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">{t('certs.verifiedSkills', { defaultValue: 'Verified Skills' })}</h4>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {cert.skills.map(s => (
                                        <span key={s} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent">{s}</span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleDownloadPdf(cert)}
                                        disabled={printingId === cert.id}
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white font-bold transition-all hover:scale-[1.02]"
                                    >
                                        <Download className="w-4 h-4" />
                                        {printingId === cert.id ? 'Printing...' : t('certs.printPdf', { defaultValue: 'Download PDF' })}
                                    </button>
                                    <button
                                        onClick={() => handleShareLinkedIn(cert)}
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0077B5] dark:hover:bg-[#0077B5] text-slate-900 dark:text-white hover:text-white font-bold border border-slate-200 dark:border-slate-700 transition-all hover:scale-[1.02] hover:border-[#0077B5] dark:hover:border-[#0077B5]"
                                    >
                                        <Share2 className="w-4 h-4" /> {t('certs.shareLinkedIn', { defaultValue: 'Share' })}
                                    </button>
                                </div>
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => handleCopyPublicLink(cert)}
                                        className="text-xs text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
                                    >
                                        {copiedId === cert.id ? (
                                            <><Check className="w-3 h-3 text-emerald-400" /> <span className="text-emerald-400">{t('certs.copied', { defaultValue: 'Copied!' })}</span></>
                                        ) : (
                                            <><Copy className="w-3 h-3" /> {t('certs.copyLink', { defaultValue: 'Copy Public Link' })}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </AppLayout>
    );
}
