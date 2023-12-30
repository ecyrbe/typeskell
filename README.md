# TypeSkell

Experiment to declare typesclasses with programmatic type signatures.

## What's new with this encoding ?

The main idea is to put the effort on implementing typeclasses, and then have data implementation for free, no typing required.
The magic lies in building the correct generic variants of the typeclass automatically (programmatically).

## How ?

All the magic is done thanks to:
- a new encoding that remembers the parameters variance of a Kind (covariant, contravariant, invariant).
- a meta programming a compille time that builds generics functions at will (no need to declare exponetially many functions)

Then we let this meta-compiler (typescript itself) build the correct generic types for the typeclass at compile time.

Knowning variance allows to know if we should `&` or `|` the generic types programatically and also know what are the default values (unknown for invariants and contravariants, and never for covariants).