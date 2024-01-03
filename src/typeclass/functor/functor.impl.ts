import { HKT } from '@kinds';
import { Functor } from './functor';
import { apply } from '@utils/functions';

export const mapCompose =
  (FunctorF: Functor<HKT.F>, FunctorG: Functor<HKT.G>) =>
  <A, B>(f: (a: A) => B) =>
    FunctorF.map(FunctorG.map(f));

export const flap =
  (functor: Functor<HKT.F>) =>
  <A>(a: A) =>
    functor.map(apply(a));

export const as =
  (functor: Functor<HKT.F>) =>
  <B>(b: B) =>
    functor.map(<A>(_: A) => b);
