import type { Pattern } from "../interfaces.js"
import type { Collection } from "./interfaces.js"
import {
	stringCollectionPush,
	stringCollectionIterator,
	accumulatingTokenCollectionPush,
	accumulatingTokenCollectionIterator
} from "./methods.js"

export class StringCollection implements Collection<string> {
	value: string
	push: (...x: string[]) => Collection<string>;
	[Symbol.iterator]: () => Generator<string>

	constructor(string: string) {
		this.value = string
	}
}

Object.defineProperties(StringCollection.prototype, {
	push: { value: stringCollectionPush },
	[Symbol.iterator]: { value: stringCollectionIterator }
})

export function ArrayCollection<Type = any>(x: Type[] = []): Collection<Type> {
	;(x as unknown as Collection<Type>).value = x
	return x as unknown as Collection<Type>
}

export class AccumulatingPatternCollection implements Collection<Pattern> {
	value: Pattern
	push: (...x: Pattern<any>[]) => Collection<Pattern>;
	[Symbol.iterator]: () => Generator<Pattern>

	constructor(pattern: Pattern) {
		this.value = pattern
	}
}

Object.defineProperties(AccumulatingPatternCollection.prototype, {
	push: { value: accumulatingTokenCollectionPush },
	[Symbol.iterator]: { value: accumulatingTokenCollectionIterator }
})
