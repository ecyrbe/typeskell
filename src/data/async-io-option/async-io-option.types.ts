import { Kind } from '@kinds';
import { AsyncIO } from '@data/async-io';
import { Option } from '@data/option';

export interface AsyncIOOption<A> extends AsyncIO<Option<A>> {}

export interface TAsyncIOOption extends Kind {
  return: AsyncIOOption<this['arg0']>;
}
