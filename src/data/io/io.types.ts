import { Kind } from '@kinds';

export interface IO<A> {
  (): A;
}

export interface TIO extends Kind.unary {
  return: IO<this['arg0']>;
}
