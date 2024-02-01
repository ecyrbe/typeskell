import type { Kind, $ } from '@kinds';
import type { BiFlatMap } from './biflatmap';

export const orElse: (biflatmap: BiFlatMap<Kind.F2>) => BiFlatMap.$orElse<Kind.F2> = biflatmap => f =>
  biflatmap.biFlatMap(biflatmap.of, f);
