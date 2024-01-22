import { Kind, $ } from '@kinds';
import { Monad } from './monad';
import { identity } from '@utils/functions';
import { pipe } from '../../pipe';

export const flatten =
  (m: Monad<Kind.F2>) =>
  <A, E1, E2>(mma: $<Kind.F2, [$<Kind.F2, [A, E1]>, E2]>) =>
    pipe(mma, m.flatMap(identity));
