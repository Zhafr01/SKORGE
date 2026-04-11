import React, { useState } from 'react';
import AppLayout from '@/components/skorge/AppLayout';
import { Award, Download, ExternalLink, Share2, Search, Zap, Copy, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';

const DUMMY_CERTIFICATES = [
    {
        id: 'CERT-FE-2026-9482',
        role: 'Frontend Developer',
        date_issued: 'March 15, 2026',
        skills: ['React', 'TypeScript', 'Tailwind', 'API Integration'],
        bg: 'from-sky-50 dark:from-sky-900 to-orange-50 dark:to-orange-900',
        textColor: 'text-sky-700 dark:text-sky-400',
        iconColor: 'from-sky-500 to-orange-500',
    },
    {
        id: 'CERT-UI-2025-1102',
        role: 'UI/UX Designer',
        date_issued: 'November 22, 2025',
        skills: ['Figma', 'User Research', 'Prototyping', 'Wireframing'],
        bg: 'from-slate-100 dark:from-slate-900 to-slate-200 dark:to-slate-800',
        textColor: 'text-slate-700 dark:text-slate-400',
        iconColor: 'from-slate-500 dark:from-slate-600 to-slate-400',
    }
];

export default function CertificatesIndex() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [printingId, setPrintingId] = useState<string | null>(null);

    const filtered = DUMMY_CERTIFICATES.filter(c =>
        c.role.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase())
    );

    const handleDownloadPdf = (cert: typeof DUMMY_CERTIFICATES[0]) => {
        setPrintingId(cert.id);
        // Inject minimal print styles targeting this specific cert
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

    const handleShareLinkedIn = (cert: typeof DUMMY_CERTIFICATES[0]) => {
        const publicUrl = `https://skorge.dev/certificates/${cert.id}`;
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`;
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };

    const handleCopyPublicLink = (cert: typeof DUMMY_CERTIFICATES[0]) => {
        const publicUrl = `https://skorge.dev/certificates/${cert.id}`;
        navigator.clipboard.writeText(publicUrl).then(() => {
            setCopiedId(cert.id);
            setTimeout(() => setCopiedId(null), 2500);
        });
    };

    return (
        <AppLayout
            title={t('certs.title')}
            description={t('certs.subtitle')}
        >
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder={t('certs.filterPlaceholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-sky-500 transition-colors shadow-sm"
                    />
                </div>
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="py-24 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed flex flex-col items-center shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-6">
                        <Award className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('certs.empty')}</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">{t('certs.emptyDesc')}</p>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filtered.map((cert) => (
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
                                    <div className="text-[10px] font-medium text-slate-500 dark:text-white/50 uppercase tracking-widest">{t('certs.typeTitle', { defaultValue: 'Certificate of Completion' })}</div>
                                </div>
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${cert.iconColor} flex items-center justify-center shadow-lg border border-white/20 dark:border-transparent`}>
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                            </div>

                            <div className="relative z-10 text-center">
                                <p className="text-slate-600 dark:text-white/60 text-sm mb-2">{t('certs.certifiesThat', { defaultValue: 'This certifies that' })}</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 font-serif">{user?.name || 'Alexander Developer'}</h3>
                                <p className="text-slate-600 dark:text-white/60 text-sm mb-1">{t('certs.completedPathFor', { defaultValue: 'has successfully completed the career path for' })}</p>
                                <h4 className={`text-2xl font-bold ${cert.textColor}`}>{cert.role}</h4>
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
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white font-bold transition-all hover:scale-[1.02]"
                                >
                                    <Download className="w-4 h-4" />
                                    {printingId === cert.id ? 'Printing...' : t('certs.printPdf')}
                                </button>
                                <button
                                    onClick={() => handleShareLinkedIn(cert)}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0077B5] dark:hover:bg-[#0077B5] text-slate-900 dark:text-white hover:text-white font-bold border border-slate-200 dark:border-slate-700 transition-all hover:scale-[1.02] hover:border-[#0077B5] dark:hover:border-[#0077B5]"
                                >
                                    <Share2 className="w-4 h-4" /> {t('certs.shareLinkedIn')}
                                </button>
                            </div>
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => handleCopyPublicLink(cert)}
                                    className="text-xs text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
                                >
                                    {copiedId === cert.id ? (
                                        <><Check className="w-3 h-3 text-emerald-400" /> <span className="text-emerald-400">{t('certs.copied')}</span></>
                                    ) : (
                                        <><Copy className="w-3 h-3" /> {t('certs.copyLink')}</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
