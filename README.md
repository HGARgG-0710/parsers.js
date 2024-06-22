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

<!-- TODO: make a LIST of all the versions' documentation references (before v0.2)... -->

<!-- ! DELETE ALL AFTER HERE! -->

The following is the precise description of exports of the library.

### Tokenization

The following are functions used for building tokenizers, of which the library currently provides 2.

```ts
function StreamTokenizer(tokenMap: IndexMap): (input: Stream): Stream
```

Transforms the given `input` `Stream` into a `Stream` based off the `tokenMap` map.

The `tokenMap` maps the elements of `input` to function that are executed with the
result of `StreamTokenizer` (the `Stream` object) as a `this` context with
`input` as the only expected argument of the of the `tokenMap` functions.

The `StreamTokenizer` is intended for further passing to a higher-level
function working with streams (such as, for instance, `StreamParser`).

```ts
function PatternTokenizer(tokenMap: IndexMap, tokenCheck?: (x: any): boolean): (pattern: Pattern): Token[]
```

Splits a `Pattern` into `Token`s array using the `tokenMap`, containing
as values types' values, and as keys - the values used for `.split`ting
and `.matchAll`-ing the given `Pattern` recursively.

The `tokenCheck` (by default) is `Token.is`.

<br>

### Parsing

```ts
function delimited
(
	limits:
		[
			number | (input: Stream, i: number, j: number): boolean,
			(number | (input: Stream, i: number, j: number): boolean)?
		]
			| number
			| (input: Stream, i: number, j: number): boolean,
	isdelim: (input: Stream, i: number, j: number): boolean,
):
	(input: Stream, handler: (x: any, i: number, j: number): any): any[]
```

Returns a function for parsing a "delimited" portion of a given
Stream (with appropriate predicates, the function is fit for parsing any part of the given Stream).

Arguments [first layer]:

1. `limits` - limits within which the function shall "seek" elements. If a `[number, number]` array, then the function will first skip `limits[0]`, then iterate through the next `limit[1]` elements of the `input`. If `limits[1]` is absent, `limits[0]` will be used for iterating and no items shall be skipped. If any of the two elements are not numbers but a predicate (`(input: Stream, i: number, j: number): boolean`), then the predicate shall be used instead. If `limits` is not an `Array`, then it shall be treated as if a single-element arary `[limits]` was passed instead.
2. `isdelim` - a predicate taking in the `input`, a current element-index `i` (the number of non-delim elements in the resulting array so far) and a delim-index `j`, checks element for being a "delimiter". Whenever true, the element in question is skipped, otherwise the `input.curr()` is passed to the `handler`, and the result added to the resulting array.

Arguments [second layer]:

1. `input` - the `Stream` to be iterated through
2. `handler` - function, accepting the `input` and the curent element-index `i` and delimiter-index `j` (sum being `i + j` - the current number of passed elements). Its result gets added to the returned array.

NOTE: the `delimited` will only continue parsing until the moment that `input.isEnd()` is true, or the rest of conditions for stopping are met.

```ts
function eliminate(
	symbols: PatternCollection
): (pattern: Pattern, nil: Pattern?): Pattern
```

Eliminates all the items from `symbols` (that are arguments of the given `Pattern.split` implementation),
from the given `Pattern` `pattern`, replacing them with `nil` pattern
(by default, equals `pattern.class.empty`).

```ts
function skip(input: Stream): (pred: number | (x: any): boolean): number
```

Skips some elements of the `input` `Stream`.
If `pred` is a `number`, then calls `input.next()` `pred` times.
Otherwise, continues to call `input.next()` until either `pred` is false,
or the `input.isEnd()` has come to become true.

```ts
function preserve(input: Stream): [any]
```

A `handler` function that returns the `[input.curr()]` (current element of the `Stream`).
Good for "preserving" the `Stream`.

```ts
function miss(): []
```

A handler function, equivalent to "missing" an item.
A useful little alias.

```ts
function limit(init: number | (input: Stream, i: number): boolean, pred?: number | (input: Stream, i: number): boolean): (input: Stream): any[]
```

Takes the chunk of `input` defined by `init` (the `number` of items to skip, or the condition used for `skip`ping),
and `pred` (defining the end of the sequence extracted).

Mutates `input`. If `pred` is missing, it will be replaced with `init`, and no items will be skipped.

```ts
function transform(handler?: (input: Stream, i: number): any): (input: Stream): any[]
```

Iterates a given `Stream`, turning it into an array filled with values of
Default handler is `preserve` (same as copying `input` and transforming the copy to an array).

