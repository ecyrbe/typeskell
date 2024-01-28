import * as groups from '@typeclass/groups';

export const MonoidMax: groups.Monoid<number> = {
  concat: (a, b) => Math.max(a, b),
  identity: -Infinity,
};

export const MonoidMin: groups.Monoid<number> = {
  concat: (a, b) => Math.min(a, b),
  identity: Infinity,
};

export const GroupSum: groups.Group<number> = {
  concat: (a, b) => a + b,
  invert: a => -a,
  identity: 0,
};

export const GroupProduct: groups.Group<number> = {
  concat: (a, b) => a * b,
  invert: a => 1 / a,
  identity: 1,
};
