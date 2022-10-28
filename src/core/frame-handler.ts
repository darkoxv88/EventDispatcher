import { logError } from '../utility/log-error';

import { Observer } from '../event-dispatcher/observer';
import { EventDispatcher } from '../event-dispatcher/event-dispatcher';

export class FrameEvent {

  public readonly currentTime: number;
  public readonly deltaTime: number;
  public readonly totalElapsedTime: number;

  constructor(currentTime: number, deltaTime: number, totalElapsedTime: number) {
    this.currentTime = currentTime;
    this.deltaTime = deltaTime;
    this.totalElapsedTime = totalElapsedTime;
  }

}

let isStopped: boolean = false;
let isPaused: boolean = false;
let startingTime: number = 0;
let lastTime: number = 0;
let totalElapsedTime: number = 0;
let elapsedSinceLastLoop: number = 0;

const events: EventDispatcher = new EventDispatcher();

function render(currentTime: number) {
  if (isStopped) {
    requestAnimationFrame(render);

    return;
  }

  totalElapsedTime = currentTime - startingTime;
  elapsedSinceLastLoop = currentTime - lastTime;
  lastTime = currentTime;

  events
    .dispatchEventAsAsync('onframe', new FrameEvent(currentTime, (isPaused ? 0 : elapsedSinceLastLoop), totalElapsedTime))
    .catch((err) => {
      logError(err);
    })
    .finally(() => {
      requestAnimationFrame(render);
    });
}

requestAnimationFrame((currentTime: number) => {
  isStopped = false;
  isPaused = false;
  startingTime = currentTime;
  lastTime = currentTime;
  totalElapsedTime = 0;
  elapsedSinceLastLoop = 0;

  requestAnimationFrame(render);
});

export class FrameHandler {

  public static pause(): void {
    isPaused = true;
  }
  
  public static unpause(): void {
    isPaused = false;
  }
  
  public static stop(): void {
    isStopped = true;
  }
  
  public static resume(): void {
    isStopped = false;
  }

  private _observer: Observer<FrameEvent>;

  constructor(listener: (ev: FrameEvent) => void) { 
    this._observer = events.addEventListener('onframe', listener);
    this._observer.catch(logError);
  }

  public unsubscribe(): void {
    this._observer.unsubscribe();
  }

}
