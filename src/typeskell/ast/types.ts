// prettier-ignore
export type UppercaseChars = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'W' | 'X' | 'Y' | 'Z';

export type LowercaseChars = Lowercase<UppercaseChars>;

// prettier-ignore
export type GreekChars = 'α' | 'β' | 'γ' | 'δ' | 'ε' | 'ζ' | 'η' | 'θ' | 'ι' | 'κ' | 'λ' | 'μ' | 'ν' | 'ξ' | 'ο' | 'π' | 'ρ' | 'σ' | 'τ' | 'υ' | 'φ' | 'χ' | 'ψ' | 'ω';

export type DoubleGreekChars = `${GreekChars}${GreekChars}`;

export type TypeContructorAST = {
  type: 'typeconstructor';
  name: UppercaseChars;
  params: HaskellAST[];
  spread?: GreekChars | DoubleGreekChars;
};

export type TypeAST = {
  type: 'type';
  name: LowercaseChars;
};

export type FunctionAST = {
  type: 'function';
  args: HaskellAST[];
  result: HaskellAST;
};

export type ChainAST = {
  type: 'chain';
  args: HaskellAST[];
  result: HaskellAST;
};

export type HaskellAST = FunctionAST | ChainAST | TypeAST | TypeContructorAST;
