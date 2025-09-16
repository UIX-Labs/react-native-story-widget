import React, {useCallback, useEffect, useRef} from 'react';
import {type ImageStyle, Image as RNImage, type StyleProp} from 'react-native';
import {DEFAULT_IMAGE_DURATION_SEC} from '../../constants';

interface ImageProps {
  url: string;
  style: StyleProp<ImageStyle>;
  maxTime?: number;
  active?: boolean;
  paused?: boolean;
  onProgress: ({
    currentTime,
    seekableDuration,
  }: {
    currentTime: number;
    seekableDuration: number;
  }) => void;
}

export default function Image({
  url,
  style,
  maxTime = DEFAULT_IMAGE_DURATION_SEC,
  active = true,
  paused = false,
  onProgress,
}: ImageProps) {
  const timerRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const elapsedSecRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, []);

  const startProgress = useCallback(() => {
    const resumeOffsetMs = elapsedSecRef.current * 1000;
    const t1 = performance.now() - resumeOffsetMs;
    startTimeRef.current = t1;
    const helper = () => {
      const t2 = performance.now();

      const elapsedSeconds = (t2 - t1) / 1000;
      const progress = elapsedSeconds / maxTime;

      if (progress >= 1) {
        cancelAnimationFrame(timerRef.current);
        startTimeRef.current = null;
        elapsedSecRef.current = maxTime;
        onProgress({currentTime: maxTime, seekableDuration: maxTime});

        return;
      }

      elapsedSecRef.current = elapsedSeconds;
      onProgress({currentTime: elapsedSeconds, seekableDuration: maxTime});
      timerRef.current = requestAnimationFrame(helper);
    };

    timerRef.current = requestAnimationFrame(helper);
  }, [maxTime, onProgress]);

  const pauseProgress = useCallback(() => {
    cancelAnimationFrame(timerRef.current);
    startTimeRef.current = null;
  }, []);

  useEffect(() => {
    if (!active || paused) {
      pauseProgress();
      return;
    }
    // start when active and not paused
    startProgress();
    return pauseProgress;
  }, [active, paused, startProgress, pauseProgress]);

  return <RNImage source={{uri: url}} style={style} />;
}
