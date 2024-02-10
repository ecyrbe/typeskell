import { IO } from './io.types';

export const random: (min?: number, max?: number) => IO<number> =
  (min = 0, max = 1) =>
  () =>
    Math.random() * (max - min) + min;

export const randomInt: (min: number, max: number) => IO<number> = (min: number, max: number) => () =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const randomBool: IO<boolean> = () => Math.random() < 0.5;

export const log: (message: string) => IO<void> = (message: string) => () => console.log(message);

export const error: (message: string) => IO<void> = (message: string) => () => console.error(message);

export const alert: (message: string) => IO<void> = (message: string) => () => window.alert(message);

export const now: IO<number> = () => Date.now();

export const nowDate: IO<Date> = () => new Date();
