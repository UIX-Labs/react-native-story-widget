export interface Story {
  id: number;
  url: string;
  type: 'image' | 'video';
  duration: number;
  storyId: number;
  isSeen?: boolean;
  showOverlay?: boolean;
  link?: string;
}

export interface StoriesType {
  id: number;
  username: string;
  title: string;
  profile: string;
  stories: Story[];
}

export const dummyStories: StoriesType[] = [
  {
    id: 1,
    username: 'John Doe',
    title: 'Travel Adventures',
    profile:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    stories: [
      {
        id: 1,
        url: 'https://plus.unsplash.com/premium_photo-1734545294150-3d6c417c5cfb?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        type: 'image',
        duration: 5000,
        storyId: 1,
        isSeen: false,
        showOverlay: false,
      },
      {
        id: 2,
        url: 'https://res.cloudinary.com/dkxocdrky/video/upload/v1746452292/tb8fedjbhd74cmmpuj3x.mp4',
        type: 'video',
        duration: 4000,
        storyId: 1,
        isSeen: false,
        showOverlay: true,
        link: 'https://example.com',
      },
      {
        id: 3,
        url: 'https://res.cloudinary.com/dkxocdrky/video/upload/v1746453520/Untitled_design_2_x3rpp7.mp4',
        type: 'video',
        duration: 10000,
        storyId: 1,
        isSeen: false,
        showOverlay: false,
      },
    ],
  },
  {
    id: 2,
    username: 'Sarah Wilson',
    title: 'Food Journey',
    profile:
      'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face',
    stories: [
      {
        id: 4,
        url: 'https://res.cloudinary.com/dkxocdrky/video/upload/v1743516129/rnkj9zjkydifop0xoxkl.mp4',
        type: 'video',
        duration: 6000,
        storyId: 2,
        isSeen: false,
        showOverlay: false,
      },
      {
        id: 5,
        url: 'https://res.cloudinary.com/dkxocdrky/video/upload/v1747329262/v2tyn4dipedjdgmjojri.mp4',
        type: 'video',
        duration: 5000,
        storyId: 2,
        isSeen: false,
        showOverlay: true,
        link: 'https://recipe.com',
      },
    ],
  },
  {
    id: 3,
    username: 'Mike Johnson',
    title: 'Fitness Goals',
    profile:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    stories: [
      {
        id: 6,
        url: 'https://res.cloudinary.com/dkxocdrky/video/upload/v1743516132/lgchgy9ch45bfcwhsqlo.mp4',
        type: 'video',
        duration: 4500,
        storyId: 3,
        isSeen: true,
        showOverlay: false,
      },
      {
        id: 7,
        url: 'https://plus.unsplash.com/premium_photo-1746718184918-05d7cbda1477?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8',
        type: 'image',
        duration: 5500,
        storyId: 3,
        isSeen: false,
        showOverlay: false,
      },
      {
        id: 8,
        url: 'https://plus.unsplash.com/premium_photo-1749157549740-1e3cfba66d6d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D',
        type: 'image',
        duration: 8000,
        storyId: 3,
        isSeen: false,
        showOverlay: true,
        link: 'https://fitness.com',
      },
    ],
  },
  {
    id: 4,
    username: 'Emma Davis',
    title: 'Art & Design',
    profile:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    stories: [
      {
        id: 9,
        url: 'https://images.unsplash.com/photo-1749259560252-ca132892004f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNnx8fGVufDB8fHx8fA%3D%3D',
        type: 'image',
        duration: 7000,
        storyId: 4,
        isSeen: false,
        showOverlay: false,
      },
      {
        id: 10,
        url: 'https://images.unsplash.com/photo-1749214487016-6911b7a543ee?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D',
        type: 'image',
        duration: 6000,
        storyId: 4,
        isSeen: false,
        showOverlay: true,
        link: 'https://artgallery.com',
      },
    ],
  },
  {
    id: 5,
    username: 'Alex Thompson',
    title: 'Tech Reviews',
    profile:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    stories: [
      {
        id: 11,
        url: 'https://images.unsplash.com/photo-1726198576700-036d97d596a3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D',
        type: 'image',
        duration: 5000,
        storyId: 5,
        isSeen: false,
        showOverlay: false,
      },
      {
        id: 12,
        url: 'https://images.unsplash.com/photo-1747657930052-e3cbe66b5c69?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D',
        type: 'image',
        duration: 4000,
        storyId: 5,
        isSeen: false,
        showOverlay: false,
      },
      {
        id: 13,
        url: 'https://images.unsplash.com/photo-1748711728527-e97c3763cb00?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMnx8fGVufDB8fHx8fA%3D%3D',
        type: 'image',
        duration: 12000,
        storyId: 5,
        isSeen: false,
        showOverlay: true,
        link: 'https://techreview.com',
      },
    ],
  },
];
