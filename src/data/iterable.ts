import { Kind } from '@kinds';

export interface TIterable extends Kind.unary {
  return: Iterable<this['arg0']>;
}
