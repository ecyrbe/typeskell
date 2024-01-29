import { Kind } from '@kinds';
import { SemiAlternative } from '@typeclass/semialternative';
import { Applicative } from '@typeclass/applicative';
import { Zero } from '@typeclass/zero';

export interface Alternative<F extends Kind> extends Zero<F>, Applicative<F>, SemiAlternative<F> {}
