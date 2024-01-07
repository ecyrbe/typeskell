import { describe, it, expectTypeOf } from 'vitest';
import type { TrimParens, Trim, SplitFnWithParens, SplitParamWithParens, ParseAST } from './type-parser';
import { Expect, Equal } from 'type-testing';

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

  it('should parse AST', () => {
    expectTypeOf<ParseAST<'a'>>().toEqualTypeOf<{ type: 'type'; name: 'a' }>();
    expectTypeOf<ParseAST<'a b -> (c -> d)'>>().toEqualTypeOf<{
      type: 'function';
      args: [{ type: 'type'; name: 'a' }, { type: 'type'; name: 'b' }];
      result: { type: 'function'; args: [{ type: 'type'; name: 'c' }]; result: { type: 'type'; name: 'd' } };
    }>();
    expectTypeOf<ParseAST<'a b -> (c d -> e)'>>().toEqualTypeOf<{
      type: 'function';
      args: [{ type: 'type'; name: 'a' }, { type: 'type'; name: 'b' }];
      result: {
        type: 'function';
        args: [{ type: 'type'; name: 'c' }, { type: 'type'; name: 'd' }];
        result: { type: 'type'; name: 'e' };
      };
    }>();
    expectTypeOf<ParseAST<'a b -> c'>>().toEqualTypeOf<{
      type: 'function';
      args: [{ type: 'type'; name: 'a' }, { type: 'type'; name: 'b' }];
      result: { type: 'type'; name: 'c' };
    }>();
    expectTypeOf<ParseAST<'a b -> c'>>().toEqualTypeOf<{
      type: 'function';
      args: [{ type: 'type'; name: 'a' }, { type: 'type'; name: 'b' }];
      result: { type: 'type'; name: 'c' };
    }>();
    expectTypeOf<ParseAST<'(F a b -> b) -> a -> (c -> d)'>>().toEqualTypeOf<{
      type: 'chain';
      args: [
        {
          type: 'function';
          args: [
            {
              type: 'typeconstructor';
              name: 'F';
              params: [{ type: 'type'; name: 'a' }, { type: 'type'; name: 'b' }];
            },
          ];
          result: { type: 'type'; name: 'b' };
        },
      ];
      result: {
        type: 'function';
        args: [{ type: 'type'; name: 'a' }];
        result: { type: 'function'; args: [{ type: 'type'; name: 'c' }]; result: { type: 'type'; name: 'd' } };
      };
    }>();
    expectTypeOf<ParseAST<'(F a b -> b) -> a -> c -> d'>>().toEqualTypeOf<{
      type: 'chain';
      args: [
        {
          type: 'function';
          args: [
            {
              type: 'typeconstructor';
              name: 'F';
              params: [{ type: 'type'; name: 'a' }, { type: 'type'; name: 'b' }];
            },
          ];
          result: { type: 'type'; name: 'b' };
        },
      ];
      result: {
        type: 'chain';
        args: [{ type: 'type'; name: 'a' }];
        result: { type: 'function'; args: [{ type: 'type'; name: 'c' }]; result: { type: 'type'; name: 'd' } };
      };
    }>();
    expectTypeOf<ParseAST<'F (F a) -> F a'>>().toEqualTypeOf<{
      type: 'function';
      args: [
        {
          type: 'typeconstructor';
          name: 'F';
          params: [
            {
              type: 'typeconstructor';
              name: 'F';
              params: [{ type: 'type'; name: 'a' }];
            },
          ];
        },
      ];
      result: {
        type: 'typeconstructor';
        name: 'F';
        params: [{ type: 'type'; name: 'a' }];
      };
    }>();
    expectTypeOf<ParseAST<'(a -> b) -> F (G a) -> F (G b)'>>().toEqualTypeOf<{
      type: 'chain';
      args: [
        {
          type: 'function';
          args: [{ type: 'type'; name: 'a' }];
          result: { type: 'type'; name: 'b' };
        },
      ];
      result: {
        type: 'function';
        args: [
          {
            type: 'typeconstructor';
            name: 'F';
            params: [
              {
                type: 'typeconstructor';
                name: 'G';
                params: [{ type: 'type'; name: 'a' }];
              },
            ];
          },
        ];
        result: {
          type: 'typeconstructor';
          name: 'F';
          params: [
            {
              type: 'typeconstructor';
              name: 'G';
              params: [{ type: 'type'; name: 'b' }];
            },
          ];
        };
      };
    }>();
    expectTypeOf<ParseAST<'(a -> F b ..β) -> F a ..α -> F b ..αβ'>>().toEqualTypeOf<{
      type: 'chain';
      args: [
        {
          type: 'function';
          args: [{ type: 'type'; name: 'a' }];
          result: { type: 'typeconstructor'; name: 'F'; params: [{ type: 'type'; name: 'b' }]; spread: 'β' };
        },
      ];
      result: {
        type: 'function';
        args: [{ type: 'typeconstructor'; name: 'F'; params: [{ type: 'type'; name: 'a' }]; spread: 'α' }];
        result: { type: 'typeconstructor'; name: 'F'; params: [{ type: 'type'; name: 'b' }]; spread: 'αβ' };
      };
    }>();
  });
});
