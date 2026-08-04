import { Activity } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
const getToken = () => localStorage.getItem('auth_token');

export interface AiItineraryItem {
    timeSlot: 'Morning' | 'Afternoon' | 'Evening';
    activityTitle: string;
    category: string;
    description: string;
    tip: string;
    activityRef?: Activity | null;
}

export interface AiItineraryResponse {
    title: string;
    summary: string;
    estimatedBudget: string;
    highlights: string[];
    schedule: AiItineraryItem[];
}

export interface AiConciergeResult {
    success: boolean;
    userTier?: string;
    itinerary: AiItineraryResponse;
    error?: string;
    upgradeRequired?: boolean;
}

export async function fetchAiItinerary(params: {
    location: { name?: string; address?: string; lat: number; lng: number };
    userQuery: string;
    preferences?: string[];
    durationDays?: number;
    availableActivities?: Activity[];
}): Promise<AiConciergeResult> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/ai/concierge`, {
        method: 'POST',
        headers,
        body: JSON.stringify(params)
    });

    const data = await response.json();

    if (!response.ok) {
        if (data.upgradeRequired) {
            return {
                success: false,
                upgradeRequired: true,
                error: data.message || 'Daily limit reached for Free Tier',
                itinerary: null as unknown as AiItineraryResponse
            };
        }
        throw new Error(data.error || 'Failed to fetch AI Concierge recommendations');
    }

    return data;
}
