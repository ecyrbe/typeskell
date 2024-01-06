import * as groups from '@typeclass/groups';

export const GroupOr: groups.Group<boolean> = {
  concat: (a, b) => a || b,
  invert: a => !a,
  identity: false,
};

export const GroupAnd: groups.Group<boolean> = {
  concat: (a, b) => a && b,
  invert: a => !a,
  identity: true,
};
