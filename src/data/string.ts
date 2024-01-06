import * as groups from '@typeclass/groups';

export const SemiGroupMax: groups.SemiGroup<string> = {
  concat: (a, b) => (a > b ? a : b),
};

export const SemiGroupMin: groups.SemiGroup<string> = {
  concat: (a, b) => (a < b ? a : b),
};

export const MonoidConcat: groups.Monoid<string> = {
  concat: (a, b) => a + b,
  identity: '',
};
