import {AppState, AppStateStatus} from 'react-native';

export interface LifecycleCallbacks {
  onActive: () => void;
  onInactive: () => void;
}

export class LifecycleController {
  private callbacks: LifecycleCallbacks;
  private appState: AppStateStatus = AppState.currentState;
  private sub?: {remove: () => void};

  constructor(callbacks: LifecycleCallbacks) {
    this.callbacks = callbacks;
  }

  public bind() {
    this.sub = AppState.addEventListener('change', nextState => {
      this.appState = nextState;
      if (nextState === 'active') {
        this.callbacks.onActive();
      } else {
        this.callbacks.onInactive();
      }
    });
  }

  public unbind() {
    this.sub?.remove();
    this.sub = undefined;
  }
}

export default LifecycleController;
