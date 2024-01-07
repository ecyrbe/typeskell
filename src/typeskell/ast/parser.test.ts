import { expect, it, describe } from 'vitest';
import { splitWithParens, parseAST } from './parser';

describe('AST parser', () => {
  it("should split a function string into it's parts", () => {
    expect(splitWithParens('a', '->')).toEqual(['a']);
    expect(splitWithParens('a b', '->')).toEqual(['a b']);
    expect(splitWithParens('a -> b', '->')).toEqual(['a', 'b']);
    expect(splitWithParens('a -> b -> c', '->')).toEqual(['a', 'b', 'c']);
    expect(splitWithParens('a -> b -> (c -> d)', '->')).toEqual(['a', 'b', '(c -> d)']);
    expect(splitWithParens('a   ->   (b -> c)  -> d', '->')).toEqual(['a', '(b -> c)', 'd']);
    expect(splitWithParens('a -> (b -> c) -> (d -> e)', '->')).toEqual(['a', '(b -> c)', '(d -> e)']);
    expect(splitWithParens('a -> (b -> c) -> (d -> (e -> f))', '->')).toEqual(['a', '(b -> c)', '(d -> (e -> f))']);
    expect(splitWithParens('a -> (b -> c) -> (d -> (e -> f)) -> g', '->')).toEqual([
      'a',
      '(b -> c)',
      '(d -> (e -> f))',
      'g',
    ]);
    expect(splitWithParens('(a -> b) -> F (G a ..g) ..f -> F (G b ..g) ..f', '->')).toEqual([
      '(a -> b)',
      'F (G a ..g) ..f',
      'F (G b ..g) ..f',
    ]);
  });

  it('should split type list', () => {
    expect(splitWithParens('a b c', ' ')).toEqual(['a', 'b', 'c']);
    expect(splitWithParens('a (b -> c)', ' ')).toEqual(['a', '(b -> c)']);
    expect(splitWithParens('a (b -> c) d', ' ')).toEqual(['a', '(b -> c)', 'd']);
  });

  it('should generate an AST', () => {
    expect(parseAST('a')).toEqual({ type: 'type', name: 'a' });
    expect(parseAST('a b -> (c -> d)')).toEqual({
      type: 'function',
      args: [
        { type: 'type', name: 'a' },
        { type: 'type', name: 'b' },
      ],
      result: { type: 'function', args: [{ type: 'type', name: 'c' }], result: { type: 'type', name: 'd' } },
    });
    expect(parseAST('a b -> (c d -> e)')).toEqual({
      type: 'function',
      args: [
        { type: 'type', name: 'a' },
        { type: 'type', name: 'b' },
      ],
      result: {
        type: 'function',
        args: [
          { type: 'type', name: 'c' },
          { type: 'type', name: 'd' },
        ],
        result: { type: 'type', name: 'e' },
      },
    });
    expect(parseAST('a b -> c')).toEqual({
      type: 'function',
      args: [
        { type: 'type', name: 'a' },
        { type: 'type', name: 'b' },
      ],
      result: { type: 'type', name: 'c' },
    });
    expect(parseAST('a -> b -> c')).toEqual({
      type: 'chain',
      args: [{ type: 'type', name: 'a' }],
      result: {
        type: 'function',
        args: [{ type: 'type', name: 'b' }],
        result: { type: 'type', name: 'c' },
      },
    });
    expect(parseAST('a (b -> c) -> d')).toEqual({
      type: 'function',
      args: [
        { type: 'type', name: 'a' },
        { type: 'function', args: [{ type: 'type', name: 'b' }], result: { type: 'type', name: 'c' } },
      ],
      result: { type: 'type', name: 'd' },
    });

    expect(parseAST('a -> (a -> b) -> b')).toEqual({
      type: 'chain',
      args: [{ type: 'type', name: 'a' }],
      result: {
        type: 'function',
        args: [{ type: 'function', args: [{ type: 'type', name: 'a' }], result: { type: 'type', name: 'b' } }],
        result: { type: 'type', name: 'b' },
      },
    });
    expect(parseAST('(F a b -> b) -> a -> (c -> d)')).toEqual({
      type: 'chain',
      args: [
        {
          type: 'function',
          args: [
            {
              type: 'typeconstructor',
              name: 'F',
              params: [
                { type: 'type', name: 'a' },
                { type: 'type', name: 'b' },
              ],
            },
          ],
          result: { type: 'type', name: 'b' },
        },
      ],
      result: {
        type: 'function',
        args: [{ type: 'type', name: 'a' }],
        result: { type: 'function', args: [{ type: 'type', name: 'c' }], result: { type: 'type', name: 'd' } },
      },
    });
    expect(parseAST('(F a b -> b) -> a -> c -> d')).toEqual({
      type: 'chain',
      args: [
        {
          type: 'function',
          args: [
            {
              type: 'typeconstructor',
              name: 'F',
              params: [
                { type: 'type', name: 'a' },
                { type: 'type', name: 'b' },
              ],
            },
          ],
          result: { type: 'type', name: 'b' },
        },
      ],
      result: {
        type: 'chain',
        args: [{ type: 'type', name: 'a' }],
        result: { type: 'function', args: [{ type: 'type', name: 'c' }], result: { type: 'type', name: 'd' } },
      },
    });
    expect(parseAST('F (F a) -> F a')).toEqual({
      type: 'function',
      args: [
        {
          type: 'typeconstructor',
          name: 'F',
          params: [
            {
              type: 'typeconstructor',
              name: 'F',
              params: [{ type: 'type', name: 'a' }],
            },
          ],
        },
      ],
      result: {
        type: 'typeconstructor',
        name: 'F',
        params: [{ type: 'type', name: 'a' }],
      },
    });
    expect(parseAST('(a -> b) -> F (G a) -> F (G b)')).toEqual({
      type: 'chain',
      args: [
        {
          type: 'function',
          args: [{ type: 'type', name: 'a' }],
          result: { type: 'type', name: 'b' },
        },
      ],
      result: {
        type: 'function',
        args: [
          {
            type: 'typeconstructor',
            name: 'F',
            params: [
              {
                type: 'typeconstructor',
                name: 'G',
                params: [{ type: 'type', name: 'a' }],
              },
            ],
          },
        ],
        result: {
          type: 'typeconstructor',
          name: 'F',
          params: [
            {
              type: 'typeconstructor',
              name: 'G',
              params: [{ type: 'type', name: 'b' }],
            },
          ],
        },
      },
    });
    expect(parseAST('(a -> F b ..β) -> F a ..α -> F b ..αβ')).toEqual({
      type: 'chain',
      args: [
        {
          type: 'function',
          args: [{ type: 'type', name: 'a' }],
          result: { type: 'typeconstructor', name: 'F', params: [{ type: 'type', name: 'b' }], spread: 'β' },
        },
      ],
      result: {
        type: 'function',
        args: [{ type: 'typeconstructor', name: 'F', params: [{ type: 'type', name: 'a' }], spread: 'α' }],
        result: { type: 'typeconstructor', name: 'F', params: [{ type: 'type', name: 'b' }], spread: 'αβ' },
      },
    });
  });
});
