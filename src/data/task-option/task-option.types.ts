import { Kind } from '@kinds';
import { Task } from '@data/task';
import { Option } from '@data/option';

export interface TaskOption<A> extends Task<Option<A>> {}

export interface TTaskOption extends Kind.unary {
  return: TaskOption<this['arg0']>;
}
