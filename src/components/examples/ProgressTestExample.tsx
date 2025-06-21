import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import StoryCarousel from '../story-carousel/ StoryCarousel';
import {StoriesType} from '../types/types';

const ProgressTestExample = () => {
  const testStories: StoriesType[] = [
    {
      id: 1,
      username: 'test_user',
      title: 'Test User',
      profile: 'https://via.placeholder.com/150',
      stories: [
        {
          id: 1,
          url: 'https://via.placeholder.com/400x600/FF0000/FFFFFF?text=Story+1',
          type: 'image',
          storyId: 1,
          duration: 3000, // 3 seconds for testing
        },
        {
          id: 2,
          url: 'https://via.placeholder.com/400x600/00FF00/FFFFFF?text=Story+2',
          type: 'image',
          storyId: 2,
          duration: 3000, // 3 seconds for testing
        },
        {
          id: 3,
          url: 'https://via.placeholder.com/400x600/0000FF/FFFFFF?text=Story+3',
          type: 'image',
          storyId: 3,
          duration: 3000, // 3 seconds for testing
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Indicator Test</Text>
      <Text style={styles.subtitle}>
        Watch the progress bars at the top - they should animate smoothly for
        each story
      </Text>

      <StoryCarousel
        stories={testStories}
        showSeenStories={true}
        onStoryViewed={(userId, storyId) => {
          console.log('Story viewed:', userId, storyId);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 50,
    paddingBottom: 10,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default ProgressTestExample;
