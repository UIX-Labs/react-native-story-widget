/**
 * Story feature constants
 */

// Media durations
export const DEFAULT_IMAGE_DURATION_SEC = 4.5;
export const VIDEO_PROGRESS_UPDATE_INTERVAL = 0.25;

// UI constants
export const SCREEN_TAP_THRESHOLDS = {
  LEFT: 0.3,
  RIGHT: 0.7,
} as const;

// Story navigation
export const STORY_NAVIGATION = {
  LONG_PRESS_DELAY: 200,
  HIT_SLOP: 24,
} as const;

// Progress bar
export const PROGRESS_BAR = {
  HEIGHT: 3,
  BORDER_RADIUS: 1.5,
  GAP: 4,
  BACKGROUND_COLOR: '#464646',
  ACTIVE_COLOR: '#00ffd1',
} as const;

// Profile image
export const PROFILE_IMAGE = {
  SIZE: 32,
  BORDER_RADIUS: 16,
  BORDER_WIDTH: 1,
  BORDER_COLOR: 'white',
} as const;
