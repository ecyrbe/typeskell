import { Kind } from '@kinds';

export interface TPair extends Kind.binary {
  return: [this['arg0'], this['arg1']];
}

export const pair = <A, B>(a: A, b: B): [A, B] => [a, b];
