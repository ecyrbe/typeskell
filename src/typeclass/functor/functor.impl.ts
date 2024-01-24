import { Kind } from '@kinds';
import { Functor } from './functor';
import { apply } from '@utils/functions';

export const mapCompose: (
  FunctorF: Functor<Kind.F>,
  FunctorG: Functor<Kind.G>,
) => Functor.$mapCompose<Kind.F, Kind.G> = (FunctorF, FunctorG) => f => FunctorF.map(FunctorG.map(f));

export const flap: (functor: Functor<Kind.F>) => Functor.$flap<Kind.F> = functor => a => functor.map(apply(a));

export const as: (functor: Functor<Kind.F>) => Functor.$as<Kind.F> = functor => b => functor.map(<A>(_: A) => b);
