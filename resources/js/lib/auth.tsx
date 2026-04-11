import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from './api';

interface User {
    id: number;
    name: string;
    email: string;
    role?: 'user' | 'admin';
    xp_points?: number;
    level?: number;
    current_streak?: number;
    learning_hours?: number;
    last_active_at?: string | null;
    pet_name?: string | null;
    pet_accessories?: string[];
    avatar?: string | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('auth_user');
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        const response = await api.post('/login', { email, password });
        const { access_token, token: fallbackToken, user: newUser } = response.data;
        const newToken = access_token ?? fallbackToken;
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const register = async (name: string, email: string, password: string, passwordConfirmation: string): Promise<void> => {
        const response = await api.post('/register', {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        });
        const { access_token, token: fallbackToken, user: newUser } = response.data;
        const newToken = access_token ?? fallbackToken;
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = async (): Promise<void> => {
        try {
            await api.post('/logout');
        } catch {
            // Ignore errors on logout
        }
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setToken(null);
        setUser(null);
    };

    const refreshUser = async (): Promise<void> => {
        try {
            const response = await api.get('/user');
            const freshUser = response.data?.data ?? response.data;
            if (freshUser) {
                setUser(freshUser);
                localStorage.setItem('auth_user', JSON.stringify(freshUser));
            }
        } catch {
            // Silently ignore refresh errors
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token && !!user,
                isAdmin: user?.role === 'admin',
                isLoading,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
