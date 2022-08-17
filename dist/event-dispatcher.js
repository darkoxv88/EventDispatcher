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
	window.Observer;
    window.EventDispatcher;
	window.FrameHandler;

**/

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/refs/root.ts
var root = typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : ({});
function getRoot() {
    return root;
}

;// CONCATENATED MODULE: ./src/utility/wait.ts
function wait(duration) {
    duration = (typeof (duration) === 'number') ? duration : 0;
    duration = (duration >= 0) ? duration : 0;
    return new Promise((res) => {
        setTimeout(() => {
            res();
        }, duration);
    });
}

;// CONCATENATED MODULE: ./src/utility/waiter.ts

let _isES6 = false;
try {
    if (!Promise) {
        throw null;
    }
    getRoot().eval('function* f(x = true) {yield x;} function n() {} function e(p = n) {p();} class A {get a(){return this._a;(new Promise((res) => res(null)));};constructor() {this._a=true}} class B extends A { constructor(){super();if(this.a)this.b();}b() {e((k = 5) => {this._b = f().next().value;});}}; new B();');
    _isES6 = true;
}
catch (err) {
    _isES6 = false;
    throw new Error('This library requires browser with ES6 support!');
}
function isES6() {
    return _isES6;
}
function createEmptyPromise() {
    return new Promise((res) => { res(null); });
}
var lWaiter = function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new P(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function waiter(thisArg, generator) {
    try {
        if (isES6() === false) {
            return createEmptyPromise();
        }
        if (generator.constructor.name !== 'GeneratorFunction') {
            return createEmptyPromise();
        }
        thisArg = (typeof (thisArg) === 'object') ? thisArg : null;
        return lWaiter(thisArg, undefined, Promise, generator);
    }
    catch (err) {
        return;
    }
}

;// CONCATENATED MODULE: ./src/utility/noop.ts
function noop() { }

;// CONCATENATED MODULE: ./src/event-dispatcher/observer.ts


class Observer {
    constructor() {
        this._isSubscribed = true;
        this._fn = null;
        this._onError = noop;
        this._onFinally = noop;
    }
    destructor() {
        this._fn = null;
        this._onError = null;
        this._onFinally = null;
    }
    subscribe(fn, once) {
        if (typeof (fn) !== 'function' || typeof (this._fn) === 'function') {
            return this;
        }
        this._fn = fn;
        this._once = once ? true : false;
        return this;
    }
    catch(fn) {
        if (typeof (fn) === 'function') {
            this._onError = fn;
        }
        return this;
    }
    finally(fn) {
        if (typeof (fn) === 'function') {
            this._onFinally = fn;
        }
        return this;
    }
    performObservation(ev) {
        if (this._once) {
            this.unsubscribe();
        }
        try {
            if (typeof (this._fn) === 'function') {
                this._fn(ev);
            }
        }
        catch (err) {
            if (typeof (this._onError) === 'function') {
                this._onError(ev);
            }
        }
        finally {
            if (typeof (this._onFinally) === 'function') {
                this._onFinally();
            }
        }
    }
    asPromise(ev) {
        if (this._once) {
            this.unsubscribe();
        }
        return waiter(this, function* () {
            try {
                if (typeof (this._fn) === 'function') {
                    yield this._fn(ev);
                }
            }
            catch (err) {
                if (typeof (this._onError) === 'function') {
                    yield this._onError(ev);
                }
            }
            finally {
                if (typeof (this._onFinally) === 'function') {
                    yield this._onFinally();
                }
            }
        });
    }
    getListener() {
        return this._fn;
    }
    isSubscribed() {
        return this._isSubscribed;
    }
    unsubscribe() {
        this._isSubscribed = false;
    }
}

;// CONCATENATED MODULE: ./src/event-dispatcher/event-dispatcher.ts


function performanceViolationCheck(handler, time) {
    if (time > 50) {
        console.warn(`[Violation] '${handler}' handler took ${time.toFixed(0)}ms to execute.`);
    }
}
class EventDispatcher {
    constructor() {
        this.__listeners_ = ({});
    }
    addEventType(type) {
        if (this.__listeners_[type] === undefined) {
            this.__listeners_[type] = new Map();
        }
    }
    addEventListener(type, listener, once) {
        this.addEventType(type);
        if (this.__listeners_[type].get(listener) instanceof Observer) {
            return this.__listeners_[type].get(listener).subscribe(listener);
        }
        this.__listeners_[type].set(listener, new Observer());
        return this.__listeners_[type].get(listener).subscribe(listener, once);
    }
    hasEventListener(type, listener) {
        try {
            return this.__listeners_[type].get(listener) ? true : false;
        }
        catch (err) {
            return false;
        }
    }
    removeEventListener(type, listener) {
        try {
            if (this.hasEventListener(type, listener)) {
                this.__listeners_[type].get(listener).destructor();
                this.__listeners_[type].delete(listener);
            }
        }
        catch (err) {
            return;
        }
    }
    getEventObservers(type) {
        if (this.__listeners_[type] === undefined) {
            this.__listeners_[type] = new Map();
        }
        return Array.from(this.__listeners_[type].values());
    }
    dispatchEvent(type, event) {
        if (typeof (type) !== 'string') {
            return;
        }
        const procs = this.__listeners_[type];
        if (!procs) {
            return;
        }
        for (const proc of procs) {
            const target = proc[0];
            const observer = proc[1];
            if (target !== observer.getListener()) {
                observer.unsubscribe();
            }
            if (observer.isSubscribed() === false) {
                observer.destructor();
                procs.delete(target);
                continue;
            }
            try {
                const start = performance.now();
                observer.performObservation(event);
                const end = performance.now();
                performanceViolationCheck(type, end - start);
            }
            catch (err) {
                continue;
            }
        }
    }
    dispatchEventAsAsync(type, event) {
        return waiter(this, function* () {
            if (typeof (type) !== 'string') {
                return;
            }
            const procs = this.__listeners_[type];
            if (!procs) {
                return;
            }
            for (const proc of procs) {
                const target = proc[0];
                const observer = proc[1];
                if (target !== observer.getListener()) {
                    observer.unsubscribe();
                }
                if (observer.isSubscribed() === false) {
                    observer.destructor();
                    procs.delete(target);
                    continue;
                }
                try {
                    const start = performance.now();
                    yield observer.asPromise(event);
                    const end = performance.now();
                    performanceViolationCheck(type, end - start);
                }
                catch (err) {
                    continue;
                }
            }
            return;
        });
    }
}

;// CONCATENATED MODULE: ./src/utility/log-error.ts
function logError(err) {
    console.error(err);
}

;// CONCATENATED MODULE: ./src/core/frame-handler.ts


class FrameEvent {
    constructor(currentTime, deltaTime, totalElapsedTime) {
        this.currentTime = currentTime;
        this.deltaTime = deltaTime;
        this.totalElapsedTime = totalElapsedTime;
    }
}
let isStopped = false;
let isPaused = false;
let startingTime = 0;
let lastTime = 0;
let totalElapsedTime = 0;
let elapsedSinceLastLoop = 0;
const events = new EventDispatcher();
events.addEventListener('onframe', () => {
    requestAnimationFrame(render);
});
function render(currentTime) {
    if (isStopped) {
        requestAnimationFrame(render);
        return;
    }
    totalElapsedTime = currentTime - startingTime;
    elapsedSinceLastLoop = currentTime - lastTime;
    lastTime = currentTime;
    events.dispatchEventAsAsync('onframe', new FrameEvent(currentTime, (isPaused ? 0 : elapsedSinceLastLoop), totalElapsedTime));
}
requestAnimationFrame((currentTime) => {
    isStopped = false;
    isPaused = false;
    startingTime = currentTime;
    lastTime = currentTime;
    totalElapsedTime = 0;
    elapsedSinceLastLoop = 0;
    requestAnimationFrame(render);
});
class FrameHandler {
    constructor(listener) {
        this._observer = events.addEventListener('onframe', listener);
        this._observer.catch(logError);
    }
    static pause() {
        isPaused = true;
    }
    static unpause() {
        isPaused = false;
    }
    static stop() {
        isStopped = true;
    }
    static resume() {
        isStopped = false;
    }
    unsubscribe() {
        this._observer.unsubscribe();
    }
}

;// CONCATENATED MODULE: ./src/api.ts
function toGlobal(root) {
    root['wait'] = wait;
    root['waiter'] = waiter;
    root['Observer'] = Observer;
    root['EventDispatcher'] = EventDispatcher;
    root['FrameHandler'] = FrameHandler;
}
const Api = toGlobal;

;// CONCATENATED MODULE: ./src/index.js
try
{
	Api(getRoot());
}
catch(err)
{
  console.error(err);
}

/******/ })()
;