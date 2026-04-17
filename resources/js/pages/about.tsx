import { Target, Users, Zap, CheckCircle2, ChevronRight, Linkedin, Mail, Lock } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/skorge/AppLayout';
import { useTranslation } from '@/lib/i18n';

function useCountUp(target: number, duration = 1800) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const steps = 60;
        const stepDuration = duration / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += 1;
            setValue(Math.round((current / steps) * target));

            if (current >= steps) {
                clearInterval(timer);
                setValue(target);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [target, duration]);

    return value;
}

const TEAM = [
    {
        name: 'Paul Fajar Sabatino',
        role: 'Founder & CEO',
        bio: 'Former Lead Engineer at TechGiant. Passionate about democratizing access to high-income technical careers.',
        avatar: '/paul.png',
        avatarSize: 'h-60 w-auto',
        accentColor: 'text-emerald-400',
        hoverGradient: 'from-emerald-900/60',
        linkedin: 'https://linkedin.com',
        email: 'paul@skorge.dev',
    },
    {
        name: 'Muhammad Zhafier Ardine Yudhistira',
        role: 'CTO & Head of AI',
        bio: 'Architecting the AI-driven recommendation pathways and automated skill assessments powering the platform.',
        avatar: '/Zhafier.png',
        avatarSize: 'h-48 w-auto',
        accentColor: 'text-cyan-400',
        hoverGradient: 'from-cyan-900/60',
        linkedin: 'https://linkedin.com',
        email: 'zhafier@skorge.dev',
    },
    {
        name: 'Zacky Candra Firmansyah',
        role: 'VP of Learning Experience',
        bio: 'Ensuring every syllabus, module, and video interface is engaging, frictionless, and scientifically effective.',
        avatar: '/zacky.png',
        avatarSize: 'h-54 w-auto',
        accentColor: 'text-amber-400',
        hoverGradient: 'from-amber-900/60',
        linkedin: 'https://linkedin.com',
        email: 'zacky@skorge.dev',
    },
];

