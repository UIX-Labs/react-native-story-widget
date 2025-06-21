import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import StoryCarousel from '../story-carousel/ StoryCarousel';
import {StoriesType, HeaderData, CustomHeaderRenderer} from '../types/types';

// Example 1: Simple custom header with just name and timestamp
const SimpleCustomHeader: CustomHeaderRenderer = ({
  headerData,
  renderDefaultProgressHeader,
}) => {
  return (
    <View>
      {/* Always render the progress header - this is required for functionality */}
      {renderDefaultProgressHeader()}

      {/* Custom header content */}
      <View style={styles.simpleHeader}>
        <Text style={styles.username}>{headerData.username}</Text>
        {headerData.timestamp && (
          <Text style={styles.timestamp}>
            {new Date(headerData.timestamp).toLocaleTimeString()}
          </Text>
        )}
      </View>
    </View>
  );
};

// Example 2: Rich custom header with profile image, verification badge, and actions
const RichCustomHeader: CustomHeaderRenderer = ({
  headerData,
  renderDefaultProgressHeader,
}) => {
  return (
    <View>
      {/* Always render the progress header */}
      {renderDefaultProgressHeader()}

      {/* Rich custom header */}
      <View style={styles.richHeader}>
        <View style={styles.leftSection}>
          {headerData.profile && (
            <Image
              source={{uri: headerData.profile}}
              style={styles.profileImage}
            />
          )}
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.displayName}>{headerData.title}</Text>
              {headerData.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            </View>
            <Text style={styles.handle}>@{headerData.username}</Text>
            {headerData.location && (
              <Text style={styles.location}>📍 {headerData.location}</Text>
            )}
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Example usage component
const CustomHeaderExample = () => {
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
        },
      ],
    },
  ];

  // Custom data transformer - you can add any additional data here
  const customHeaderData = (storyHeader: StoriesType): HeaderData => {
    return {
      ...storyHeader,
      // Add custom fields
      isVerified: true,
      location: 'New York, NY',
      followerCount: 12500,
      // Any other custom data you want to display
    };
  };

  return (
    <View style={styles.container}>
      {/* Example 1: Simple Header */}
      <StoryCarousel
        stories={sampleStories}
        renderCustomHeader={SimpleCustomHeader}
        headerData={customHeaderData}
      />

      {/* Example 2: Rich Header - just change the renderCustomHeader prop */}
      {/* 
      <StoryCarousel
        stories={sampleStories}
        renderCustomHeader={RichCustomHeader}
        headerData={customHeaderData}
      />
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  simpleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#ccc',
    fontSize: 12,
  },
  richHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  verifiedBadge: {
    backgroundColor: '#1DA1F2',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  handle: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 2,
  },
  location: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#1DA1F2',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    color: 'white',
    fontSize: 18,
  },
});

export default CustomHeaderExample;
