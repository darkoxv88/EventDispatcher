import { wait } from './utility/wait';
import { waiter } from './utility/waiter';
import { Observer } from './event-dispatcher/observer';
import { EventDispatcher } from './event-dispatcher/event-dispatcher';
import { FrameHandler } from './core/frame-handler';

function toGlobal(root: any): void {
  root['wait'] = root['wait'] ? root['wait'] : wait;
  root['waiter'] = root['waiter'] ? root['waiter'] : waiter;
  root['Observer'] = root['Observer'] ? root['Observer'] : Observer;
  root['EventDispatcher'] = root['EventDispatcher'] ? root['EventDispatcher'] : EventDispatcher;
  root['FrameHandler'] = root['FrameHandler'] ? root['FrameHandler'] : FrameHandler;
}

export const Api: typeof toGlobal = toGlobal;
