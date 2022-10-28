/**
  * 
	* @author Darko Petrovic
  * @Link Facebook: https://www.facebook.com/WitchkingOfAngmarr
  * @Link GitHub: https://github.com/darkoxv88
  * 
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.


exports:

  window.wait;
	window.waiter;
	window.EventDispatcherObserver;
  window.EventDispatcher;
	window.FrameHandler;

**/

declare function wait(duration: number): Promise<void>;
declare function waiter(thisArg: Object | null, generator: Function): Promise<any>;

declare class EventDispatcherObserver<T> {

  private _isSubscribed: boolean;

  private _fn: Function;
  private _onError: Function;
  private _onFinally: Function;

  private _once: boolean;

  constructor();

  public destructor(): void;

  public subscribe(fn: any, once?: boolean): EventDispatcherObserver<T>;

  public catch(fn: any): EventDispatcherObserver<T>;

  public finally(fn: Function): EventDispatcherObserver<T>;

  public performObservation(ev: T): void;

  public asPromise(ev: T): Promise<void>;

  public getListener(): Function;

  public isSubscribed(): boolean;

  public unsubscribe(): void;

}

declare class EventDispatcher {

  private __listeners_: { [ key: string ]: Map<Function, EventDispatcherObserver<any>> }

  constructor();

  public addEventType(type: string): void;

  public addEventListener<T = any>(type: string, listener: (e: any) => void, once?: boolean): EventDispatcherObserver<T>;

  public hasEventListener(type: string, listener: (e: any) => void): boolean;

  public removeEventListener(type: string, listener: (e: any) => void): void;

  public getEventObservers<T>(type: string): Array<EventDispatcherObserver<T>>;

  public dispatchEvent<T>(type: string, event: T): void;

  public dispatchEventAsAsync<T>(type: string, event: T): Promise<void>;

}

declare class FrameEvent {

  public readonly currentTime: number;
  public readonly deltaTime: number;
  public readonly totalElapsedTime: number;

}

declare class FrameHandler {

  public static pause(): void;
  
  public static unpause(): void;
  
  public static stop(): void;
  
  public static resume(): void;

  private _observer: EventDispatcherObserver<FrameEvent>;

  constructor(listener: (ev: FrameEvent) => void);

  public unsubscribe(): void;

}
