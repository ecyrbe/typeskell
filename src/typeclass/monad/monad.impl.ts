import { Kind } from '@kinds';
import { Monad } from './monad';
import { identity } from '@utils/functions';
import { pipe } from '@utils/pipe';

export const $flatten: (m: Monad<Kind.F>) => Monad.$flatten<Kind.F> = m => m.flatMap(identity);

export const $bind: (m: Monad<Kind.F>) => Monad.$bind<Kind.F> = monad => (name, f) => fa =>
  pipe(
    fa,
    monad.flatMap(a =>
      pipe(
        f(a),
        monad.map(b => ({ ...a, [name]: b }) as any),
      ),
    ),
  );
