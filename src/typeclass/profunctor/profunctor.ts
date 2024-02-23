import type { Kind } from '@kinds';
import type { Functor } from '@typeclass/functor';
import type { TypeSkell } from '@typeskell';

export namespace ProFunctor {
  export type $promap<F extends Kind> = TypeSkell<'(F a e ..x) (c -> e) (a -> b) -> F b c ..x', { F: F }>;
}

export interface ProFunctor<F extends Kind> extends Functor<F> {
  promap: ProFunctor.$promap<F>;
}
