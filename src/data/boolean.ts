import * as groups from '@typeclass/groups';

const GroupOr: groups.Group<boolean> = {
  concat: (a, b) => a || b,
  invert: a => !a,
  identity: false,
};

const GroupAnd: groups.Group<boolean> = {
  concat: (a, b) => a && b,
  invert: a => !a,
  identity: true,
};
