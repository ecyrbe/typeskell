import { Kind } from '@kinds';

export interface Async<A> extends Promise<A> {}

export interface TAsync extends Kind.unary {
  return: Async<this['arg0']>;
}
