// * This is the generalization of 'Source's and 'Pushable's from the v0.2 and earlier.

import type { Token } from "./Token.js"
import type { Pattern } from "main.js"

export interface Collection<Type = any> extends Pattern, Iterable<Type> {
	push(...x: Type[]): Collection<Type>
}

export function stringCollectionPush(...x: string[]) {
	this.value += x.join("")
	return this
}

export function StringCollection(string: string): Collection<string> {
	return {
		value: string,
		push: stringCollectionPush,
		[Symbol.iterator]: function* () {
			let i = 0
			while (this.value.length > i) {
				yield this.value[i]
				++i
			}
		}
	}
}

export function ArrayCollection<Type = any>(x: Type[] = []): Collection<Type> {
	;(x as unknown as Collection<Type>).value = x
	return x as unknown as Collection<Type>
}

export function accumulatingTokenCollectionPush(...tokens: Token[]) {
	this.value.value += tokens.map((x) => x.value).join("")
	return this
}

export function AccumulatingTokenCollection(token: Token): Collection<Token> {
	return {
		value: token,
		push: accumulatingTokenCollectionPush,
		[Symbol.iterator]: function* () {
			yield this.value
		}
	}
}
