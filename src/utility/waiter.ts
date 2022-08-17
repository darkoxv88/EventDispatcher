import { getRoot } from "../refs/root";

let _isES6 = false;

try
{
  if (!Promise) {
    throw null;
  }

  getRoot().eval(
    'function* f(x = true) {yield x;} function n() {} function e(p = n) {p();} class A {get a(){return this._a;(new Promise((res) => res(null)));};constructor() {this._a=true}} class B extends A { constructor(){super();if(this.a)this.b();}b() {e((k = 5) => {this._b = f().next().value;});}}; new B();'
  );

  _isES6 = true;
}
catch(err)
{
  _isES6 = false;

  throw new Error('This library requires browser with ES6 support!');
}

function isES6() {
  return _isES6;
}

function createEmptyPromise(): Promise<null> {
  return new Promise((res) => { res(null) });
}

var lWaiter = function (thisArg: Object | null, _arguments: any[], P: typeof Promise, generator: any): Promise<any> {
  function adopt(value: any) { 
    return value instanceof P ? value : new P(function(resolve: Function) { 
      resolve(value); 
    }); 
  }

  return new P(function(resolve: Function, reject: Function) {
    function fulfilled(value: any) { 
      try 
      { 
        step(generator.next(value)); 
      } 
      catch (e) 
      { 
        reject(e); 
      } 
    }

    function rejected(value: any) { 
      try 
      { 
        step(generator["throw"](value)); 
      } 
      catch (e) 
      { 
        reject(e); 
      } 
    }

    function step(result: any) { 
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); 
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

export function waiter(thisArg: Object | null, generator: Function): Promise<any> {
  try
  {
    if (isES6() === false) {
      return createEmptyPromise();
    }

    if (generator.constructor.name !== 'GeneratorFunction') {
      return createEmptyPromise();
    }

    thisArg = (typeof(thisArg) === 'object') ? thisArg : null;
    
    return lWaiter(thisArg, undefined, Promise, generator);
  }
  catch(err)
  {
    return;
  }
}
