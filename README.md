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
npm install @hgargg-0710/parser.js
```

## Documentation

The following is the precise description of exports of the library.

### Types

Types necessary for representation of the library entities.

```ts
function MapClass(change: (callee: any, target: any): boolean): {
	(map: Map): {
		keys: (): any[],
		values: (): any[],
		index: (x: any): any
	},
	extend: (f: Function): MapClass
}
```

A general function (and an interface), returning a function for creation of immutable map-like data-structures
on the base of maps, purposed for representing an arbitrary connection.

The 'index(x)' is defined as a run-through all of the `keys()`, and checking for
truthfulness of `change(key, x)`.
The value corresponding to the first such key is returned.
In case of failure to find a match, `undefined` is returned.

The library has some particular instances of this function's calls,
and uses the `IndexMap` interface (output of `MapClass` functions) throughout.

The '.extend' method also allows one to create a new `MapClass` based on the current one, by means of composing it with another function.

```ts
function PredicateMap(map: Map): {
	keys: (): ((x): any)[]
	values: (): any[]
	index: (x: any): any
}
```

Contains predicates (anything that is callable).
Equivalent of `MapClass((curr, x): curr(x))`.

```ts
function RegExpMap(map: Map): {
	keys: (): RegExp[]
	values: (): any[]
	index: (x: any): any
}
```

Contains Regular Expressions (or anything with '.test(x)' method defined on it).
Equivalent of `MapClass((curr, x): curr.test(x))`.

```ts
function SetMap(map: Map): {
	keys: (): Set[]
	values: (): any[]
	index: (x: any): any
}
```

Contains Sets (or anything with '.has(x)' method defined on it).
Equivalent of `MapClass((curr, x): curr.has(x))`.

```ts
function BasicMap(map: Map): {
	keys: (): any[]
	values: (): any[]
	index: (x: any): any
}
```

Contains arbitrary objects.
Equivalent of `MapClass((curr, x): curr === x)`.

```ts
function TokenMap(mapClass: MapClass): MapClass
```

Equivalent to `mapClass.extend(type)` (that is, it adds the `type` function to the input of the initial `MapClass`'s `change` function)

Intended for adapting already existing `MapClass`es to work with Tokens.

```ts
const StringPattern: {
	(string: string): {
		value: string
		split: (x: RegExp | string): PatternCollection
		matchAll: (x: RegExp): PatternCollection
		length: number
	}
	empty: ""
	is: (x: any): boolean
}
```

A data structure implementing a `Pattern` interface,
used as input for the `PatternTokenizer` general tokenizing function.

NOTE [1]: the `.split`, `.matchAll` can have an arbitrary argument type in the 'Pattern' interface
(in this case - a 'RegExp' and 'string').

NOTE [2]: here, the case of `PatternCollection` interface is a `StringPatternCollection` object.

```ts
function StringPatternCollection(array: any[]): {
	value: any[],
	join: (x: string): Pattern
	filter: (predicate: (x: any): boolean): PatternCollection
	reduce: (accumulator: (acc: any, curr: any, i: number): any, init: any): any
	every: (predicate: (x: any): boolean): boolean
	slice: (start: number, end: number): PatternCollection
	concat: (collection: PatterCollection): PatternCollection
	[Symbol.iterator]: GeneratorFunction
}
```

Implements the `PatternCollection`, which contains some of the methods of the builtin 'Array' interface.

```ts
function InputStream(input: any[] | string): {
	pos: number
	curr: (): any
	prev: (): any
	next: (): any
	isEnd: (): boolean
	rewind: (): any
}
```

An data structure implementing the `Stream` interface for
representing input of structures that work with the interface
(`StreamTokenizer` and `StreamParser`).

NOTE: the 'Stream' interface only really requires the presence of
three methods: `curr`, `next`, `isEnd`.

The `curr` method returns the current element of the stream without altering
the stream (can be called several times to get the same result).

The `prev` method (when present) goes back one position and returns
the current element.

NOTE: to get the previous element one does not do `input.prev()`, but:

```ts
	const input = InputStream(...)
	// ...
	input.prev() // * returns current
	const prev = input.curr() // * returns previous
```

Same goes for `next`.

The `next` method returns the current element and goes
forward a single position.

The `isEnd` returns whether the `Stream` has "finished"
(to be used in conditionals).

The `rewind` method (when present) resets the `Stream`'s state
entirely and returns the 0'th element (the new current).

```ts
function ArrayTree(arrTree: any[]): {
	children: (): Tree[]
	index: (multiindex: number[]): Tree | undefined
}
```

Returns a tree-like interface of a `Tree`, when provided with an `arrTree` "array-tree"
(hybrid nested array with properties and children sitting at number indicies).

The `index` uses an indicies array for indexation within the tree
(with `i`th element being the `i`th level's index and the 0th level being the tree itself).

Note [1]: the function only APPENDS the methods in question to the `arrTree` object argument.

Note[2]: the `Tree` interface is used by the function `TreeStream`.

```ts
function TreeStream(tree: Tree): {
	next: (): any
	curr: (): any
	isEnd: (): boolean
	rewind: (): any
}
```

Another implementation of the 'Stream' interface (this time for trees),
which (effectively) linearizes a `Tree` tree-like interface.

```ts
const StringSource: {
	(string: string): {
		value: string
		concat: (x: StringSource): StringSource,
	}
	empty: ""
}
```

Immutable data structure, implements a `Source` interface.
Is an output of the `SourceGenerator` function,
intended for building text-generators.

```ts
function Token(
	type: any,
	value: any
): {
	type: any
	value: any
}
```

The `Token` interface is simple, convinient for many practical applications and can be used by the library's parsing, tokenization and validation tools easily.

<br>

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
function PatternTokenizer(tokenMap: IndexMap): (pattern: Pattern): Token[]
```

