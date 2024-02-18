import { Kind, ContravariantParam, InvariantParam } from '@kinds';
import { Reader } from '@data/reader/reader.types';
import { AsyncIO } from '@data/async-io/async-io.types';

export interface AsyncReaderIO<A, Env> extends Reader<AsyncIO<A>, Env> {}

export interface TAsyncReaderIO extends Kind<[InvariantParam, ContravariantParam]> {
  return: AsyncReaderIO<this['arg0'], this['arg1']>;
}
