import type { Kind, $ } from '@kinds';
import type { BiFlapMap } from './biflatmap';

export const orElse: (
  biflatmap: BiFlapMap<Kind.F2>,
) => <A, E1, E2>(f: (e: E1) => $<Kind.F2, [A, E2]>) => (args_0: $<Kind.F2, [A, E1]>) => $<Kind.F2, [A, E2]> =
  biflatmap => f =>
    biflatmap.biFlapMap(biflatmap.of, f);
