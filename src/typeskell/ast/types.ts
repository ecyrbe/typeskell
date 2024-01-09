// prettier-ignore
export type UppercaseChars = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'W' | 'X' | 'Y' | 'Z';

export type LowercaseChars = Lowercase<UppercaseChars>;

// prettier-ignore
export type GreekChars = 'α' | 'β' | 'γ' | 'δ' | 'ε' | 'ζ' | 'η' | 'θ' | 'ι' | 'κ' | 'λ' | 'μ' | 'ν' | 'ξ' | 'ο' | 'π' | 'ρ' | 'σ' | 'τ' | 'υ' | 'φ' | 'χ' | 'ψ' | 'ω';

export type DoubleGreekChars = `${GreekChars}${GreekChars}`;

export type TypeContructorAST = {
  type: 'typeconstructor';
  name: UppercaseChars;
  params: TypeskellAST[];
  spread?: GreekChars | DoubleGreekChars;
};

export type TypeContructorASTCompiler = {
  type: 'typeconstructor';
  name: string;
  params: unknown[];
  spread?: string;
};

export type TypeAST = {
  type: 'type';
  name: LowercaseChars;
};

export type TypeASTCompiler = {
  type: 'type';
  name: string;
};

export type FunctionAST = {
  type: 'function';
  args: TypeskellAST[];
  result: TypeskellAST;
};

export type FunctionASTCompiler = {
  type: 'function';
  args: unknown[];
  result: unknown;
};

export type ChainAST = {
  type: 'chain';
  args: TypeskellAST[];
  result: TypeskellAST;
};

export type ChainASTCompiler = {
  type: 'chain';
  args: unknown[];
  result: unknown;
};

export type TypeskellAST = FunctionAST | ChainAST | TypeAST | TypeContructorAST;

export type TypeskellASTCompiler = FunctionASTCompiler | ChainASTCompiler | TypeASTCompiler | TypeContructorASTCompiler;
