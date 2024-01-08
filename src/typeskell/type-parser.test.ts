import { expectTypeOf, describe, it } from 'vitest';
import { GetNextAlpha, GetSpreadParams, MergeSpreadParams } from './type-parser';
import { Kind, InvariantParam, ContravariantParam, CovariantParam } from '@kinds';

describe('Type parser', () => {
  it('should get next alpha', () => {
    expectTypeOf<GetNextAlpha<'A'>>().toEqualTypeOf<'B'>();
    expectTypeOf<GetNextAlpha<'B'>>().toEqualTypeOf<'C'>();
    expectTypeOf<GetNextAlpha<'Z'>>().toEqualTypeOf<'A'>();
  });

  it('should get spread params', () => {
    expectTypeOf<GetSpreadParams<'a', { b: 'B'; a1: 'A1'; a2: 'A2'; a3: 'A3'; c: 'C' }>>().toEqualTypeOf<
      ['A1', 'A2', 'A3']
    >();
  });

  interface FContravariant extends Kind<[InvariantParam, CovariantParam, ContravariantParam]> {
    return: 0;
  }

  it('should merge spread params', () => {
    expectTypeOf<
      MergeSpreadParams<'F', 'a', 'b', { b: 'B'; a1: 'A1'; a2: 'A2'; b1: 'A3'; b2: 'A4' }, { F: Kind.F2 }>
    >().toEqualTypeOf<['A1' | 'A3', 'A2' | 'A4']>();
    expectTypeOf<
      MergeSpreadParams<
        'F',
        'a',
        'b',
        { b: 'B'; a1: 'A1'; a2: 'A2'; a3: { 0: 'A3' }; b1: 'B1'; b2: 'B2'; b3: { 1: 'B3' } },
        { F: FContravariant }
      >
    >().toEqualTypeOf<
      [
        'A1' | 'B1',
        'A2' | 'B2',
        {
          0: 'A3';
        } & {
          1: 'B3';
        },
      ]
    >();
  });
});
