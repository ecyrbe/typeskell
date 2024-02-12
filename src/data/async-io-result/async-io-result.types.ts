import { Kind } from '@kinds';
import { AsyncIO } from '@data/async-io';
import { Result } from '@data/result';

export interface AsyncIOResult<A, E> extends AsyncIO<Result<A, E>> {}

export interface TAsyncIOResult extends Kind.binary {
  return: AsyncIOResult<this['arg0'], this['arg1']>;
}
