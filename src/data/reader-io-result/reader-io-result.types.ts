import { Kind, ContravariantParam, InvariantParam, CovariantParam } from '@kinds';
import * as RIO from '@data/reader-io';
import * as R from '@data/result';

export interface ReaderIOResult<A, E, Env> extends RIO.ReaderIO<R.Result<A, E>, Env> {}

export interface TReaderIOResult extends Kind<[InvariantParam, CovariantParam, ContravariantParam]> {
  return: ReaderIOResult<this['arg0'], this['arg1'], this['arg2']>;
}
