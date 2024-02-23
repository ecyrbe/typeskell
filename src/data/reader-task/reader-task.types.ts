import { Kind, ContravariantParam, InvariantParam } from '@kinds';
import { Reader } from '@data/reader/reader.types';
import { Task } from '@data/task/task.types';

export interface ReaderTask<A, Env> extends Reader<Task<A>, Env> {}

export interface TReaderTask extends Kind<[InvariantParam, ContravariantParam]> {
  return: ReaderTask<this['arg0'], this['arg1']>;
}
