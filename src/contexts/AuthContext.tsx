import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types/auth';
import { authAPI } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        authAPI.getMe()
            .then(user => {
                if (user) setUser(user);
            })
            .catch(() => {
                // Token invalid or expired
                authAPI.logout();
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        const user = await authAPI.login(email, password);
        setUser(user);
    };

    const register = async (username: string, email: string, password: string) => {
        const user = await authAPI.register(username, email, password);
        setUser(user);
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
