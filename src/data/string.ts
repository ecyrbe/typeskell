import * as groups from '@typeclass/groups';

export const MonoidMax: groups.Monoid<string> = {
  concat: (a, b) => (a > b ? a : b),
  identity: '',
};

// string is not bounded, so we can't use min as a monoid
// we could create a free monoid, but typing would be a pain
export const SemiGroupMin: groups.SemiGroup<string> = {
  concat: (a, b) => (a < b ? a : b),
};

export const MonoidConcat: groups.Monoid<string> = {
  concat: (a, b) => a + b,
  identity: '',
};
