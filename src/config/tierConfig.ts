export type Tier = 'free' | 'explorer';

export interface TierFeatures {
    maxSearchesPerDay: number;
    maxFavorites: number;
    maxOfflineMaps: number;
    hasAds: boolean;
    hasAdvancedFilters: boolean;
    hasExportCalendar: boolean;
    hasTripPlanner: boolean;
    hasPrioritySupport: boolean;
    hasCustomLists: boolean;
    hasVipBadge: boolean;
}

export const TIER_CONFIG: Record<Tier, TierFeatures> = {
    free: {
        maxSearchesPerDay: 50,
        maxFavorites: 20,
        maxOfflineMaps: 0,
        hasAds: true,
        hasAdvancedFilters: false,
        hasExportCalendar: false,
        hasTripPlanner: false,
        hasPrioritySupport: false,
        hasCustomLists: false,
        hasVipBadge: false,
    },
    explorer: {
        maxSearchesPerDay: Infinity,
        maxFavorites: Infinity,
        maxOfflineMaps: 5,
        hasAds: false,
        hasAdvancedFilters: true,
        hasExportCalendar: true,
        hasTripPlanner: false,
        hasPrioritySupport: true,
        hasCustomLists: true,
        hasVipBadge: true,
    }
};

export function getTierConfig(tier: Tier = 'free'): TierFeatures {
    return TIER_CONFIG[tier];
}

export function hasFeature(tier: Tier = 'free', feature: keyof TierFeatures): boolean {
    const value = TIER_CONFIG[tier][feature];
    return value === true || (typeof value === 'number' && value > 0);
}

export function getLimit(tier: Tier = 'free', feature: keyof TierFeatures): number {
    const value = TIER_CONFIG[tier][feature];
    if (typeof value === 'number') {
        return value;
    }
    return 0;
}
