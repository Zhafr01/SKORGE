import { Zap } from 'lucide-react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

interface PrivateRouteProps {
    children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center animate-pulse">
                        <Zap className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="space-y-2 text-center">
                        <div className="h-2 w-32 bg-slate-800 rounded-full animate-pulse" />
                        <div className="h-2 w-20 bg-slate-800/60 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
