import { wait } from './utility/wait';
import { waiter } from './utility/waiter';
import { Observer } from './event-dispatcher/observer';
import { EventDispatcher } from './event-dispatcher/event-dispatcher';
import { FrameEvent, FrameHandler } from './core/frame-handler';

function toGlobal(root: any): void {
  root['wait'] = root['wait'] ? root['wait'] : wait;
  root['waiter'] = root['waiter'] ? root['waiter'] : waiter;
  root['EventDispatcherObserver'] = root['EventDispatcherObserver'] ? root['EventDispatcherObserver'] : Observer;
  root['EventDispatcher'] = root['EventDispatcher'] ? root['EventDispatcher'] : EventDispatcher;
  root['FrameEvent'] = root['FrameEvent'] ? root['FrameEvent'] : FrameEvent;
  root['FrameHandler'] = root['FrameHandler'] ? root['FrameHandler'] : FrameHandler;
}

export const Api: typeof toGlobal = toGlobal;