```ts
function TableParser(parserMap: IndexMap, next: ((input: Stream): any)?): (input: Stream): any
```

Creates and returns a new parser based of an `IndexMap`. It takes in a `Stream` and returns the result of a corresponding function `(input: Stream, parser: (input: Stream): any): any[]`, to which (as a second argument) `next` is passed.
In absence of `next`, the returned parser itself is used as an argument.

```ts
function read(pred: number | (input: Stream, i: number): boolean, init: Source): (input: Stream): Source
```

Creates and returns a new function that iterates through its only argument `Stream` `input`,
and returns a `Source` (which is the result of concatenation of `init` to all the `.curr()` elements
of `input`, such that `pred(input, i)` for all `0<=i` starting from the initial `input.curr()`).

Very useful generally for reading a portion of a `Stream` and getting it as a 'Source'.

NOTE [important]: the actual type of the result is not necessarily a `Source`,
in that it does not have to possess the `.value` property, only the `.concat()` method.
Same goes for `init`. Fit for usage with builtin `String`s for instance...

```ts
function StreamParser(parserMap: IndexMap | TableParser): (input: Stream): any[]
```

A function returning parser built based off `parserMap` `IndexMap`, containing as values functions `(input: Stream, parser: (input: Stream): any): any[]`, and `index` being run in terms of the current `input` element. The `parser` (by default) is a function-indexator based on the `parserMap.index` of passed `input.curr()`.

NOTE: if `parserMap` is a `TableParser`, then it will be used as-is, otherwise - it will be put through `TableParser` function.

The `input` and `parser` are passed to the called map-function as arguments. The results of those function calls are appended to the resulting array.

User may use different `parser` values, thus allowing for `merging` and decomposing several sisterly syntaxes. The default `parser` is a result of `TableParser` defined through `parserMap` without a `next` given (so it references itself by default instead).

<br>

### Validation

The following functions can aid the user in creation of validation functions for various syntaxes.

```ts
function StreamValidator(validityMap: IndexMap): (input: Stream): boolean
```

Returns a function for validating a `Stream` `input` based off the `validityMap`,
which has as values functions `(x: any): boolean`.
The validation stops the moment that any of the functions have returned `false`, or no value inside the `validityMap` has been found for the desired `input` element.
In this case, the validation is to be considered failed. Otherwise, the validation has been completed successfully and the return value of the call is `true`.

```ts
function PatternValidator(validityMap: IndexMap): (pattern: Pattern): boolean
```

Returns a function for validation of a `Pattern`. Same method of separation of the `pattern` using `validityMap` as the `PatternTokenizer`, except now the functions in `validityMap` return `boolean`. `true` signifies successful validation, `false` - a failure.

<br>

### Generation

The following functions may aid the user in generation of structures that are parse-able.

```ts
function SourceGenerator(generateMap: IndexMap | TableParser): (stream: Stream, prevSource: Source): Source
```

Based on the `generateMap`, containing as values functions `(x: any): Source`, and the `.index` of which is applied to `stream.curr()`.

NOTE: if `generateMap` is a `TableParser`, then it will be used as-is, otherwise - it will be put through `TableParser` function.

The final `Source` is obtained via repeated `.concat`.
The initial source is equal to `prevSource` (note: when there is none, one can use the `Source.empty` property of the constructor-function)

### Misc

Various few abstractions that may come in handy during parser-building process.

```ts
function isNumber(x: any): boolean
```

Returns whether `typeof x === 'number' || x instanceof Number`.

```ts
function predicateChoice(x: number | (...x: any[]): boolean): (input: Stream, i: number, j: number): boolean | (...x: any[]): boolean
```

Returns `x` if `!isNumber(x)`, otherwise `(input, i) => i < x`. (Handy when "automatic" construction of predicates from numbers is needed).

```ts
function setPredicate(set: Set): (x: any): boolean
```

Converts a set into a predicate via returning `(x) => set.has(x)`.

```ts
function isType(type: any): (x: any): boolean
```

Returns a function `(x) => Token.type(x) === type`.

```ts
function parserChoice(x: Function | IndexMap): Function
```

Checks whether given `x` is a `Function`, if so - returns it, otherwise,
the result of `TableParser(x)`.

```ts
function childIndex(multindex: number[]): any
```

A function with 'this' context.
Used as a value for `.index` property of `ArrayTree` function results.

Recursively iterates over the given multi-index (index array), by means of repeatedly getting
the value of `x.children()[index]`, where `x` is the last value (starting with `this`).

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
