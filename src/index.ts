// Main component export
export {default as StoryCarousel} from './components/story-carousel/ StoryCarousel';

// Type exports - organized by category
export type {
  // Core data types
  Story,
  StoriesType,

  // Customization types
  HeaderData,
  StoryViewContext,
  CoreStoryFunctionality,

  // Renderer function types
  CustomHeaderRenderer,
  CustomStoryViewer,

  // Main component props
  StoryCarouselProps,
} from './components/types/types';

// Example components for reference (optional - can be imported separately)
export {default as CustomHeaderExample} from './components/examples/CustomHeaderExample';
export {default as CustomStoryViewerExample} from './components/examples/CustomStoryViewerExample';
export {default as ProgressTestExample} from './components/examples/ProgressTestExample';
