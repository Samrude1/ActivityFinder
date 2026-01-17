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

    async updateTier(tier: string) {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/auth/tier`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ tier })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update tier');
        }

        const data = await response.json();
        if (data.token) {
            setToken(data.token);
        }
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

// Custom Lists API
export const listsAPI = {
    async getLists() {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/lists`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch lists');
        }

        return await response.json();
    },

    async getList(id: string) {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/lists/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch list');
        }

        return await response.json();
    },

    async createList(name: string, description?: string, icon?: string) {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/lists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, description, icon })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create list');
        }

        return await response.json();
    },

    async updateList(id: string, updates: { name?: string; description?: string; icon?: string }) {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/lists/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update list');
        }

        return await response.json();
    },

    async deleteList(id: string) {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/lists/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete list');
        }

        return await response.json();
    },

    async addItemToList(listId: string, activityData: any) {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/lists/${listId}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ activityData })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add item to list');
        }

        return await response.json();
    },

    async removeItemFromList(listId: string, itemId: string) {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/lists/${listId}/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to remove item from list');
        }

        return await response.json();
    }
};

// Export API
export const exportAPI = {
    async toCalendar(activities: any[]) {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/export/calendar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ activities })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to export to calendar');
        }

        // Get the iCal file as blob
        const blob = await response.blob();

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'activities.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        return { success: true };
    }
};

export const freeAPI = {
    async getSearchCount() {
        const token = getToken();
        if (!token) return { count: 0, limit: 50 };

        const response = await fetch(`${API_URL}/free/search-count`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to get search count');
        }

        return await response.json();
    },

    async searchActivities(location: any, radius: number, categories: string[]) {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/free/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ location, radius, categories })
        });

        if (!response.ok) {
            const error = await response.json();
            if (error.upgradeRequired) {
                // Return a specific object that the UI can check for
                throw { upgradeRequired: true, limit: error.limit, message: error.error };
            }
            throw new Error(error.error || 'Search failed');
        }

        return await response.json();
    },

    async getFavorites() {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/free/favorites`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to get favorites');
        return await response.json();
    },

    async addFavorite(activity: any) {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/free/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ activity })
        });

        if (!response.ok) {
            const error = await response.json();
            throw error; // Propagate error for upgradeRequired check
        }

        return await response.json();
    },

    async removeFavorite(id: string) {
        const token = getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/free/favorites/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to remove favorite');
        return await response.json();
    }
};

export { getToken, setToken, removeToken };
