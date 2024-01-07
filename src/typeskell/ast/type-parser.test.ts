import { describe, it, expectTypeOf } from 'vitest';
import type { TrimParens, Trim, SplitFnWithParens, SplitParamWithParens } from './type-parser';

describe('Type parser', () => {
  it('should trim parens', () => {
    expectTypeOf<TrimParens<'a'>>().toEqualTypeOf<'a'>();
    expectTypeOf<TrimParens<'(a)'>>().toEqualTypeOf<'a'>();
    expectTypeOf<TrimParens<'(a -> b)'>>().toEqualTypeOf<'a -> b'>();
  });

  it('should trim spaces', () => {
    expectTypeOf<Trim<'a'>>().toEqualTypeOf<'a'>();
    expectTypeOf<Trim<' a'>>().toEqualTypeOf<'a'>();
    expectTypeOf<Trim<'a '>>().toEqualTypeOf<'a'>();
    expectTypeOf<Trim<' a '>>().toEqualTypeOf<'a'>();
    expectTypeOf<Trim<'   a b '>>().toEqualTypeOf<'a b'>();
  });

  it('should split a function', () => {
    expectTypeOf<SplitFnWithParens<'a'>>().toEqualTypeOf<['a']>();
    expectTypeOf<SplitFnWithParens<'a b'>>().toEqualTypeOf<['a b']>();
    expectTypeOf<SplitFnWithParens<'a -> b'>>().toEqualTypeOf<['a', 'b']>();
    expectTypeOf<SplitFnWithParens<'a -> b -> c'>>().toEqualTypeOf<['a', 'b', 'c']>();
    expectTypeOf<SplitFnWithParens<'a -> b -> (c -> d)'>>().toEqualTypeOf<['a', 'b', '(c -> d)']>();
    expectTypeOf<SplitFnWithParens<'a   ->   (b -> c)  -> d'>>().toEqualTypeOf<['a', '(b -> c)', 'd']>();
    expectTypeOf<SplitFnWithParens<'a -> (b -> c) -> (d -> e)'>>().toEqualTypeOf<['a', '(b -> c)', '(d -> e)']>();
    expectTypeOf<SplitFnWithParens<'a -> (b -> c) -> (d -> (e -> f))'>>().toEqualTypeOf<
      ['a', '(b -> c)', '(d -> (e -> f))']
    >();
    expectTypeOf<SplitFnWithParens<'a -> (b -> c) -> (d -> (e -> f)) -> g'>>().toEqualTypeOf<
      ['a', '(b -> c)', '(d -> (e -> f))', 'g']
    >();
    expectTypeOf<SplitFnWithParens<'(a -> b) -> F (G a ..g) ..f -> F (G b ..g) ..f'>>().toEqualTypeOf<
      ['(a -> b)', 'F (G a ..g) ..f', 'F (G b ..g) ..f']
    >();
  });

  it('should split type list', () => {
    expectTypeOf<SplitParamWithParens<'a b c'>>().toEqualTypeOf<['a', 'b', 'c']>();
    expectTypeOf<SplitParamWithParens<'a (b -> c)'>>().toEqualTypeOf<['a', '(b -> c)']>();
    expectTypeOf<SplitParamWithParens<'a (b -> c) d'>>().toEqualTypeOf<['a', '(b -> c)', 'd']>();
  });
});
