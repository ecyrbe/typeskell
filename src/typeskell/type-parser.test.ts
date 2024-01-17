import { expectTypeOf, describe, it } from 'vitest';
import { GetNextAlpha, BuildGenericKeys, TypeSkell, BuildSpreadParams, GetKeys } from './type-parser';
import { ParseAST } from './ast/type-parser';
import { Kind, $ } from '@kinds';

describe('Type parser', () => {
  it('should get next alpha', () => {
    expectTypeOf<GetNextAlpha<'A'>>().toEqualTypeOf<'B'>();
    expectTypeOf<GetNextAlpha<'B'>>().toEqualTypeOf<'C'>();
    expectTypeOf<GetNextAlpha<'Z'>>().toEqualTypeOf<'A'>();
  });

  it('should build spread params', () => {
    expectTypeOf<
      BuildSpreadParams<
        'β',
        { type: 'typeconstructor'; name: 'F'; params: [{ type: 'type'; name: 'b' }]; spread: 'β' },
        { F: Kind.F4 }
      >
    >().toEqualTypeOf<['β0', 'β1', 'β2']>();
  });

  it('should get generic type list AST', () => {
    expectTypeOf<
      BuildGenericKeys<ParseAST<'(a -> F b ..β) -> F a ..α -> F b ..αβ'>, { F: Kind.F2 }, []>
    >().toEqualTypeOf<['a', 'b', 'β0']>();

    expectTypeOf<
      BuildGenericKeys<ParseAST<'(a -> F b ..β) -> F a ..α -> F b ..αβ'>['result'], { F: Kind.F2 }, ['a', 'b']>
    >().toEqualTypeOf<['α0']>();

    expectTypeOf<
      BuildGenericKeys<ParseAST<'(a b -> F b ..β) -> F a ..α -> F b ..αβ'>, { F: Kind.F3 }, []>
    >().toEqualTypeOf<['a', 'b', 'β0', 'β1']>();
  });

  it('should parse typeskell', () => {
    expectTypeOf<TypeSkell<'a -> b'>>().toEqualTypeOf<<A1, A2>(args_0: A1) => A2>();
    expectTypeOf<TypeSkell<'(a -> F b ..β) -> F a ..α -> F b ..αβ', { F: Kind.F2 }>>().toEqualTypeOf<
      <A1, A2, A3>(
        args_0: (args_0: A1) => $<Kind.F2, [A2, A3]>,
      ) => <B1>(args_0: $<Kind.F2, [A1, B1]>) => $<Kind.F2, [A2, A3 | B1]>
    >();
    expectTypeOf<TypeSkell<'(a -> F b ..β) -> F a ..α -> F b ..αβ', { F: Kind.F3 }>>().toEqualTypeOf<
      <A1, A2, A3, A4>(
        args_0: (args_0: A1) => $<Kind.F3, [A2, A3, A4]>,
      ) => <B1, B2>(args_0: $<Kind.F3, [A1, B1, B2]>) => $<Kind.F3, [A2, A3 | B1, A4 | B2]>
    >();
    expectTypeOf<TypeSkell<'(a -> F b ..β) -> F a ..α -> F b ..αβ', { F: Kind.F4 }>>().toEqualTypeOf<
      <A1, A2, A3, A4, A5>(
        args_0: (args_0: A1) => $<Kind.F4, [A2, A3, A4, A5]>,
      ) => <B1, B2, B3>(args_0: $<Kind.F4, [A1, B1, B2, B3]>) => $<Kind.F4, [A2, A3 | B1, A4 | B2, A5 & B3]>
    >();
  });
});
