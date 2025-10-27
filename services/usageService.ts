// services/usageService.ts

const ROLE_PLAY_USAGE_COUNT_KEY = 'aiRolePlayUsageCount';
const ROLE_PLAY_LIMIT = 10;

/**
 * Gets the current usage count for the AI Role Play feature for the current session.
 * @returns {number} The number of messages the user has sent.
 */
export const getRolePlayUsageCount = (): number => {
    try {
        const count = sessionStorage.getItem(ROLE_PLAY_USAGE_COUNT_KEY);
        return count ? parseInt(count, 10) : 0;
    } catch (e) {
        console.error("Could not read role play usage count.", e);
        return 0;
    }
};

/**
 * Increments the usage count for the AI Role Play feature by one.
 */
export const incrementRolePlayUsage = (): void => {
    try {
        const currentCount = getRolePlayUsageCount();
        sessionStorage.setItem(ROLE_PLAY_USAGE_COUNT_KEY, String(currentCount + 1));
    } catch (e) {
        console.error("Could not save role play usage count.", e);
    }
};

/**
 * Resets the usage count for the AI Role Play feature.
 * This should be called when a new session starts.
 */
export const resetRolePlayUsage = (): void => {
     try {
        sessionStorage.removeItem(ROLE_PLAY_USAGE_COUNT_KEY);
    } catch (e) {
        console.error("Could not reset role play usage count.", e);
    }
};

/**
 * Checks if the user has reached their message limit.
 * @returns {boolean} True if the limit has been reached or exceeded.
 */
export const isRolePlayLimitReached = (): boolean => {
    return getRolePlayUsageCount() >= ROLE_PLAY_LIMIT;
};
