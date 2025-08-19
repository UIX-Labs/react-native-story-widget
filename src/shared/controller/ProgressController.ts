export type ProgressListener = (progress01: number) => void;

export class ProgressController {
  private durationSec: number;
  private isPaused: boolean = true;
  private startTsMs: number | null = null;
  private elapsedSec: number = 0;
  private rafId: number = 0;
  private listeners = new Set<ProgressListener>();

  constructor(durationSec: number) {
    this.durationSec = durationSec > 0 ? durationSec : 5;
  }

  public setDuration(durationSec: number) {
    this.durationSec = durationSec > 0 ? durationSec : 5;
  }

  public reset() {
    this.stopTicker();
    this.isPaused = true;
    this.startTsMs = null;
    this.elapsedSec = 0;
    this.notify(0);
  }

  public setPaused(paused: boolean) {
    if (paused) {
      this.stopTicker();
      this.isPaused = true;
      this.startTsMs = null;
    } else {
      this.isPaused = false;
      const resumeOffsetMs = this.elapsedSec * 1000;
      const t1 = performance.now() - resumeOffsetMs;
      this.startTsMs = t1;
      this.startTicker(t1);
    }
  }

  public onVideoProgress(currentTime: number, seekableDuration: number) {
    if (seekableDuration <= 0) return;
    const value = currentTime / seekableDuration;
    this.elapsedSec = Math.min(seekableDuration, currentTime);
    this.notify(Math.max(0, Math.min(1, value)));
  }

  public onTick(listener: ProgressListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(value: number) {
    this.listeners.forEach(l => l(value));
  }

  private startTicker(t1: number) {
    const helper = () => {
      const t2 = performance.now();
      const elapsedSec = (t2 - t1) / 1000;
      this.elapsedSec = elapsedSec;
      const value = elapsedSec / this.durationSec;
      if (value >= 1) {
        this.notify(1);
        this.stopTicker();
        return;
      }
      this.notify(value);
      this.rafId = requestAnimationFrame(helper);
    };
    this.rafId = requestAnimationFrame(helper);
  }

  private stopTicker() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }
}

export default ProgressController;
