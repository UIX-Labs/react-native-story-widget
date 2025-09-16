import React from 'react';
import {StyleSheet, View, type ViewStyle} from 'react-native';
import RnVideo from 'react-native-video';

import {VIDEO_PROGRESS_UPDATE_INTERVAL} from '../../constants';
import type {VideoProgressType} from '../../types';
import {useStoryGroup} from '../composable';

interface VideoProps {
  url: string;
  style: ViewStyle;
  onProgress: (progress: VideoProgressType) => void;
  muted?: boolean;
  onEnd?: () => void;
  paused?: boolean;
}

export default function Video({
  url,
  style,
  onProgress,
  muted = false,
  onEnd,
  paused = true,
}: VideoProps) {
  return (
    <View style={styles.container}>
      <RnVideo
        source={{uri: url}}
        style={style}
        resizeMode="contain"
        onProgress={onProgress}
        progressUpdateInterval={VIDEO_PROGRESS_UPDATE_INTERVAL}
        repeat={false}
        paused={paused}
        muted={muted}
        onEnd={onEnd}
        ignoreSilentSwitch="obey"
        playInBackground={false}
        playWhenInactive={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
