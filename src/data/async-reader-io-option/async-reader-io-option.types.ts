import { Kind, ContravariantParam, InvariantParam } from '@kinds';
import { AsyncReaderIO } from '@data/async-reader-io/async-reader-io.types';
import { Option } from '@data/option/option.types';

export interface AsyncReaderIOOption<A, Env> extends AsyncReaderIO<Option<A>, Env> {}

export interface TAsyncReaderIOOption extends Kind<[InvariantParam, ContravariantParam]> {
  return: AsyncReaderIOOption<this['arg0'], this['arg1']>;
}
