import * as groups from '@typeclass/groups';

export const MonoidMax: groups.Monoid<string> = {
  concat: (a, b) => (a > b ? a : b),
  identity: '',
};

export const SemiGroupMin: groups.SemiGroup<string> = {
  concat: (a, b) => (a < b ? a : b),
};

/**
 * MonoidMin is a Monoid with the identity element representing an `infinite string`
 * But since we can't represent an infinite string we use the empty string as the identity element
 * This has the side effect that empty string will not be the smallest string
 * It's usually ok since we usually don't compute the smallest string with empty strings
 */
export const MonoidMinNonEmpty: groups.FreeMonoid<string, ''> = {
  concat: (a, b) => (a === '' ? b : b === '' ? a : a < b ? a : b),
  identity: '',
};

export const MonoidConcat: groups.Monoid<string> = {
  concat: (a, b) => a + b,
  identity: '',
};
