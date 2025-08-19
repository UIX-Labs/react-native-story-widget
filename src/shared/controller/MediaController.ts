import {IStory} from '../../types';

export interface VideoProgressType {
  currentTime: number;
  seekableDuration: number;
}

export interface MediaControllerOptions {
  onIndexChange?: (newIndex: number) => void;
  onProgress?: (index: number, progress01: number) => void;
  onStoryEnd?: (indexJustEnded: number) => void;
  preloadImage?: (url: string) => void;
  preloadVideo?: (url: string) => void;
  progressThrottle?: number; // 0..1, minimum delta before notifying onProgress
}

export type MediaRef = {
  play?: () => void;
  pause?: () => void;
};

export class MediaController {
  private stories: IStory[];
  private currentIndex: number = 0;
  private isPaused: boolean = false;
  private lastProgress01: number = 0;
  private mediaRefs: Array<MediaRef | undefined> = [];
  private options: Required<MediaControllerOptions>;

  constructor(stories: IStory[], options: MediaControllerOptions = {}) {
    this.stories = stories;
    this.options = {
      onIndexChange: options.onIndexChange ?? (() => {}),
      onProgress: options.onProgress ?? (() => {}),
      onStoryEnd: options.onStoryEnd ?? (() => {}),
      preloadImage: options.preloadImage ?? (() => {}),
      preloadVideo: options.preloadVideo ?? (() => {}),
      progressThrottle: options.progressThrottle ?? 0.01,
    };
    this.mediaRefs = new Array(stories.length);
  }

  public setStories(stories: IStory[]) {
    this.stories = stories;
    this.mediaRefs = new Array(stories.length);
    this.currentIndex = Math.min(
      this.currentIndex,
      Math.max(0, stories.length - 1),
    );
  }

  public attachMediaRef(index: number, ref: MediaRef | undefined) {
    this.mediaRefs[index] = ref;
  }

  public getIndex() {
    return this.currentIndex;
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
    if (paused) {
      this.pauseAll();
    } else {
      this.playCurrent();
    }
  }

  public playCurrent() {
    if (this.isPaused) return;
    this.pauseAll();
    this.mediaRefs[this.currentIndex]?.play?.();
  }

  public pauseAll() {
    this.mediaRefs.forEach(ref => ref?.pause?.());
  }

  public previous() {
    this.goTo(this.currentIndex - 1);
  }

  public next() {
    this.goTo(this.currentIndex + 1);
  }

  public goTo(index: number) {
    if (index === this.currentIndex) return;
    if (index < 0) {
      // clamp to 0
      this.updateIndex(0);
      return;
    }
    if (index >= this.stories.length) {
      // reached end
      this.options.onStoryEnd(this.currentIndex);
      return;
    }
    this.updateIndex(index);
  }

  private updateIndex(newIndex: number) {
    this.pauseAll();
    this.currentIndex = newIndex;
    this.lastProgress01 = 0;
    this.options.onIndexChange(newIndex);
    this.playCurrent();
    this.preloadNext();
  }

  public handleProgress(index: number, progress: VideoProgressType) {
    if (index !== this.currentIndex) return;
    const {currentTime, seekableDuration} = progress;
    if (seekableDuration <= 0) return;
    const value = currentTime / seekableDuration;
    if (value >= 1) {
      this.options.onProgress(index, 1);
      this.next();
      return;
    }
    if (
      Math.abs(value - this.lastProgress01) >= this.options.progressThrottle
    ) {
      this.lastProgress01 = value;
      this.options.onProgress(index, value);
    }
  }

  private preloadNext() {
    const next = this.stories[this.currentIndex + 1];
    if (!next) return;
    if (next.type === 'image') {
      this.options.preloadImage(next.url);
    } else {
      this.options.preloadVideo(next.url);
    }
  }
}

export default MediaController;
