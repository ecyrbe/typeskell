import type { Kind } from '@kinds';
import { identity } from '@utils/functions';
import { BiFunctor } from './bifunctor';

export const $mapLeft: (bifunctor: BiFunctor<Kind.F2>) => BiFunctor.$mapLeft<Kind.F2> = bifunctor => f =>
  bifunctor.bimap(f, identity);

export const $mapRight: (bifunctor: BiFunctor<Kind.F2>) => BiFunctor.$mapRight<Kind.F2> = bifunctor => f =>
  bifunctor.bimap(identity, f);

export const $bitap: (bifunctor: BiFunctor<Kind.F2>) => BiFunctor.$bitap<Kind.F2> = bifunctor => (f, g) =>
  bifunctor.bimap(
    left => (f(left), left),
    right => (g(right), right),
  );

export const $tapLeft: (bifunctor: BiFunctor<Kind.F2>) => BiFunctor.$tapLeft<Kind.F2> = bifunctor => f =>
  bifunctor.bimap(left => (f(left), left), identity);

export const $tapRight: (bifunctor: BiFunctor<Kind.F2>) => BiFunctor.$tapRight<Kind.F2> = bifunctor => f =>
  bifunctor.bimap(identity, right => (f(right), right));
