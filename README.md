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

The following is the precise description of exports of the library.

### Types

Types necessary for representation of the library entities.

```ts
function MapClass(change: (callee: any, target: any): boolean): {
	(map: Map, _default: any): {
		default: (): any,
		keys: (): any[],
		values: (): any[],
		index: (x: any): any
	},
	extend: (f: Function): MapClass,
	extendKey: (f: Function): MapClass
}
```

A general function (and an interface), returning a function for creation of immutable map-like data-structures
on the base of maps, purposed for representing an arbitrary connection via `change`.

The 'index(x)' is defined as a run-through all of the `key`s in `keys()`, and checking for
truthfulness of `change(key, x)`.
The value corresponding to the first such key is returned.
In case of failure to find a match, `default` is returned (by default, it's `undefined`).

The library has some particular instances of this function's calls,
and uses the `IndexMap` interface (output of `MapClass` functions) throughout.

The `.extend` method also allows one to create a new `MapClass` based on the current one, by means of composing it with another function
in terms of the argument: `change(curr, f(x))`.
The `.extendKey` also extends the given `MapClass`, but does so in reverse `change(f(curr), x)`.

The function is very powerful and allows to, for example, easily and fluently express various sets of "responses" to different elements of a given grammar (and, by derivation, creation of descriptions of parsers, validators and source-generators).

```ts
function PredicateMap(map: Map): {
	keys: (): ((x): any)[]
	values: (): any[]
	index: (x: any): any
}
```

Instance of `MapClass`.
Contains predicates (anything that is callable).
Equivalent of `MapClass((curr, x): curr(x))`.

```ts
function RegExpMap(map: Map): {
	keys: (): RegExp[]
	values: (): any[]
	index: (x: any): any
}
```

Instance of `MapClass`.
Contains Regular Expressions (or anything with '.test(x)' method defined on it).
Equivalent of `MapClass((curr, x): curr.test(x))`.

```ts
function SetMap(map: Map): {
	keys: (): Set[]
	values: (): any[]
	index: (x: any): any
}
```

Instance of `MapClass`.
Contains Sets (or anything with '.has(x)' method defined on it).
Equivalent of `MapClass((curr, x): curr.has(x))`.

```ts
function BasicMap(map: Map): {
	keys: (): any[]
	values: (): any[]
	index: (x: any): any
}
```

Instance of `MapClass`.
Contains arbitrary objects.
Equivalent of `MapClass((curr, x): curr === x)`.

```ts
function TokenMap(mapClass: MapClass): MapClass
```

Accepts an instance of `MapClass`.
Equivalent to `mapClass.extend(Token.type)` (that is, it adds the `type` function to the input of the initial `MapClass`'s `change` function)

Intended for adapting already existing `MapClass`es to work with Tokens.

```ts
function ValueMap(mapClass: MapClass): MapClass
```

Accepts an instance of `MapClass`.
Equivalent to `mapClass.extend(Token.value)`.

```ts
function TypeMap(mapClass: MapClass): MapClass
```

Accepts an instance of `MapClass`.
Equivalent to `mapClass.extendKey((x) => x.is)`.

Intended to work with `TokenType`s.

```ts
const StringPattern: {
	(string: string): {
		value: string
		split: (x: RegExp | string): PatternCollection
		matchAll: (x: RegExp): PatternCollection
		length: number
	}
	empty: StringPattern("")
	is: (x: any): boolean,
	collection: StringPatternCollection
}
```

A data structure implementing a `Pattern` interface,
used as input for the `PatternTokenizer` general tokenizing function.

NOTE [1]: the `.split`, `.matchAll` can have an arbitrary argument type in the 'Pattern' interface
(in this case - a 'RegExp' and 'string').

NOTE [2]: here, the case of `PatternCollection` interface is a `StringPatternCollection` object.

```ts
const StringPatternCollection: {
	(array: any[]): {
		value: any[],
		join: (x: Pattern): Pattern
		filter: (predicate: (x: any): boolean): PatternCollection
		reduce: (accumulator: (acc: any, curr: any, i: number): any, init: any): any
		every: (predicate: (x: any): boolean): boolean
		slice: (start: number, end: number): PatternCollection
		concat: (collection: PatterCollection): PatternCollection
		[Symbol.iterator]: GeneratorFunction
	},
	is: (x: any): boolean
}
```

Implements the `PatternCollection`, which contains some of the methods of the builtin 'Array' interface.

NOTE: here `Pattern` is always a `StringPattern`.

```ts
function InputStream(input: any[] | string): {
	pos: number
	curr: (): any
	prev: (): any
	next: (): any
	isEnd: (): boolean
	rewind: (): any,
	copy: (): Stream
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

The (optional) `copy` method copies the current stream up to the state and
interface.

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

NOTE: the `any[] | string` is actually any type that is indexable using `number`s (so, for instance, an arbitrary object with right keys could work as well)

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

The order of following is with preference to recursion rather than "leveling" - that being, upon discovering that the `.curr()` is in possesion of any `.children()`, the first child becomes the new value of `.curr()` after calling `.next()`. When there are no children of the current value, the `TreeStream` turns to the siblings, and returns the next one, if it exists. Repeating this with the other siblings - when all the siblings and/or their children were exhausted (that being, the subtree defined by the initial child's parent has been fully iterated), the function goes up the level from the initial child, repeating the algorithm in regards to it. When it finally reaches the "rightmost" possible child of the root element (`tree`), it halts, thus rendering the iteration complete.

```ts
const StringSource: {
	(string: string): {
		value: string
		concat: (x: StringSource): StringSource,
	}
	empty: StringSource("")
}
```

Immutable data structure, implements a `Source` interface.
Is an output of the `SourceGenerator` function,
intended for building text-generators.

Also can be used with `read` function.

```ts
function TokenSource(token: Token): {
	value: Token,
	concat: (x: Token): TokenSource
}
```

A wrapper-function for creating `TokenSource`s - a semi-implementation of the 'Source' interface.
Intended primarily for the `read` function.

Upon calling `TokenSource(...).concat`, takes a `token: Token`,
the `.value` of which is being `.concat`-ed (the method must be present on it)
to the `.value` of `x`.

```ts
const Token: {
	(type: any, value: any): {
		type: any
		value: any
	}
	is: (x: any): boolean,
	type(x: Token): any,
	value(x: Token): any
}
```

The `Token` interface is simple, convinient for many practical applications and can be used by the library's parsing, tokenization and validation tools easily.

The `type` and `value` static methods of the function can be used to get the `.type` and `.value` properties in a way that would make the usage of `Token`, or a related structure more slightly more obvious.

The `.is` method checks that the given `any` is an `object` and has `type` and `value` properties.

```ts
function TokenType(type: any): {
	(value: any): {
		type: any,
		value: any
	},
	is: (x: any): boolean
}
```

Returns a "type" of tokens defined by the `type`
value, that contains a function for construction of `Token`s,
as well as an identifying `.is` function for checking the validity of the `.type`.

```ts
function TokenInstance(type: any): {
	(): {
		type: any
	},
	is: (x: any): boolean
}
```

Creates and returns a function for construction of an 'instance-type' of `Token`s,
that, however, does not contain a 'value' property. Useful for
cases, when one needs to bunch a sequence of tokens that always have to
follow one another, but represent a single entity.

Has an appropriate `.is` function (checks for `.type` only).

```ts
function ArrayToken(x: Token): any[]
```

Converts the given `Token` with `value: any[]` into an array, while preserving its properties and having keys from `0` to `x.value.length - 1` same as that of `x.value`.

```ts
function RecursiveArrayToken(x: Token): any[]
```

Takes in a `Token` and recursively transforms all of its sub-`Token`s that are a descendant of `x.value` (whenever `x.value` is in possession of a `Symbol.iterator` and is an `object`, which is the requirement for the `ArrayToken` to work successfully).

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
function PatternTokenizer(tokenMap: IndexMap, tokenCheck?: (x: any): boolean): (pattern: Pattern): Token[]
```

Splits a `Pattern` into `Token`s array using the `tokenMap`, containing
as values types' values, and as keys - the values used for `.split`ting
and `.matchAll`-ing the given `Pattern` recursively.

The `tokenCheck` (by default) is `Token.is`.

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
This is to be used (primarily) for cases like:

`/(...)*?/`

That it, non-greedy quantifiers.

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
