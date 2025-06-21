import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import StoryCarousel from '../story-carousel/ StoryCarousel';
import {
  StoriesType,
  CustomStoryViewer,
  StoryInteractionHandlers,
  StoryViewContext,
} from '../types/types';

const {width: screenWidth} = Dimensions.get('window');

// Example 1: Custom Story Viewer with Overlay
const CustomStoryWithOverlay: CustomStoryViewer = ({
  context,
  navigation,
  renderDefaultStory,
}) => {
  return (
    <View style={styles.storyContainer}>
      {/* Render the default story content */}
      {renderDefaultStory()}

      {/* Custom overlay with story info */}
      <View style={styles.overlay}>
        <View style={styles.storyInfo}>
          <Text style={styles.storyTitle}>{context.story.title}</Text>
          <Text style={styles.storyProgress}>
            {context.storyIndex + 1} / {context.totalStories}
          </Text>
        </View>

        {/* Custom interaction buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.pause()}>
            <Text style={styles.buttonText}>⏸️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.resume()}>
            <Text style={styles.buttonText}>▶️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.markAsViewed()}>
            <Text style={styles.buttonText}>✅</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Example 2: Interactive Story Viewer with Polls
const InteractiveStoryViewer: CustomStoryViewer = ({
  context,
  navigation,
  renderDefaultStory,
}) => {
  const [pollAnswer, setPollAnswer] = useState<string | null>(null);

  return (
    <View style={styles.storyContainer}>
      {renderDefaultStory()}

      {/* Interactive poll overlay */}
      {context.story.showPoll && (
        <View style={styles.pollOverlay}>
          <Text style={styles.pollQuestion}>
            {context.story.pollQuestion || 'What do you think?'}
          </Text>

          <View style={styles.pollOptions}>
            {['Option A', 'Option B'].map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.pollOption,
                  pollAnswer === option && styles.selectedOption,
                ]}
                onPress={() => setPollAnswer(option)}>
                <Text style={styles.pollOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {pollAnswer && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                Alert.alert('Poll Answer', `You selected: ${pollAnswer}`);
                navigation.goToNext();
              }}>
              <Text style={styles.submitButtonText}>Submit & Next</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

// Example Usage Component
const CustomStoryViewerExample = () => {
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);

  // Custom story interaction handlers
  const customHandlers: StoryInteractionHandlers = {
    onStoryView: (context: StoryViewContext) => {
      console.log('Story viewed:', context.story.id);
      // Track analytics
      setAnalyticsData(prev => [
        ...prev,
        {
          action: 'view',
          storyId: context.story.id,
          timestamp: Date.now(),
          progress: context.currentProgress,
        },
      ]);
    },

    onStoryStart: (context: StoryViewContext) => {
      console.log('Story started:', context.story.id);
      // Custom logic when story starts
    },

    onStoryEnd: (context: StoryViewContext) => {
      console.log('Story ended:', context.story.id);
      // Custom completion logic
    },

    onStoryPress: (context: StoryViewContext, pressDetails) => {
      console.log('Story pressed:', pressDetails);

      // Custom tap handling based on location
      if (pressDetails.locationX < screenWidth * 0.3) {
        // Left tap - show previous story info
        Alert.alert('Previous Story', 'Going to previous story');
      } else if (pressDetails.locationX > screenWidth * 0.7) {
        // Right tap - show next story info
        Alert.alert('Next Story', 'Going to next story');
      } else {
        // Center tap - show story details
        Alert.alert('Story Details', `Story: ${context.story.title}`);
      }
    },

    onStoryLongPress: (context: StoryViewContext) => {
      // Custom long press behavior
      Alert.alert('Story Options', 'What would you like to do?', [
        {text: 'Share', onPress: () => console.log('Share story')},
        {text: 'Save', onPress: () => console.log('Save story')},
        {text: 'Report', onPress: () => console.log('Report story')},
        {text: 'Cancel', style: 'cancel'},
      ]);
    },

    onStoryPause: (context: StoryViewContext) => {
      console.log('Story paused');
      // Custom pause logic
    },

    onStoryResume: (context: StoryViewContext) => {
      console.log('Story resumed');
      // Custom resume logic
    },
  };

  // Custom story data transformer
  const customStoryData = (story: any, storyHeader: StoriesType) => {
    return {
      viewCount: Math.floor(Math.random() * 1000),
      isLiked: Math.random() > 0.5,
      showPoll: story.id % 2 === 0, // Show poll on even numbered stories
      pollQuestion: `What do you think about ${storyHeader.username}'s story?`,
      customProperty: 'This is custom data',
    };
  };

  const sampleStories: StoriesType[] = [
    {
      id: 1,
      username: 'john_doe',
      title: 'John Doe',
      profile: 'https://example.com/profile1.jpg',
      timestamp: Date.now(),
      stories: [
        {
          id: 1,
          url: 'https://example.com/story1.jpg',
          type: 'image',
          storyId: 1,
          title: 'Beach Day',
        },
        {
          id: 2,
          url: 'https://example.com/story2.jpg',
          type: 'image',
          storyId: 2,
          title: 'Sunset Views',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Story Viewer Examples</Text>

      {/* Example 1: Story with Overlay */}
      <StoryCarousel
        stories={sampleStories}
        renderCustomStoryViewer={CustomStoryWithOverlay}
        storyInteractionHandlers={customHandlers}
        customStoryData={customStoryData}
      />

      {/* Example 2: Interactive Story - uncomment to use */}
      {/* 
      <StoryCarousel
        stories={sampleStories}
        renderCustomStoryViewer={InteractiveStoryViewer}
        storyInteractionHandlers={customHandlers}
        customStoryData={customStoryData}
      />
      */}

      {/* Analytics Display */}
      <View style={styles.analytics}>
        <Text style={styles.analyticsTitle}>Analytics Data:</Text>
        {analyticsData.slice(-5).map((data, index) => (
          <Text key={index} style={styles.analyticsText}>
            {data.action} - Story {data.storyId} -{' '}
            {new Date(data.timestamp).toLocaleTimeString()}
          </Text>
        ))}
      </View>
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
    padding: 20,
  },
  storyContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  storyInfo: {
    marginBottom: 15,
  },
  storyTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  storyProgress: {
    color: '#ccc',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 25,
    minWidth: 50,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
  pollOverlay: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 15,
    padding: 20,
  },
  pollQuestion: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  pollOptions: {
    gap: 10,
  },
  pollOption: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  pollOptionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  analytics: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
  },
  analyticsTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  analyticsText: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default CustomStoryViewerExample;
