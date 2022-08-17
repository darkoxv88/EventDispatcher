import { noop } from "../utility/noop";
import { waiter } from "../utility/waiter";

export class Observer<T> {

  private _isSubscribed: boolean;

  private _fn: Function;
  private _onError: Function;
  private _onFinally: Function;

  private _once: boolean;

  constructor() {
    this._isSubscribed = true;
    this._fn = null;
    this._onError = noop;
    this._onFinally = noop;
  }

  public destructor(): void {
    this._fn = null;
    this._onError = null;
    this._onFinally = null;
  }

  public subscribe(fn: any, once?: boolean): Observer<T> {
    if (typeof(fn) !== 'function' || typeof(this._fn) === 'function') {
      return this;
    }

    this._fn = fn;
    this._once = once ? true : false;

    return this;
  }

  public catch(fn: any): Observer<T> {
    if (typeof(fn) === 'function') {
      this._onError = fn;
    }


    return this;
  }

  public finally(fn: Function): Observer<T> {
    if (typeof(fn) === 'function') {
      this._onFinally = fn;
    }

    return this;
  }

  public performObservation(ev: T): void {
    if (this._once) {
      this.unsubscribe();
    }

    try
    {
      if (typeof(this._fn) === 'function') {
        this._fn(ev);
      }
    }
    catch(err)
    {
      if (typeof(this._onError) === 'function') {
        this._onError(ev);
      }
    }
    finally
    {
      if (typeof(this._onFinally) === 'function') {
        this._onFinally();
      }
    }
  }

  public asPromise(ev: T): Promise<void> {
    if (this._once) {
      this.unsubscribe();
    }
    
    return waiter(this, function* () {
      try
      {
        if (typeof(this._fn) === 'function') {
          yield this._fn(ev);
        }
      }
      catch(err)
      {
        if (typeof(this._onError) === 'function') {
          yield this._onError(ev);
        }
      }
      finally
      {
        if (typeof(this._onFinally) === 'function') {
          yield this._onFinally();
        }
      }
    });
  }

  public getListener(): Function {
    return this._fn;
  }

  public isSubscribed(): boolean {
    return this._isSubscribed;
  }

  public unsubscribe(): void {
    this._isSubscribed = false;
  }

}
