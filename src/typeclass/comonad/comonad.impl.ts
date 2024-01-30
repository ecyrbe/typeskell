import { Kind } from '@kinds';
import { identity } from '@utils/functions';
import { CoMonad } from './comonad';

export const duplicate: (coMonad: CoMonad<Kind.F>) => CoMonad.$duplicate<Kind.F> = coMonad => coMonad.extend(identity);