export default function About() {
    const { t } = useTranslation();
    const learnersCount = useCountUp(50000);
    const rolesCount = useCountUp(120);
    const partnersCount = useCountUp(300);
    const successRate = useCountUp(92);

    const stats = [
        { label: t('about.stat.learners'), value: `${(learnersCount / 1000).toFixed(0)}K+`, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10' },
        { label: t('about.stat.roles'), value: `${rolesCount}+`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: t('about.stat.partners'), value: `${partnersCount}+`, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
        { label: t('about.stat.success'), value: `${successRate}%`, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
    ];

    return (
        <AppLayout
            title={t('about.title')}
            description={t('about.subtitle')}
        >
            <div className="space-y-16 py-8">
                {/* Mission Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold uppercase tracking-wider">
                            <Target className="w-4 h-4" /> {t('about.mission')}
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                            {t('about.missionText1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400">{t('about.missionText2')}</span> {t('about.missionText3')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{t('about.missionText4')}</span>.
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            {t('about.missionDesc')}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            {[t('about.feat1'), t('about.feat2'), t('about.feat3')].map((item) => (
                                <div key={item} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-orange-500/20 rounded-3xl blur-3xl" />
                        <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl dark:shadow-2xl overflow-hidden group">
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="grid grid-cols-2 gap-4">
                                {stats.map((stat, i) => (
                                    <div key={i} className={`p-6 rounded-2xl border border-slate-200 dark:border-slate-800 ${stat.bg} backdrop-blur-sm hover:-translate-y-1 transition-all duration-300`}>
                                        <div className={`text-3xl font-black mb-1 ${stat.color} transition-transform hover:scale-110 origin-left`}>{stat.value}</div>
                                        <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="pt-12 border-t border-slate-800/50">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 mb-6">
                            <Users className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Meet The Team</h2>
                        <p className="text-slate-600 dark:text-slate-400">The industry veterans and education experts building the future of learning.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {TEAM.map((member) => (
                            <TeamMemberCard key={member.name} member={member} />
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative overflow-hidden bg-white dark:bg-slate-950 rounded-3xl p-10 lg:p-16 text-center border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl group cursor-pointer hover:border-cyan-400/50 transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(14,165,233,0.15)] dark:hover:shadow-[0_20px_60px_-15px_rgba(14,165,233,0.2)]">
                    {/* Glowing Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-orange-50 dark:from-cyan-900/40 dark:via-slate-900/80 dark:to-orange-900/40 opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Ambient Light Orbs */}
                    <div className="absolute top-0 -left-1/4 w-full h-full bg-cyan-300/30 dark:bg-cyan-500/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
                    <div className="absolute bottom-0 -right-1/4 w-full h-full bg-orange-300/20 dark:bg-orange-500/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>

                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] dark:opacity-[0.15] mix-blend-overlay pointer-events-none"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6">Ready to change your trajectory?</h2>
                        <p className="text-lg text-slate-600 dark:text-cyan-200 mb-8 max-w-2xl mx-auto">
                            Join thousands of learners who have transformed their careers using our structured, job-oriented paths.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-cyan-900 font-bold rounded-xl transition-all duration-300 hover:scale-110 hover:bg-slate-800 dark:hover:bg-cyan-50 hover:shadow-[0_0_40px_-10px_rgba(15,23,42,0.5)] dark:hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.8)] focus:ring-4 focus:ring-cyan-300/50 dark:focus:ring-cyan-300"
                        >
                            Start Your Journey Free <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}

// Extracted Team Member Card component for scrolling/interaction logic
function TeamMemberCard({ member }: { member: any }) {
    return (
        <div className="relative group cursor-pointer mt-16 md:mt-24 h-[400px] flex flex-col">
            {/* Base Card Background */}
            <div className="absolute inset-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl group-hover:shadow-[0_0_50px_-10px_rgba(14,165,233,0.2)] transition-all duration-700 z-0"></div>

            {/* Top Half Background Gradient (Always Visible to frame Avatar) */}
            <div className="absolute top-0 w-full h-64 rounded-t-3xl overflow-hidden z-10 transition-opacity duration-500">
                <div className={`absolute inset-0 bg-gradient-to-t ${member.hoverGradient} via-transparent dark:via-transparent to-transparent opacity-30 group-hover:opacity-80 transition-opacity duration-700`} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            {/* The 3D Pop Out Image (Z-30 so the bottom text block overlaps it, enhancing 3D frame effect) */}
            <div className="absolute top-0 left-0 w-full h-64 z-30 flex items-end justify-center pointer-events-none">
                <img
                    src={member.avatar}
                    alt={member.role}
                    className={`${member.avatarSize ?? 'w-48 h-48'} object-contain origin-bottom transform translate-y-6 group-hover:translate-y-[-60px] group-hover:scale-[1.5] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]`}
                />
            </div>

            {/* Bottom Text Section Wrapper (Z-50) */}
            <div className="relative z-50 flex-1 flex flex-col justify-end mt-auto pointer-events-none">


                {/* The Detailed Text Block (Fades in on hover) */}
                <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 rounded-b-3xl p-6 pointer-events-auto shadow-[0_-20px_40px_rgba(15,23,42,0.1)] dark:shadow-[0_-20px_40px_rgba(15,23,42,1)] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <h3 className="text-xl font-bold mb-1 text-slate-800 dark:text-cyan-400 group-hover:text-cyan-500 transition-colors">{member.name}</h3>
                    <p className={`${member.accentColor} font-semibold text-xs mb-3 uppercase tracking-wider`}>{member.role}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{member.bio}</p>

                    {/* Contact Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800/50 mt-auto">
                        <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-semibold text-sm transition-all border border-cyan-500/20 hover:border-cyan-500/40"
                        >
                            <Linkedin className="w-4 h-4" /> LinkedIn
                        </a>
                        <a
                            href={`mailto:${member.email}`}
                            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold text-sm transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500"
                        >
                            <Mail className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* The Cover Overlay for Bottom Section (Visible before hover) */}
                <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 rounded-b-3xl flex flex-col items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-500 shadow-sm shadow-slate-900/5 pointer-events-none p-6">
                    {/* Enlarged Logo without Box, colored in dark mode */}
                    <img src="/icon.png" alt="SKORGE Logo" className="w-64 h-64 object-contain opacity-20 dark:opacity-80 grayscale dark:grayscale-0 rounded-none mb-6 group-hover:scale-75 transition-transform duration-500" />
                    
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1.5 text-center">{member.name}</h3>
                    <p className={`${member.accentColor} font-bold text-[11px] uppercase tracking-widest text-center`}>{member.role}</p>
                    
                    <div className="mt-4 opacity-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Tap/Hover details
                    </div>
                </div>
            </div>
        </div>
    );
}
