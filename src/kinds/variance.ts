export type NoInfer<T> = [T][T extends any ? 0 : never];

/**
 * In/Out parameter
 */
export type Invariant<T> = (_: T) => T;
/**
 * Out parameter
 */
export type Covariant<T> = (_: never) => T;

/**
 * In parameter
 */
export type Contravariant<T> = (_: T) => void;
