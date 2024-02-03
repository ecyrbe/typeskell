import { Kind } from '@kinds';
import { Async } from '@data/async/async.types';
import { Result } from '@data/result/result.types';

export interface AsyncResult<A, E> extends Async<Result<A, E>> {}

export interface TAsyncResult extends Kind.binary {
  return: AsyncResult<this['arg0'], this['arg1']>;
}
