import type { Pattern } from "../interfaces.js"
import { Token as TokenClass } from "../Token/classes.js"
import type { Collection } from "./interfaces.js"

export function stringCollectionPush(...x: string[]) {
	this.value += x.join("")
	return this
}

export function* stringCollectionIterator(this: Collection<string>) {
	let i = 0
	while (this.value.length > i) {
		yield this.value[i]
		++i
	}
}

export function accumulatingTokenCollectionPush(
	this: Collection<Pattern>,
	...tokens: Pattern[]
) {
	this.value.value += tokens.map(TokenClass.value).join("")
	return this
}

export function* accumulatingTokenCollectionIterator(this: Pattern) {
	yield this.value
}
