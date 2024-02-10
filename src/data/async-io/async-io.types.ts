import { Kind } from '@kinds';
import { IO } from '@data/io/io.types';
import { Async } from '@data/async/async.types';

export interface AsyncIO<A> extends IO<Async<A>> {}

export interface TAsyncIO extends Kind.unary {
  return: AsyncIO<this['arg0']>;
}
