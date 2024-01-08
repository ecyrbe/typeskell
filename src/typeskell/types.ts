import { Kind } from '@kinds';

export type TypeMap = Record<string, string>;
export type TypeConstructorMap = Record<string, number>;

export type TypeMapCompiler = Record<string, unknown>;
export type TypeConstructorMapCompiler = Record<string, Kind>;
