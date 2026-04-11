import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Compass, LayoutDashboard, LogOut, Award, Bookmark, Info, Menu, X, FileText, Briefcase, TrendingUp, Library, Moon, Sun, Languages, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useTranslation } from '@/lib/i18n';

interface SidebarProps {
    className?: string;
    isCollapsed?: boolean;
    toggleCollapse?: () => void;
}

export default function Sidebar({ className, isCollapsed, toggleCollapse }: SidebarProps) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { lang, toggleLanguage, t } = useTranslation();

    const navItems = [
        ...(isAuthenticated ? [{ name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard }] : []),
        { name: t('nav.discover'), href: '/job-roles', icon: Compass },
        { name: t('nav.courses'), href: '/courses', icon: BookOpen },
        { name: t('nav.jobs'), href: '/jobs', icon: Briefcase },
        { name: t('nav.about'), href: '/about', icon: Info },
    ];

    const personalItems = [
        { name: t('nav.stats'), href: '/stats', icon: TrendingUp },
        { name: t('nav.certificates'), href: '/user/certificates', icon: Award },
        { name: t('nav.cv'), href: '/user/cv-builder', icon: FileText },
        { name: t('nav.mycourses'), href: '/user/my-courses', icon: Library },
    ];

    const handleSignOut = async () => {
        await logout();
        navigate('/');
    };

    const SidebarContent = () => (
        <>
            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed ? (
                    <Link to="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                        <img src="/logo.png" alt="SKORGE Logo" className="w-40 object-contain hidden dark:block" />
                        <img src="/logo.png" alt="SKORGE Logo" className="w-40 object-contain block dark:hidden sepia hue-rotate-[200deg] brightness-75 contrast-125" style={{ filter: 'brightness(0) saturate(100%) invert(20%) sepia(85%) saturate(1510%) hue-rotate(185deg) brightness(98%) contrast(97%)' }} /> 
                        {/* We use a CSS filter hack or just show original if light logo doesn't exist. Original logo is fine but text might be white. Let's just use the same logo but assume the text is visible or they have a light logo. Actually, let's keep original for now and see. If the logo has white text, it will be invisible on white bg. Wait, `dark:block` for original. */}
                    </Link>
                ) : (
                    <Link to="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                        <img src="/icon.png" alt="SKORGE Icon" className="w-8 h-8 object-contain" />
                    </Link>
                )}
                
                <div className="flex items-center gap-2">
                    <button className="lg:hidden text-slate-500 hover:text-slate-800 dark:hover:text-white" onClick={() => setMobileOpen(false)}>
                        <X className="w-5 h-5" />
                    </button>
                    {toggleCollapse && (
                        <button className="hidden lg:flex text-slate-500 hover:text-slate-800 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={toggleCollapse}>
                            <Menu className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
            {!isCollapsed && (
                <div className="px-4 pb-2">
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold px-3">{t('general.dominate')}</div>
                </div>
            )}

            <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto overflow-x-hidden">
                <div>
                    {!isCollapsed && <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('general.explore')}</h3>}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    title={isCollapsed ? item.name : undefined}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                                        isCollapsed ? 'justify-center' : ''
                                    } ${
                                        isActive
                                            ? 'bg-gradient-to-r from-sky-500/10 to-purple-500/10 text-sky-600 dark:text-sky-300 shadow-[inset_0_0_10px_rgba(14,165,233,0.1)] border border-sky-200/50 dark:border-sky-500/20'
                                            : 'text-slate-600 dark:text-slate-400 border border-transparent hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? 'text-sky-600 dark:text-sky-400 scale-110 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]' : ''}`} />
                                    {!isCollapsed && <span>{item.name}</span>}
                                    {isActive && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 drop-shadow-[0_0_4px_rgba(14,165,233,1)]" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {isAuthenticated && (
                    <div>
                        {!isCollapsed && <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('general.myLearning')}</h3>}
                        <nav className="space-y-1">
                            {personalItems.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        title={isCollapsed ? item.name : undefined}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                                            isCollapsed ? 'justify-center' : ''
                                        } ${
                                            isActive
                                                ? 'bg-gradient-to-r from-sky-500/10 to-purple-500/10 text-sky-600 dark:text-sky-300 shadow-[inset_0_0_10px_rgba(14,165,233,0.1)] border border-sky-200/50 dark:border-sky-500/20'
                                                : 'text-slate-600 dark:text-slate-400 border border-transparent hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? 'text-sky-600 dark:text-sky-400 scale-110 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]' : ''}`} />
                                        {!isCollapsed && <span>{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                )}
                
                {isAuthenticated && user?.role === 'admin' && (
                    <div>
                        {!isCollapsed && <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 mt-6">Administration</h3>}
                        <nav className="space-y-1">
                            <Link
                                to="/admin"
                                onClick={() => setMobileOpen(false)}
                                title={isCollapsed ? 'Admin Panel' : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                    isCollapsed ? 'justify-center' : ''
                                } ${
                                    pathname.startsWith('/admin')
                                        ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <Shield className={`w-5 h-5 shrink-0 ${pathname.startsWith('/admin') ? 'text-rose-600 dark:text-rose-400' : ''}`} />
                                {!isCollapsed && <span>Admin Panel</span>}
                                {pathname.startsWith('/admin') && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400" />}
                            </Link>
                        </nav>
                    </div>
                )}
            </div>

            {/* Application Settings (Theme & Lang) */}
            <div className={`px-4 py-3 flex ${isCollapsed ? 'flex-col gap-2 items-center' : 'gap-2 justify-center'} border-t border-slate-200 dark:border-slate-800/80`}>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={theme === 'dark' ? t('general.lightMode') : t('general.darkMode')}
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
                </button>
                <button
                    onClick={toggleLanguage}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold text-sm tracking-widest uppercase flex items-center gap-1"
                    title={t('general.switchLang')}
                >
                    <Languages className="w-5 h-5" /> {!isCollapsed && lang}
                </button>
            </div>

            {isAuthenticated && user ? (
                <div className={`p-4 border-t border-slate-200/50 dark:border-white/5 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
                    <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-md mb-2 border border-slate-200/50 dark:border-white/10 shadow-sm ${isCollapsed ? 'justify-center p-2' : ''}`}>
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-[0_0_15px_rgba(14,165,233,0.4)] overflow-hidden">
                            {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate drop-shadow-sm">{user.name}</p>
                                <p className="text-xs font-medium text-sky-600 dark:text-sky-400 truncate">{user.xp_points ?? 0} XP</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleSignOut}
                        title={isCollapsed ? t('nav.signout') : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/5 transition-all ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span>{t('nav.signout')}</span>}
                    </button>
                </div>
            ) : (
                <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                    <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="block w-full py-2.5 px-4 text-center rounded-xl font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                        {t('nav.login')}
                    </Link>
                    <Link
                        to="/register"
                        onClick={() => setMobileOpen(false)}
                        className="block w-full py-2.5 px-4 text-center rounded-xl font-medium bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-lg shadow-sky-500/20"
                    >
                        {t('nav.register')}
                    </Link>
                </div>
            )}
        </>
    );

    const MobileNav = () => (
        <div className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px] flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-[#0B1120]/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-transform duration-500`}>
             <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <LayoutDashboard className="w-6 h-6 text-slate-800 dark:text-white" />
             </Link>
             <button onClick={() => setMobileOpen(!mobileOpen)} className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/30 hover:scale-105 transition-transform">
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
             {isAuthenticated ? (
                 <div className="flex items-center gap-1">
                     {user?.role === 'admin' && (
                         <Link to="/admin" className="p-2 rounded-full text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                             <Shield className="w-6 h-6" />
                         </Link>
                     )}
                     <Link to="/user/profile" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-white text-xs overflow-hidden">
                             {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : user?.name.charAt(0).toUpperCase()}
                         </div>
                     </Link>
                     <button onClick={handleSignOut} className="p-2 -mr-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors">
                         <LogOut className="w-6 h-6" />
                     </button>
                 </div>
             ) : (
                 <Link to="/login" className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-white">
                     <LogOut className="w-6 h-6" />
                 </Link>
             )}

             {/* Expanded Mobile Menu */}
             {mobileOpen && (
                 <div className="absolute bottom-full left-0 right-0 mb-4 p-4 bg-white/90 dark:bg-[#0B1120]/95 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl shadow-xl flex flex-col gap-2">
                     {navItems.map(item => (
                         <Link key={item.name} to={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-medium">
                             <item.icon className="w-5 h-5" /> {item.name}
                         </Link>
                     ))}
                     {isAuthenticated && personalItems.map(item => (
                         <Link key={item.name} to={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-medium">
                             <item.icon className="w-5 h-5" /> {item.name}
                         </Link>
                     ))}
                 </div>
             )}
        </div>
    );

    return (
        <>
            {/* Desktop Floating Island Navigation */}
            <nav className={`hidden lg:flex fixed top-6 left-1/2 -translate-x-1/2 items-center justify-between px-2 xl:px-3 py-2 bg-white/40 dark:bg-[rgba(9,14,23,0.3)] backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-full z-50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 w-max min-w-[50%] max-w-[98vw] ${className}`}>
                
                {/* Logo Section */}
                <div className="flex shrink-0 px-2 xl:px-4">
                    <Link to="/">
                        <img src="/logo.png" alt="SKORGE Logo" className="h-6 object-contain hidden dark:block" />
                        <img src="/logo.png" alt="SKORGE Logo" className="h-6 object-contain block dark:hidden" style={{ filter: 'brightness(0) saturate(100%) invert(20%) sepia(85%) saturate(1510%) hue-rotate(185deg) brightness(98%) contrast(97%)' }} /> 
                    </Link>
                </div>

                {/* Primary Nav Items */}
                <div className="flex items-center justify-center gap-1 xl:gap-2 mx-1 xl:mx-6 shrink-0">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`px-2 xl:px-4 py-2 rounded-full font-bold text-xs xl:text-sm whitespace-nowrap transition-all duration-300 relative ${
                                    isActive
                                        ? 'text-sky-600 dark:text-white'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-white dark:bg-white/10 rounded-full border border-slate-200/50 dark:border-white/10 shadow-sm -z-10 blur-[1px]"></div>
                                )}
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Actions & Profile */}
                <div className="flex items-center gap-1 xl:gap-2 pr-3 xl:pr-4 pl-1 shrink-0">
                    <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
                        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                    </button>
                    {isAuthenticated && user ? (
                        <div className="flex items-center gap-2">
                            {user.role === 'admin' && (
                                <Link to="/admin" title={t('nav.admin') || 'Admin Panel'} className="p-2 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-500/10 transition-colors shadow-sm">
                                    <Shield className="w-4 h-4" />
                                </Link>
                            )}
                            <div className="relative group/profile">
                                <Link to="/user/profile" className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-white/70 dark:bg-white/10 border border-slate-200/50 dark:border-white/10 hover:border-sky-300 dark:hover:border-sky-500/50 transition-colors cursor-pointer shadow-sm">
                                    <div className="flex flex-col text-right hidden xl:flex">
                                        <span className="text-xs font-bold text-slate-800 dark:text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{user.name}</span>
                                        <span className="text-[10px] font-bold text-sky-500 mt-0.5">{user.xp_points ?? 0} XP</span>
                                    </div>
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-inner group-hover/profile:scale-110 transition-transform overflow-hidden">
                                         {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                                    </div>
                                </Link>

                                {/* Dropdown Menu for Personal Items (Stats & Legends, etc.) */}
                                <div className="absolute right-0 top-full mt-2 w-56 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 ease-out translate-y-2 group-hover/profile:translate-y-0 z-50">
                                    <div className="bg-white/90 dark:bg-[rgba(11,17,32,0.95)] backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden p-2 flex flex-col gap-1">
                                        {personalItems.map(item => (
                                            <Link key={item.name} to={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-sky-600 dark:hover:text-sky-400 font-medium text-sm transition-colors">
                                                <item.icon className="w-4 h-4 shrink-0 px-0" />
                                                <span className="whitespace-nowrap">{item.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleSignOut} title={t('nav.signout') || 'Logout'} className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors shadow-sm">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 xl:gap-2">
                            <Link to="/login" className="px-2 xl:px-4 py-2 text-xs xl:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all whitespace-nowrap hidden sm:block">
                                {t('nav.login')}
                            </Link>
                            <Link to="/register" className="px-3 xl:px-6 py-2 text-xs xl:text-sm font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-full shadow-lg shadow-sky-500/20 transition-transform hover:scale-105 whitespace-nowrap">
                                {t('nav.register')}
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            <MobileNav />
        </>
    );
}
