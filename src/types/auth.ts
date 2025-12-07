export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    preferences: {
        theme: 'light' | 'dark';
        notifications: boolean;
    };
    favorites: string[]; // IDs of favorite activities
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
