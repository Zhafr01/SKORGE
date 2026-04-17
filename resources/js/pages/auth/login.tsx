import { Zap, Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import type { FormEvent } from 'react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
            {/* Left Column - Branding / Graphic */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300">
                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-100/50 dark:bg-cyan-900/40 blur-3xl mix-blend-multiply dark:mix-blend-lighten transition-colors duration-300" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-100/50 dark:bg-orange-900/40 blur-3xl mix-blend-multiply dark:mix-blend-lighten transition-colors duration-300" />
                </div>
                
                <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center h-full px-8">
                    {/* Light mode: original vector; Dark mode: colorised with cyan-orange palette via CSS filter */}
                    <img src="/logo vector.svg" alt="SKORGE Logo" className="block dark:hidden w-full h-auto object-contain drop-shadow-xl transition-all duration-300" />
                    <img src="/logo vector.svg" alt="SKORGE Logo" className="hidden dark:block w-full h-auto object-contain transition-all duration-300" style={{ filter: 'invert(1) sepia(1) saturate(6) hue-rotate(160deg)' }} />
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-24 relative z-10 bg-white dark:bg-slate-950 transition-colors duration-300">
                <div className="w-full max-w-md">
                    {/* Logo for mobile */}
                    <div className="lg:hidden text-center mb-8">
                        <Link to="/" className="inline-flex items-center justify-center group">
                            <img src="/icon.png" alt="SKORGE Icon" className="h-16 w-auto object-contain transition-transform group-hover:scale-105 dark:brightness-0 dark:invert" />
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 transition-colors duration-300">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-medium transition-colors duration-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors duration-300 shadow-sm dark:shadow-none"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors duration-300" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors duration-300 shadow-sm dark:shadow-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-1">
                            <a href="#" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300">
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-13 py-3.5 flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30 mt-4 custom-ring"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                <>Sign In</>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-cyan-600 dark:text-cyan-400 font-bold hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-300">
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    {/* Social Login Divider */}
                    <div className="mt-8 relative border-slate-200 dark:border-slate-800">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800 transition-colors duration-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-slate-950 text-slate-400 dark:text-slate-500 transition-colors duration-300">Or sign in with</span>
                        </div>
                    </div>

                    {/* Social Login Buttons placeholder */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-300 gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors duration-300">Google</span>
                        </button>
                        <button className="flex items-center justify-center py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-300 gap-2">
                           <svg className="w-5 h-5 text-slate-900 dark:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.125 3.805 3.076 1.519-.053 2.12-.976 3.963-.976 1.815 0 2.378.976 3.961.947 1.637-.025 2.665-1.503 3.666-2.964 1.155-1.688 1.63-3.321 1.654-3.4-.04-.017-3.18-1.22-3.216-4.858-.03-3.048 2.493-4.512 2.607-4.582-1.424-2.083-3.626-2.366-4.407-2.45-1.745-.236-3.52 1.143-4.63 1.143zm2.532-3.167c.884-1.073 1.48-2.562 1.318-4.041-1.272.051-2.825.848-3.738 1.908-.816.942-1.516 2.454-1.326 3.916 1.427.11 2.862-.712 3.746-1.783z"/></svg>
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors duration-300">Apple</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
