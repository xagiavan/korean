// services/featureFlagService.ts

// This service manages enabling/disabling features across the app.
// In a real-world scenario, this could fetch configuration from a remote server.
// For now, it's a simple, hardcoded configuration object.

interface FeatureFlags {
  [key: string]: boolean;
}

const featureFlags: FeatureFlags = {
  // Set to 'true' to enable the 10-message limit for non-VIP users in AI Role Play.
  rolePlayLimit: true,
  // Set to 'true' to enable the 5-minute time limit for non-VIP users in Live Tutor.
  liveTutorTimeLimit: true,
};

/**
 * Checks if a specific feature is enabled.
 * @param featureName The name of the feature to check.
 * @returns {boolean} True if the feature is enabled, false otherwise.
 */
export const isFeatureEnabled = (featureName: string): boolean => {
  return featureFlags[featureName] ?? false;
};
