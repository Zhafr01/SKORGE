import { Camera, Save, User, ArrowLeft, Loader2, Image as ImageIcon, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/skorge/AppLayout';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function Profile() {
    const { user, refreshUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
    const [file, setFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setAvatarPreview(user.avatar || null);
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // Validate size (<2MB)
            if (file.size > 2 * 1024 * 1024) {
                setErrorMessage('Image size must be less than 2MB');

                return;
            }

            setFile(file);
            setErrorMessage('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const formData = new FormData();
            formData.append('name', name);

            if (file) {
                formData.append('avatar', file);
            }

            const response = await api.post('/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                setSuccessMessage('Profile updated successfully!');
                await refreshUser(); // Refresh the user context across the app
            }
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const UserInitialsFallback = () => (
        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center -z-10 absolute inset-0">
            <span className="text-6xl font-bold text-slate-500/50 dark:text-slate-400/50">
                 {name ? name.charAt(0).toUpperCase() : '?'}
            </span>
        </div>
    );

    return (
        <AppLayout hideSidebar hideBreadcrumbs>
            <div className="min-h-screen bg-slate-50/50 dark:bg-[#060D1A] pt-24 pb-12 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <Link to="/stats" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-semibold">Back to Stats</span>
                    </Link>

                    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="max-w-xl mx-auto">
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Edit Profile</h1>
                                <p className="text-slate-500 dark:text-slate-400">Update your personal information and photo.</p>
                            </div>

                            {successMessage && (
                                <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <p className="font-medium text-sm">{successMessage}</p>
                                </div>
                            )}

                            {errorMessage && (
                                <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
                                        <X className="w-5 h-5" />
                                    </div>
                                    <p className="font-medium text-sm">{errorMessage}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Auto-Avatar Setup */}
                                <div className="flex flex-col items-center">
                                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden relative bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center ring-4 ring-slate-100 dark:ring-slate-800/50">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar Profile Preview" className="w-full h-full object-cover relative z-10" />
                                            ) : (
                                                <>
                                                    <UserInitialsFallback />
                                                    <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-500 relative z-20 mb-1" />
                                                </>
                                            )}
                                        </div>
                                        
                                        <div className="absolute inset-0 bg-slate-900/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                                            <Camera className="w-8 h-8 text-white mb-1 drop-shadow-md" />
                                            <span className="text-white text-xs font-semibold drop-shadow-md">Upload</span>
                                        </div>

                                        <button 
                                            type="button" 
                                            className="absolute bottom-0 right-0 w-10 h-10 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 transition-transform hover:scale-110 z-40"
                                            onClick={(e) => {
 e.stopPropagation(); fileInputRef.current?.click(); 
}}
                                        >
                                            <Camera className="w-5 h-5" />
                                        </button>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileChange} 
                                            accept="image/*" 
                                            className="hidden" 
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-4 font-medium uppercase tracking-wider">Tap image to change avatar</p>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                            Display Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-shadow outline-none font-medium"
                                                placeholder="Your full name"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 dark:shadow-cyan-500/20 transition-all active:scale-[0.98]"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Saving Changes...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                <span>Save Profile</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
