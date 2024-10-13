import type { BasicTreeStream } from "../../Stream/TreeStream/interfaces.js"
import type { MultiIndex } from "./interfaces.js"
import { MultiIndex as MultiIndexConstructor } from "./classes.js"

import { array } from "@hgargg-0710/one"
const { last, first, copy } = array

export function multiIndexCompare(this: MultiIndex, position: MultiIndex) {
	const thisVal = this.value
	const posVal = position.value
	const minlen = Math.min(thisVal.length, posVal.length)
	for (let i = 0; i < minlen; ++i)
		if (thisVal[i] !== posVal[i]) return thisVal[i] < posVal[i]
	return thisVal.length < posVal.length
}

export function multiIndexEqual(this: MultiIndex, position: MultiIndex) {
	const thisVal = this.value
	const posVal = position.value
	if (thisVal.length !== posVal.length) return false
	let i = posVal.length
	while (i--) if (thisVal[i] !== posVal[i]) return false
	return true
}

export function multiIndexCopy(this: MultiIndex) {
	return new MultiIndexConstructor(copy(this.value))
}

export function multiIndexSlice(
	this: MultiIndex,
	from: number = 0,
	to: number = this.value.length
) {
	return this.value.slice(from, to < 0 ? this.value.length + to : to)
}

export function multiIndexFirstLevel(this: MultiIndex): number[] {
	return [first(this.value)]
}

export function multiIndexLastLevel(this: MultiIndex): number[] {
	return [last(this.value)]
}

export function multiIndexConvert(this: MultiIndex, stream: BasicTreeStream) {
	let final = 0
	stream.rewind()
	while (!stream.isEnd && !this.equals(stream.pos)) {
		stream.next()
		++final
	}
	return final
}

export * as MultiIndexModifier from "./MultiIndexModifier/methods.js"
