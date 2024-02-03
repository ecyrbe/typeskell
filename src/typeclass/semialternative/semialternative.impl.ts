import { Kind } from '@kinds';
import { SemiAlternative } from './semialternative';

export const $or =
  (semiAlternative: SemiAlternative<Kind.F>): SemiAlternative.$or<Kind.F> =>
  a =>
    semiAlternative.orElse(() => a);
