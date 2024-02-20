import { Kind } from '@kinds';

export type ArrayFull<A> = [A, ...A[]];

export interface TArrayFull extends Kind.unary {
  return: ArrayFull<this['arg0']>;
}