Splits a `Pattern` into `Token`s array using the `tokenMap`, containing
as values types' values, and as keys - the values used for `.split`ting
and `.matchAll`-ing the given Pattern recursively.

<br>

### Regular Expressions

The regular expressions exports come in a separate `regex` submodule.
They (primarily) serve as a mean to construct regular expressions
literals via more verbose, semantically distinguishable and structured
means, allowing for refactroing and greater reusability (functions).

The API is simple and allows consequent chaining of output-RegExp
to one another.

NOTE (important): these transformations DO NOT preserve the flags of the initial regexps.
To add flags use `flagsAdd`.

```ts
function regexContents(r: RegExp): string
```

Returns the contents of the given regular expression (without flags).

```ts
function capture(r: RegExp): RegExp
```

Creates a capture-group regular expression based directly off input.
NOTE: the `(...)`

```ts
function nonCapture(r: RegExp): RegExp
```

Creates a non-capture group regular expression based on the input.
NOTE: the `(?:...)`

```ts
function namedCapture(name: string): (r: RegExp): RegExp
```

Creates a named capture based off input.
NOTE: the `(?<name>...)`

```ts
function and(...regexes: RegExp[]): RegExp
```

Puts the regular expressions given through a `nonCapture`,
then combines them together.
NOTE: the `(?:(?:...1)(?:...2)...(?:...n))`

```ts
function or(...regexes: RegExp[]): RegExp
```

Disjunction alternative of `and`.
NOTE: `(?:(?:...1)|(?:...2)|...|(?:...n))`

```ts
function flagAdd(flags: string): (regex: RegExp): RegExp
```

Creates a function for appending `flags` flags to the `regex` `RegExp`.

```ts
function global(regex: RegExp): RegExp
```

Same as `flagsAdd("g")`

```ts
function unicode(regex: RegExp): RegExp
```

Same as `flagsAdd("u")`

```ts
function subInd(regex: RegExp): RegExp
```

Same as `flagsAdd("d")`

```ts
function caseInsensetive(regex: RegExp): RegExp
```

Same as `flagsAdd("i")`.

```ts
function multline(regex: RegExp): RegExp
```

Same as `flagsAdd("m")`

```ts
function unicodeSets(regex: RegExp): RegExps
```

Same as `flagsAdd("v")`

```ts
function dotAll(regex: RegExp): RegExp
```

Same as `flagsAdd("s")`

```ts
function sticky(regex: RegExp): RegExp
```

Same as `flagsAdd("y")`

```ts
function occurences(...args: (number | string)[]): (r: RegExp): RegExp
```

Creates a function for regular expression equivalent of:

`(?:...){args[0], args[1]}`

If `args[1]` is given. It can be a number, or a string (say `""` to produce the effect of `{n,}`)

```ts
function begin(regex: RegExp): RegExp
```

Prepends the `^` to the given `RegExp`.

```ts
function end(regex: RegExp): RegExp
```

Appends the `$` to the given `RegExp`.

```ts
function plookahead(regex: RegExp): RegExp
```

The regular expression look ahead. NOTE: the `(?=...)`

```ts
function nlookahead(regex: RegExp): RegExp
```

The regular expression negative look ahead. NOTE: the `(?!...)`

```ts
function lookbehind(regex: RegExp): RegExp
```

The regular expression positive lookbehind. NOTE: the `(?<=...)`

```ts
function nlookbehind(regex: RegExp): RegExp
```

The regular expression negative lookbehind. NOTE: the `(?<!...)`

```ts
function boundry(regex: RegExp): RegExp
```

NOTE: the `/\b/`.

```ts
function Boundry(regex: RegExp): RegExp
```

NOTE: the `/\B/`.

```ts
function charClass(...ranges: (string | [string, string])[]): RegExp
```

Creates a new character class regular expression from character strings `"r0"->/[r0]/`,
and/or ranges `[r0, r1]->/[r0-r1]/`

The ranges are then concatenated together into a single expression.

```ts
function negCharClass(...ranges: [RegExp, RegExp?][]): RegExp
```

Same as the `charClass`, but it's a negative character class instead:
`[^...]`.

```ts
function digit(): RegExp
```

The `/\d/`

```ts
function nonDigit(): RegExp
```

The `/\D/`

```ts
function word(): RegExp
```

The `/\w/`

```ts
function nonWord(): RegExp
```

The `/\W/`

```ts
function space(): RegExp
```

The `/\s/`

```ts
function nonSpace(): RegExp
```

