import { Kind, ContravariantParam, InvariantParam, CovariantParam } from '@kinds';
import * as ARIO from '@data/async-reader-io';
import * as R from '@data/result';

export interface Effect<A, E, Env> extends ARIO.AsyncReaderIO<R.Result<A, E>, Env> {}

export interface TEffect extends Kind<[InvariantParam, CovariantParam, ContravariantParam]> {
  return: Effect<this['arg0'], this['arg1'], this['arg2']>;
}
