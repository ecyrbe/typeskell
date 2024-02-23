import { Kind } from '@kinds';
import { SemiAlternative } from '@typeclass/semialternative';
import { Applicative } from '@typeclass/applicative';
import { None } from '@typeclass/none';

export interface Alternative<F extends Kind> extends None<F>, Applicative<F>, SemiAlternative<F> {}
