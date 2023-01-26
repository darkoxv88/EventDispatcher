import { noop } from "../utility/noop";
import { waiter } from "../utility/waiter";

function asFunc(fn: any): Function | null {
  if (typeof(fn) !== 'function' || !fn) {
    return null;
  }

  return fn;
}

export class Observer<T> {

  private _listener: Function;
  private _onError: (err: any) => void;
  private _onFinally: Function;

  private _once: boolean;

  constructor(listener: (ev?: T) => void, once?: boolean) {
    this._listener = asFunc(listener);
    this._onError = noop;
    this._onFinally = noop;
    this._once = once ? true : false;
  }

  public destructor(): void {
    this._listener = null;
    this._onError = null;
    this._onFinally = null;
  }

  public catch(fn: (err: any) => void): Observer<T> {
    if (typeof(fn) === 'function') {
      this._onError = fn;
    }

    return this;
  }

  public finally(fn: () => void): Observer<T> {
    if (typeof(fn) === 'function') {
      this._onFinally = fn;
    }

    return this;
  }

  public performObservation(ev: T): void {
    if (this.isSubscribed() == false) {
      return;
    }

    try
    {
      this._listener(ev);
    }
    catch(err)
    {
      if (typeof(this._onError) === 'function') {
        this._onError(err);
      }
    }
    finally
    {
      this._once ? this.unsubscribe() : void 0;

      if (typeof(this._onFinally) === 'function') {
        this._onFinally();
      }
    }
  }

  public performObservationAsAsync(ev: T): Promise<void> {
    if (this.isSubscribed() == false) {
      return waiter(this, function* () { 
        return; 
      });
    }

    return waiter(this, function* () {
      try
      {
        yield this._listener(ev);
      }
      catch(err)
      {
        if (typeof(this._onError) === 'function') {
          yield this._onError(ev);
        }
      }
      finally
      {
        this._once ? this.unsubscribe() : void 0;

        if (typeof(this._onFinally) === 'function') {
          yield this._onFinally();
        }
      }

      return;
    });
  }

  public getListener(): Function {
    return this._listener;
  }

  public isSubscribed(): boolean {
    return this._listener ? true : false;
  }

  public unsubscribe(): void {
    this._listener = null;
  }

}
