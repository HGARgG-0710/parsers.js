# parsers.js

This is a library providing simple, yet general and powerful, interfaces for easing the process of
parser/tokenizer/code-generator-building, input-validation and manual regular-expression-construction.

It allows one to easily define reusable functions for parsing/code-generation/validation of various data formats,
as well as containing useful datatype definitions and general interfaces.

The library allows parsers (and similar structures) to be rewritten entirely in terms of maps of functions and
string-based typesystems, on which these maps are based.

## Installation

Via npm:

```
npm install @hgargg-0710/parsers.js
```

## Documentation

Documentations for various versions:

[v0.1](https://github.com/HGARgG-0710/parsers.js/tree/698d42c1319acdfb1275f00f7575cb616252ad9d?tab=readme-ov-file#parsersjs)

[v0.1.1](https://github.com/HGARgG-0710/parsers.js/tree/ed42fb9c47543e750571a4d37153d7f0c28edf30?tab=readme-ov-file#parsersjs)

[v0.1.2](https://github.com/HGARgG-0710/parsers.js/tree/5ce1375304b2a090998e3083161cbaf15596bd78?tab=readme-ov-file#parsersjs)

[v0.1.3](https://github.com/HGARgG-0710/parsers.js/tree/df97a48f25d6b310951ebf0a0d3a973cbdb3727f?tab=readme-ov-file#parsersjs)

[Wiki](https://github.com/HGARgG-0710/parsers.js/wiki) (>=v0.2)

The latest versions' wiki is available online, while for earlier versions, one can
`git clone` it and `git checkout` to an appropriate tag/commit.

## Examples

For usage examples, see the 'tests' directory.

## Versioning

When using library caution is advised when choosing the version,
as (occasionally) due to growth, refactoring, new releases will
contain breaking changes - thus, a precise version-choice is recommended.

As the library is (largely) independent and
its growth does not get to be motivated by outside sources,
nor any reasons beyond those of purely bettering nature,
it is fairly unlikely that code written using it will
require change without requiring first the change of the underlying
formats themselves. Thus, the process of automatic update
(in this case) would do rather more harm than good.
