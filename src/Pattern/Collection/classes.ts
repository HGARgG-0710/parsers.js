import type { Pattern } from "../interfaces.js"
import type { Collection } from "./interfaces.js"
import {
	stringCollectionPush,
	stringCollectionIterator,
	accumulatingTokenCollectionPush,
	accumulatingTokenCollectionIterator
} from "./methods.js"

export function StringCollection(string: string): Collection<string> {
	return {
		value: string,
		push: stringCollectionPush,
		[Symbol.iterator]: stringCollectionIterator
	}
}

export function ArrayCollection<Type = any>(x: Type[] = []): Collection<Type> {
	;(x as unknown as Collection<Type>).value = x
	return x as unknown as Collection<Type>
}

export function AccumulatingPatternCollection(token: Pattern): Collection<Pattern> {
	return {
		value: token,
		push: accumulatingTokenCollectionPush,
		[Symbol.iterator]: accumulatingTokenCollectionIterator
	}
}
