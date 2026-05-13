import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '@/lib/api';

/**
 * Google OAuth callback page.
 * Backend redirects here with ?token=... after successful auth.
 */
export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        const oauthError = searchParams.get('error');

        if (oauthError || !token) {
            setError('Google sign-in failed. Please try again.');

            setTimeout(() => navigate('/login'), 3000);

            return;
        }

        localStorage.setItem('auth_token', token);

        api.get('/user', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                const user = res.data?.data ?? res.data;
                localStorage.setItem('auth_user', JSON.stringify(user));
                // Full reload so AuthProvider re-initializes with the new token
                window.location.href = '/dashboard';
            })
            .catch(() => {
                setError('Could not fetch user data. Please try again.');
                localStorage.removeItem('auth_token');

                setTimeout(() => navigate('/login'), 3000);
            });
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            {error ? (
                <div className="text-center">
                    <p className="text-rose-400 font-medium mb-2">{error}</p>
                    <p className="text-slate-500 text-sm">Redirecting to login...</p>
                </div>
            ) : (
                <div className="text-center">
                    <svg className="animate-spin w-10 h-10 text-cyan-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-slate-400">Signing you in with Google...</p>
                </div>
            )}
        </div>
    );
}
