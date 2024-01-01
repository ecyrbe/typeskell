import { Kind, $ } from '@kinds';
import { Functor } from './functor';
import { apply } from '@utils/functions';

export const mapCompose =
  (FunctorF: Functor<Kind.F>, FunctorG: Functor<Kind.G>) =>
  <A, B>(f: (a: A) => B) =>
    FunctorF.map(FunctorG.map(f));

export const flap =
  (functor: Functor<Kind.F>) =>
  <A>(a: A) =>
    functor.map(apply(a));

export const as =
  (functor: Functor<Kind.F>) =>
  <B>(b: B): (<A>(fa: $<Kind.F, [A]>) => $<Kind.F, [B]>) =>
    functor.map(() => b);
