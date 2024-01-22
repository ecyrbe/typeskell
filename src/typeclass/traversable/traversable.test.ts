import type { Expect, Equal } from 'type-testing';
import type { Kind } from '@kinds';
import { sequence } from './traversable';
import { sequence as sequenceImpl } from './traversable.impl';
import { describe, it } from 'vitest';

describe('Traversable', () => {
  it('generic and impl should have same type signature', () => {
    let testSequence: ReturnType<typeof sequence<Kind.F>>;
    type TestCases = [Expect<Equal<typeof testSequence<Kind.H>, ReturnType<typeof sequenceImpl>>>];
  });
});
