import { describe, it, expect } from 'vitest';
import { typeskell } from './parser';

describe('Haskell parser', () => {
  it('should generate a generic function with type params', () => {
    expect(typeskell('a b -> (c -> d)')).toEqual('<A1, A2, A3, A4>(arg0: A1, arg1: A2) => (arg0: A3) => A4');
    expect(typeskell('a -> b -> c')).toEqual('<A1>(arg0: A1) => <B1, B2>(arg0: B1) => B2');
    expect(typeskell('a -> b -> c', {}, { a: 'string' })).toEqual('(arg0: string) => <A1, A2>(arg0: A1) => A2');
    expect(typeskell('a -> b -> c', {}, { a: 'string', b: 'number' })).toEqual(
      '(arg0: string) => <A1>(arg0: number) => A1',
    );
    expect(typeskell('a -> b -> c', {}, { b: 'number' })).toEqual('<A1>(arg0: A1) => <B1>(arg0: number) => B1');
    expect(typeskell('a -> b -> c', {}, { c: 'string' })).toEqual('<A1>(arg0: A1) => <B1>(arg0: B1) => string');
    expect(typeskell('a -> (a -> b) -> b')).toEqual('<A1>(arg0: A1) => <B1>(arg0: (arg0: A1) => B1) => B1');
    expect(typeskell('a -> (a b -> c) -> d')).toEqual(
      '<A1>(arg0: A1) => <B1, B2, B3>(arg0: (arg0: A1, arg1: B1) => B2) => B3',
    );
    expect(typeskell('a -> (a -> b) -> (c -> d)')).toEqual(
      '<A1>(arg0: A1) => <B1, B2, B3>(arg0: (arg0: A1) => B1) => (arg0: B2) => B3',
    );
    expect(typeskell('(F a b -> b) -> a -> (c -> d)')).toEqual(
      '<A1, A2>(arg0: (arg0: F<A1, A2>) => A2) => <B1, B2>(arg0: A1) => (arg0: B1) => B2',
    );
    expect(typeskell('(a -> b) -> F a c -> F b c')).toEqual(
      '<A1, A2>(arg0: (arg0: A1) => A2) => <B1>(arg0: F<A1, B1>) => F<A2, B1>',
    );
    expect(typeskell('F a -> (a -> b) -> F b')).toEqual('<A1>(arg0: F<A1>) => <B1>(arg0: (arg0: A1) => B1) => F<B1>');
    expect(typeskell('F a -> F (a -> b) -> F b')).toEqual(
      '<A1>(arg0: F<A1>) => <B1>(arg0: F<(arg0: A1) => B1>) => F<B1>',
    );
    expect(typeskell('(a -> F b) -> F a -> F b')).toEqual(
      '<A1, A2>(arg0: (arg0: A1) => F<A2>) => (arg0: F<A1>) => F<A2>',
    );
    expect(typeskell('F (F a) -> F a')).toEqual('<A1>(arg0: F<F<A1>>) => F<A1>');
    expect(typeskell('F (F a ..α) ..β  -> F (F a ..α) ..β', { F: 2 })).toEqual(
      '<A1, A2, A3>(arg0: F<F<A1, A2>, A3>) => F<F<A1, A2>, A3>',
    );
    expect(typeskell('(a -> b) -> F (G a) -> F (G b)')).toEqual(
      '<A1, A2>(arg0: (arg0: A1) => A2) => (arg0: F<G<A1>>) => F<G<A2>>',
    );
    expect(typeskell('(a -> b) -> F (G a ..α) ..β -> F (G b ..α) ..β', { F: 2, G: 3 })).toEqual(
      '<A1, A2>(arg0: (arg0: A1) => A2) => <B1, B2, B3>(arg0: F<G<A1, B1, B2>, B3>) => F<G<A2, B1, B2>, B3>',
    );
    expect(typeskell('(a -> F b ..β) -> F a ..α -> F b ..αβ', { F: 3 })).toEqual(
      '<A1, A2, A3, A4>(arg0: (arg0: A1) => F<A2, A3, A4>) => <B1, B2>(arg0: F<A1, B1, B2>) => F<A2, B1 | A3, B2 | A4>',
    );
  });
});
