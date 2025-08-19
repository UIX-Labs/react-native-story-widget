export type PlayableRef = {
  play?: () => void;
  pause?: () => void;
};

export class MediaRegistry {
  private registry: Array<PlayableRef | undefined> = [];

  public attach(index: number, ref: PlayableRef | undefined) {
    this.registry[index] = ref;
  }

  public play(index: number) {
    this.pauseAll();
    this.registry[index]?.play?.();
  }

  public pause(index: number) {
    this.registry[index]?.pause?.();
  }

  public pauseAll() {
    this.registry.forEach(ref => ref?.pause?.());
  }
}

export default MediaRegistry;
