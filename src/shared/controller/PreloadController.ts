import {Image} from 'react-native';

export interface PreloadControllerOptions {
  imagePrefetch?: (url: string) => Promise<boolean>;
  videoWarmup?: (url: string) => void; // hidden-player warmup or native preloader
}

export class PreloadController {
  private options: Required<PreloadControllerOptions>;

  constructor(options: PreloadControllerOptions = {}) {
    this.options = {
      imagePrefetch: options.imagePrefetch ?? (url => Image.prefetch(url)),
      videoWarmup: options.videoWarmup ?? (() => {}),
    } as Required<PreloadControllerOptions>;
  }

  public preloadImage(url?: string) {
    if (!url) return;
    this.options.imagePrefetch(url).catch(() => {});
  }

  public preloadVideo(url?: string) {
    if (!url) return;
    this.options.videoWarmup(url);
  }
}

export default PreloadController;
