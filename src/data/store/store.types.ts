import { Kind } from '@kinds';

export interface Store<A, S> {
  readonly peek: (s: S) => A;
  readonly pos: S;
}

export interface TStore extends Kind.binary {
  return: Store<this['arg0'], this['arg1']>;
}
