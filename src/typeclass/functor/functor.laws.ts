import { Kind, $ } from '@kinds';
import { Functor } from './functor';
import { identity } from '@utils/functions';
import { flow } from '../../pipe';
import { TypeSkell } from '@typeskell';

namespace functorLaws {
  export type $identity<F extends Kind> = TypeSkell<'F a ..e -> F a ..e', { F: F }>;
  export type $composition<F extends Kind> = TypeSkell<'(a -> b) (b -> c) -> (F a ..e) -> F c ..e', { F: F }>;
}

const functorLawsImpl: typeof functorLaws<Kind.F> = functor => {
  const { map } = functor;
  return {
    identity: {
      left: map(identity),
      right: identity,
    },
    composition: {
      left: (f, g) => map(flow(f, g)),
      right: (f, g) => flow(map(f), map(g)),
    },
  };
};

export const functorLaws: <F extends Kind>(
  functor: Functor<F>,
) => {
  identity: {
    left: functorLaws.$identity<F>;
    right: functorLaws.$identity<F>;
  };
  composition: {
    left: functorLaws.$composition<F>;
    right: functorLaws.$composition<F>;
  };
} = functorLawsImpl as any;
