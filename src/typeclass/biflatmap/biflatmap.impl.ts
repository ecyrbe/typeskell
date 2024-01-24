import type { Kind, $ } from '@kinds';
import type { BiFlapMap } from './biflatmap';

export const orElse: (biflatmap: BiFlapMap<Kind.F2>) => BiFlapMap.$orElse<Kind.F2> = biflatmap => f =>
  biflatmap.biFlapMap(biflatmap.of, f);
