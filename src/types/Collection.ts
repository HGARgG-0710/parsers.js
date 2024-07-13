// * This is the generalization of 'Source's and 'Pushable's from the v0.2 and earlier.

import type { Indexed, Iterable, Token } from "main.js"

export interface Collection<Type = any> extends Iterable<Type> {
	value: any
	append(...x: Type[]): Collection<Type>
	compose(x: Collection<Type>): Collection<Type>
}

export function createIterator(indexable: Indexed) {
	return function* () {
		for (let i = 0; i < indexable.length; ++i) yield indexable[i]
	}
}

export function StringCollection(string: string): Collection<string> {
	return {
		value: string,
		append: function (...x: string[]) {
			this.value += x.join("")
			return this
		},
		compose: function (string: Collection<string>) {
			this.value += string.value
			return this
		},
		[Symbol.iterator]: createIterator(string)
	}
}

export function ArrayCollection<Type = any>(array: Type[]): Collection<Type> {
	return {
		value: array,
		append: function (...x: Type[]) {
			array.push(...x)
			return this
		},
		compose: function (collection: Collection<Type>) {
			array.push(...collection.value)
			return this
		},
		[Symbol.iterator]: createIterator(array)
	}
}

export function TokenCollection(token: Token): Collection<Token> {
	return {
		value: token,
		append: function (...tokens: Token[]) {
			for (const token of tokens) this.value.value += token.value
			return this
		},
		compose: function (collection: Collection<Token>) {
			for (const token of collection) this.value.value += token.value
			return this
		},
		[Symbol.iterator]: function* () {
			return this.value
		}
	}
}
