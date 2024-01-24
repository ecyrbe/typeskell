import { Kind, $ } from '@kinds';

export interface ToParams extends Kind {
  return: this['rawArgs'] extends [infer B, ...infer Args] ? [f: (...args: Args) => B] : never;
}

export interface ToResult<F extends Kind> extends Kind {
  return: this['rawArgs'] extends [infer B, ...infer Args] ? <A>(fa: $<F, [A, ...Args]>) => A | B : never;
}
