import { wait } from './utility/wait';
import { waiter } from './utility/waiter';
import { Observer } from './event-dispatcher/observer';
import { EventDispatcher } from './event-dispatcher/event-dispatcher';
import { FrameHandler } from './core/frame-handler';


function toGlobal(root: any): void {
  root['wait'] = wait;
  root['waiter'] = waiter;
  root['Observer'] = Observer;
  root['EventDispatcher'] = EventDispatcher;
  root['FrameHandler'] = FrameHandler;
}

export const Api: typeof toGlobal = toGlobal;
