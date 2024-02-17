import { Kind, ContravariantParam, InvariantParam } from '@kinds';

export interface Reader<A, Env> {
  (env: Env): A;
}

export interface TReader extends Kind<[InvariantParam, ContravariantParam]> {
  return: Reader<this['arg0'], this['arg1']>;
}
