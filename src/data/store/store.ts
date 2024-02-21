import * as tFunctor from '@typeclass/functor';
import * as tCoMonad from '@typeclass/comonad';
import { Store, TStore } from './store.types';
import { flow } from '@utils/pipe';

export const seek: <S>(s: S) => <A>(wa: Store<A, S>) => Store<A, S> = s => wa => ({ peek: wa.peek, pos: s });

export const seeks: <S>(f: (s: S) => S) => <A>(wa: Store<A, S>) => Store<A, S> = f => wa => ({
  peek: wa.peek,
  pos: f(wa.pos),
});

export const peeks: <S>(f: (s: S) => S) => <A>(wa: Store<A, S>) => A = f => wa => wa.peek(f(wa.pos));

export const Functor: tFunctor.Functor<TStore> = {
  map: f => fa => ({
    peek: flow(fa.peek, f),
    pos: fa.pos,
  }),
};

export const CoMonad: tCoMonad.CoMonad<TStore> = {
  ...Functor,
  extract: wa => wa.peek(wa.pos),
  extend: f => wa => ({
    peek: s => f({ peek: wa.peek, pos: s }),
    pos: wa.pos,
  }),
};

export const map = Functor.map;

export const mapCompose = tFunctor.mapCompose(Functor, Functor);

export const flap = tFunctor.flap(Functor);

export const as = tFunctor.as(Functor);

export const tap = tFunctor.tap(Functor);

export const extract = CoMonad.extract;

export const extend = CoMonad.extend;

export const duplicate = tCoMonad.duplicate(CoMonad);
