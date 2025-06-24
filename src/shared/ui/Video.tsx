import React from 'react';
import {ImageStyle, StyleProp, StyleSheet, View} from 'react-native';
import RnVideo, {OnProgressData} from 'react-native-video';
interface VideoProps {
  url: string;
  style: StyleProp<ImageStyle>;
  onProgress: (progress: OnProgressData) => void;
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
        progressUpdateInterval={0.25}
        repeat={false}
        paused={paused}
        muted={muted}
        onEnd={onEnd}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="obey"
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

export type {VideoProps};
