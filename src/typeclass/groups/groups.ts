import { Kind, $ } from '@kinds';
import { None } from '@typeclass/none';

/**
 * A Magma is a set `A` with a binary operation `concat` that is closed on `A`.
 *
 * Laws:
 * - Closure: if a, b ∈ A, then a.b ∈ A
 */
export interface Magma<A> {
  concat: (a: A, b: A) => A;
}

/**
 * A SemiGroup is a Magma with associativity.
 *
 * Laws:
 * - Associativity: `(a.b).c = a.(b.c)`
 */
export interface SemiGroup<A> extends Magma<A> {}

export interface FreeSemiGroup<A, Identity = undefined> extends SemiGroup<A | Identity> {}

export namespace SemiGroup {
  export const checkLaws =
    <A>(G: SemiGroup<A>) =>
    (a: A, b: A, c: A) => {
      const left = G.concat(G.concat(a, b), c);
      const right = G.concat(a, G.concat(b, c));
      return left === right;
    };
}

export interface SemiGroupKind<F extends Kind> {
  semigroup: <A>() => SemiGroup<$<F, [A]>>;
}

/**
 * Commutative SemiGroup is a SemiGroup with commutativity.
 *
 * Laws:
 * - Commutativity: `a.b = b.a`
 */
export interface CommutativeSemiGroup<A> extends SemiGroup<A> {}
export namespace CommutativeSemiGroup {
  export const checkLaws =
    <A>(G: CommutativeSemiGroup<A>) =>
    (a: A, b: A) => {
      const left = G.concat(a, b);
      const right = G.concat(b, a);
      return left === right;
    };
}

/**
 * A Monoid is a SemiGroup with an identity element.
 *
 * Laws:
 * - Identity: if e is the identity element, then `a.e = e.a = a`
 */
export interface Monoid<A> extends SemiGroup<A> {
  identity: A;
}

export interface FreeMonoid<A, Identity = undefined> extends FreeSemiGroup<A, Identity> {
  identity: Identity;
}
export namespace Monoid {
  export const checkLaws =
    <A>(G: Monoid<A>) =>
    (a: A) => {
      const left = G.concat(a, G.identity);
      const right = G.concat(G.identity, a);
      return left === right && left === a;
    };
}

export interface MonoidKind<F extends Kind> extends None<F> {
  monoid: <A>() => Monoid<$<F, [A]>>;
}

/**
 * A Group is a Monoid with invertibility.
 *
 * Laws:
 * - Invertibility: given a, b ∈ A and if b is ther invert of a then `a.b = b.a = e`
 */
export interface Group<A> extends Monoid<A> {
  invert: (a: A) => A;
}
export namespace Group {
  export const checkLaws =
    <A>(G: Group<A>) =>
    (a: A) => {
      const left = G.concat(a, G.invert(a));
      const right = G.concat(G.invert(a), a);
      return left === right && left === G.identity;
    };
}

export interface GroupKind<F extends Kind> extends MonoidKind<F> {
  group: <A>() => Group<$<F, [A]>>;
}
