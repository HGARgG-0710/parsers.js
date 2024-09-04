import type { Token } from "../Token/interfaces.js"
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
export function accumulatingTokenCollectionPush(...tokens: Token[]) {
	this.value.value += tokens.map((x) => x.value).join("")
	return this
}

export function* accumulatingTokenCollectionIterator(this: Token) {
	yield this.value
}
