import { Kind } from '@kinds';
import { Task } from '@data/task';
import { Result } from '@data/result';

export interface TaskResult<A, E> extends Task<Result<A, E>> {}

export interface TTaskResult extends Kind.binary {
  return: TaskResult<this['arg0'], this['arg1']>;
}
