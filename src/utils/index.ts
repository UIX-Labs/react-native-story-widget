export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};

export const transformCloudinaryVideo = (
  url: string,
  quality = 'auto',
): string => {
  const transformation = `q_${quality},f_auto`;
  return url.replace('/upload/', `/upload/${transformation}/`);
};

export const formatDuration = (duration: number): number => {
  return duration > 60 ? duration / 1000 : duration;
};

export const calculateProgress = (
  currentTime: number,
  totalDuration: number,
): number => {
  if (totalDuration <= 0) return 0;
  return Math.min(1, currentTime / totalDuration);
};

export const getNextStoryIndex = (
  currentIndex: number,
  totalStories: number,
): number => {
  return clamp(currentIndex + 1, 0, totalStories - 1);
};

export const getPreviousStoryIndex = (currentIndex: number): number => {
  return Math.max(0, currentIndex - 1);
};

export const getStoryProgress = (
  storyIndex: number,
  currentStoryIndex: number,
  currentProgress: number,
): number => {
  if (storyIndex === currentStoryIndex) {
    return currentProgress;
  }
  if (storyIndex < currentStoryIndex) {
    return 1;
  }
  return 0;
};
