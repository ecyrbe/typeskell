import type { Kind } from '@kinds';
import { identity } from '@utils/functions';
import { BiFunctor } from './bifunctor';

export const mapLeft: (bifunctor: BiFunctor<Kind.F2>) => BiFunctor.$mapLeft<Kind.F2> = bifunctor => f =>
  bifunctor.bimap(f, identity);

export const mapRight: (bifunctor: BiFunctor<Kind.F2>) => BiFunctor.$mapRight<Kind.F2> = bifunctor => f =>
  bifunctor.bimap(identity, f);
