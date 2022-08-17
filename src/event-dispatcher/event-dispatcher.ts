import { waiter } from "../utility/waiter";

import { Observer } from "./observer";

function performanceViolationCheck(handler: string, time: number): void {
  if (time > 50) {
    console.warn(`[Violation] '${handler}' handler took ${time.toFixed(0)}ms to execute.`);
  }
}

export class EventDispatcher {

  private __listeners_: { [ key: string ]: Map<Function, Observer<any>> }

  constructor() {
    this.__listeners_ = ({ });
  }

  public addEventType(type: string): void {
    if (this.__listeners_[type] === undefined) {
      this.__listeners_[type] = new Map();
    }
  }

  public addEventListener<T = any>(type: string, listener: (e: any) => void, once?: boolean): Observer<T> {
    this.addEventType(type);

    if (this.__listeners_[type].get(listener) instanceof Observer) {
      return this.__listeners_[type].get(listener).subscribe(listener);
    }

    this.__listeners_[type].set(listener, new Observer<any>());

    return this.__listeners_[type].get(listener).subscribe(listener, once);
  }

  public hasEventListener(type: string, listener: (e: any) => void): boolean {
    try
    {
      return this.__listeners_[type].get(listener) ? true : false;
    }
    catch (err)
    {
      return false;
    }
  }

  public removeEventListener(type: string, listener: (e: any) => void): void {
    try
    {
      if (this.hasEventListener(type, listener)) {
        this.__listeners_[type].get(listener).destructor();
        this.__listeners_[type].delete(listener);
      }
    }
    catch(err)
    {
      return;
    }
  }

  public getEventObservers<T>(type: string): Array<Observer<T>> {
    if (this.__listeners_[type] === undefined) {
      this.__listeners_[type] = new Map();
    }

    return Array.from(this.__listeners_[type].values());
  } 

  public dispatchEvent<T>(type: string, event: T): void {
    if (typeof(type) !== 'string') {
      return;
    }

    const procs: Map<Function, Observer<T>> = this.__listeners_[type];

    if (!procs) {
      return;
    }

    for (const proc of procs) {
      const target: Function = proc[0];
      const observer: Observer<T> = proc[1];

      if (target !== observer.getListener()) {
        observer.unsubscribe();
      }

      if (observer.isSubscribed() === false) {
        observer.destructor();
        procs.delete(target);

        continue;
      }

      try
      {
        const start: number = performance.now();
        observer.performObservation(event);
        const end: number = performance.now();
        performanceViolationCheck(type, end - start);
      }
      catch(err)
      {
        continue;
      }
    }
  }

  public dispatchEventAsAsync<T>(type: string, event: T): Promise<void> {
    return waiter(this, function* () {
      if (typeof(type) !== 'string') {
        return;
      }
      
      const procs: Map<Function, Observer<T>> = this.__listeners_[type];

      if (!procs) {
        return;
      }

      for (const proc of procs) {
        const target: Function = proc[0];
        const observer: Observer<T> = proc[1];
        
        if (target !== observer.getListener()) {
          observer.unsubscribe();
        }
  
        if (observer.isSubscribed() === false) {
          observer.destructor();
          procs.delete(target);
  
          continue;
        }
  
        try
        {
          const start: number = performance.now();
          yield observer.asPromise(event);
          const end: number = performance.now();
          performanceViolationCheck(type, end - start);
        }
        catch(err)
        {
          continue;
        }
      }

      return;
    });
  }

}
