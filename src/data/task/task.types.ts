import { Kind } from '@kinds';
import { IO } from '@data/io/io.types';
import { Async } from '@data/async/async.types';

export interface Task<A> extends IO<Async<A>> {}

export interface TTask extends Kind.unary {
  return: Task<this['arg0']>;
}