The `/\S/`

```ts
function anything(): RegExp
```

The `/./`

```ts
function tab(): RegExp
```

The `/\t/`.

```ts
function cr(): RegExp
```

The `/\r/` (carriage return)

```ts
function newline(): RegExp
```

The `/\n/`

```ts
function vtab(): RegExp
```

The `/\v/`

```ts
function form(): RegExp
```

The `/\f/`

```ts
function nil(): RegExp
```

The `/\0/`

```ts
function caret(letter: string): (): RegExp
```

Returns a function matching the specified symbol using caret notation.
NOTE: the `\c...`

```ts
function hex(letter: string): (): RegExp
```

NOTE: the `\x...`

```ts
function utf16(letter: string): (): RegExp
```

NOTE: the `\u...`

```ts
function plus(regex: RegExp): RegExp
```

Appends the `+` to the given regular expression, non-capture grouping it first.
NOTE: the `(?:...)+`

```ts
function star(regex: RegExp): RegExp
```

Like `plus`, appends the `*` to the given regular expression.
NOTE: the `(?:...)*`

```ts
function maybe(regex: RegExp): RegExp
```

Like `plus`, appends the `?` to the given regular expression.
NOTE: the `(?:...)?`

```ts
function uniAware(code: string): (): RegExp
```

The function returning a function returning a regexp of a symbol matched with `\u{...}`

```ts
function uniEsc(code: string): (): RegExp
```

NOTE: the `\p{...}`

```ts
function uniEscNon(code: string): (): RegExp
```

NOTE: the `\P{...}`

```ts
function backrefName(name: string): (): RegExp
```

Returns `/\k.../` (named back-reference regular expression).

```ts
function backrefIndex(N: number): (): RegExp
```

Returns `/\.../` (unnamed/numeric back-reference regular expression).

```ts
function nogreedy(regex: RegExp): RegExp
```

Appends bare `?` to the given regular expression (NO NON-CAPTURE-GROUP).
This is (primarily) for cases like:

`/(...)*?/`

That it, non-greedy quantifiers.

<br>

### Parsing

```ts
function delimited
(
	limits:
		[
			number | (x: any): boolean,
			(number | (x: any): boolean)?
		]
			| number
			| (x: any): boolean,
	isdelim: (input: Stream, i: number): boolean,
):
	(input: Stream, handler: (x: any, i: any): any): any[]
```

Returns a function for parsing a "delimited" portion of a given
Stream (with appropriate predicates, the function is fit for parsing any part of the given Stream).

Arguments [first layer]:

1. `limits` - limits within which the function shall "seek" elements. If a `[number, number]` array, then the function will first skip `limits[0]`, then iterate through the next `limit[1]` elements of the `input`. If `limits[1]` is absent, `limits[0]` will be used for iterating and no items shall be skipped. If any of the two elements are not numbers but a predicate (`(x: any): boolean`), then the predicate shall be used instead. If `limits` is not an `Array`, then it shall be treated as if a single-element arary `[limits]` was passed instead.
2. `isdelim` - a predicate taking in the `input` and a current index, checks element for being a "delimiter". Whenever true, the element in question is skipped, otherwise the `input.curr()` is passed to the `handler`, and the result added to the resulting array.

Arguments [second layer]:

1. `input` - the `Stream` to be iterated through
2. `handler` - function, accepting the `input` and the curent index. Its result gets added to the returned array.

NOTE: the `delimited` will only continue parsing until the moment that `input.isEnd()` is true, or the rest of conditions for stopping are met.

```ts
function eliminate(
	symbols: PatternCollection
): (pattern: Pattern, nil: ?Pattern): Pattern
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
function StreamParser(parserMap: IndexMap): (input: Stream): any[]
```

A function returning parser built based off `parserMap` `IndexMap`, containing as values functions `(input: Stream, parser: (input: Stream): any[]): any[]`, and `index` being run in terms of the current `input` element.

The `input` and result of `SteamParser` are passed to the called map-function as arguments. The results of those function calls are appended to the resulting array.

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
function SourceGenerator(generateMap: IndexMap): (stream: Stream, prevSource: Source): Source
```

Based on the `generateMap`, containing as values functions `(x: any): Source`, and the `.index` of which is applied to `stream.curr()`.

The final `Source` is obtained via repeated `.concat`. The initial source is equal to `prevSource` (note: when there is none, one can use the `Source.empty`)

### Misc

Various few little abstractions that may come in handy during parser-building process.

```ts
function isNumber(x: any): boolean
```

Returns whether `typeof x === 'number' || x instanceof Number`.

```ts
function predicateChoice(x: any): any
```

Returns `x` if `!isNumber(x)`, otherwise `(input, i) => i < x`.

```ts
function setPredicate(set: Set): (x: any): boolean
```

Converts a set into a predicate via returning `(x) => set.has(x)`.

```ts
function type(x: Token): any
```

Gets the `type` of a `Token`.

```ts
function value(x: Token): any
```

Gets the value of a `Token`.

```ts
function isToken(x: any): boolean
```

Checks if given thing is a Token.

## Examples

For examples, see the 'tests' directory.
