import * as groups from '@typeclass/groups';

const SemiGroupMax: groups.SemiGroup<number> = {
  concat: (a, b) => Math.max(a, b),
};

const SemiGroupMin: groups.SemiGroup<number> = {
  concat: (a, b) => Math.min(a, b),
};

const GroupSum: groups.Group<number> = {
  concat: (a, b) => a + b,
  invert: a => -a,
  identity: 0,
};

const GroupProduct: groups.Group<number> = {
  concat: (a, b) => a * b,
  invert: a => 1 / a,
  identity: 1,
};
