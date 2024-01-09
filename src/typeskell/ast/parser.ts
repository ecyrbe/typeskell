import { TypeskellAST, LowercaseChars, UppercaseChars, GreekChars } from './types';

function trimParens(input: string): string {
  if (input[0] !== '(' || input[input.length - 1] !== ')') return input;
  return input.slice(1, -1).trim();
}

export function splitWithParens(input: string, split: string): string[] {
  let parentheses = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '(') parentheses++;
    else if (input[i] === ')') parentheses--;
    else if (parentheses === 0 && input.slice(i, i + split.length) === split) {
      return [input.slice(0, i).trim(), ...splitWithParens(input.slice(i + split.length), split)];
    }
  }
  return [input.trim()];
}

function parseTypeConstructorAST(type: string): TypeskellAST {
  const [typeconstructor, ...params] = splitWithParens(type, ' ');
  const lastParam = params[params.length - 1];
  if (isSpreadName(lastParam)) {
    params.pop();
    return {
      type: 'typeconstructor',
      name: typeconstructor as UppercaseChars,
      params: params.map(arg => parseAST(trimParens(arg))),
      spread: lastParam.slice(2) as GreekChars,
    };
  }
  return {
    type: 'typeconstructor',
    name: typeconstructor as UppercaseChars,
    params: params.map(arg => parseAST(trimParens(arg))),
  };
}

function isTypeConstructor(char: string): char is UppercaseChars {
  return /[A-Z]/.test(char);
}

function isTypeName(char: string): char is LowercaseChars {
  return /[a-z]/.test(char);
}

function isSpreadName(param: string): param is `..${GreekChars}` | `..${GreekChars}${GreekChars}` {
  return param.startsWith('..');
}

function parseArgsAST(input: string): TypeskellAST[] {
  if (isTypeConstructor(input[0])) return [parseTypeConstructorAST(input)];
  return splitWithParens(input, ' ').map(arg => parseAST(trimParens(arg)));
}

function parseFromArrayToManyAST([type, ...rest]: string[]): TypeskellAST[] {
  if (rest.length === 0) {
    if (isTypeConstructor(type[0])) return [parseTypeConstructorAST(type)];
    if (type.length <= 1) return [{ type: 'type', name: type as LowercaseChars }];
    return parseArgsAST(type);
  }
  if (rest.length === 1) {
    return [
      {
        type: 'function',
        args: parseArgsAST(type),
        result: parseAST(trimParens(rest[0])),
      },
    ];
  }
  return [
    {
      type: 'chain',
      args: parseArgsAST(type),
      result: parseFromArrayToManyAST(rest)[0],
    },
  ];
}

function parseToManyAST(input: string): TypeskellAST[] {
  return parseFromArrayToManyAST(splitWithParens(input, '->'));
}

export function parseAST(input: string): TypeskellAST {
  return parseToManyAST(input)[0];
}
