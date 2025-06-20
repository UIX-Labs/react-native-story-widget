/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {dummyStories} from './src/components/constants/dummyData';
import StoryCarousel from './src/components/story-carousel/ StoryCarousel';

if (__DEV__) {
  require('./ReactotronConfig');
}

const AppContent = () => {
  return (
    <View style={styles.container}>
      <StoryCarousel stories={dummyStories} />
    </View>
  );
};

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <AppContent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
