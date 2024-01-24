import { Kind } from '@kinds';
import { Monad } from './monad';
import { identity } from '@utils/functions';
import { pipe } from '../../pipe';

export const flatten: (m: Monad<Kind.F>) => Monad.$flatten<Kind.F> = m => m.flatMap(identity);
