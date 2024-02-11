import { Kind } from '@kinds';
import { Async } from '@data/async/async.types';
import { Option } from '@data/option/option.types';

export interface AsyncOption<A> extends Async<Option<A>> {}

export interface TAsyncOption extends Kind.unary {
  return: AsyncOption<this['arg0']>;
}
