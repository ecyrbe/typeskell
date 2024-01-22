import { Kind, $ } from '@kinds';
import { identity } from '@utils/functions';
import { pipe } from '../../pipe';
import { CoMonad } from './comonad';

export const duplicate =
  (coMonad: CoMonad<Kind.F>) =>
  <A>(fa: $<Kind.F, [A]>) =>
    pipe(fa, coMonad.extend(identity));
