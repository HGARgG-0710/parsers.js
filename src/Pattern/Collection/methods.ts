import type { Pattern } from "../interfaces.js"
import type { Collection } from "./interfaces.js"
import { value } from "../utils.js"

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

export function accumulatingPatternCollectionPush(
	this: Collection<Pattern>,
	...tokens: Pattern[]
) {
	this.value.value += tokens.map(value).join("")
	return this
}

export function* accumulatingPatternCollectionIterator(this: Pattern) {
	yield this.value
}
