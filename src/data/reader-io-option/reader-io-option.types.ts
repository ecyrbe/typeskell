import { Kind, ContravariantParam, InvariantParam } from '@kinds';
import { ReaderIO } from '@data/reader-io/reader-io.types';
import { Option } from '@data/option/option.types';

export interface ReaderIOOption<A, Env> extends ReaderIO<Option<A>, Env> {}

export interface TReaderIOOption extends Kind<[InvariantParam, ContravariantParam]> {
  return: ReaderIOOption<this['arg0'], this['arg1']>;
}
