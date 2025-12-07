const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';


// Get auth token from localStorage
const getToken = () => localStorage.getItem('auth_token');

// Set auth token
const setToken = (token: string) => localStorage.setItem('auth_token', token);

// Remove auth token
const removeToken = () => localStorage.removeItem('auth_token');

// Auth API
export const authAPI = {
    async register(username: string, email: string, password: string) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        const data = await response.json();
        setToken(data.token);
        return data.user;
    },

    async login(email: string, password: string) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        setToken(data.token);
        return data.user;
    },

    async getMe() {
        const token = getToken();
        if (!token) return null;

        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            removeToken();
            return null;
        }

        const data = await response.json();
        return data.user;
    },

    logout() {
        removeToken();
    }
};

// Favorites API
export const favoritesAPI = {
    async getFavorites() {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/favorites`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        return data.favorites;
    },

    async addFavorite(activity: any) {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ activity })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add favorite');
        }

        return await response.json();
    },

    async removeFavorite(activityId: string) {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/favorites/${activityId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to remove favorite');
        }

        return await response.json();
    }
};

export { getToken, setToken, removeToken };
