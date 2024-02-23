import { Kind, ContravariantParam, InvariantParam } from '@kinds';
import { ReaderTask } from '@data/reader-task/reader-task.types';
import { Option } from '@data/option/option.types';

export interface ReaderTaskOption<A, Env> extends ReaderTask<Option<A>, Env> {}

export interface TReaderTaskOption extends Kind<[InvariantParam, ContravariantParam]> {
  return: ReaderTaskOption<this['arg0'], this['arg1']>;
}
