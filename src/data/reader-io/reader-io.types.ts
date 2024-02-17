import { Kind, ContravariantParam, InvariantParam } from '@kinds';
import { Reader } from '@data/reader/reader.types';
import { IO } from '@data/io/io.types';

export interface ReaderIO<A, Env> extends Reader<IO<A>, Env> {}

export interface TReaderIO extends Kind<[InvariantParam, ContravariantParam]> {
  return: ReaderIO<this['arg0'], this['arg1']>;
}
