import type { BasicTreeStream } from "../interfaces.js"
import type { MultiIndex } from "./interfaces.js"
import { MultiIndex as MultiIndexConstructor } from "./classes.js"

import { array } from "@hgargg-0710/one"
const { last, first } = array

export function multiIndexCompare(this: MultiIndex, position: MultiIndex) {
	const minlen = Math.min(this.value.length, position.value.length)
	for (let i = 0; i < minlen; ++i)
		if (this.value[i] !== position.value[i]) return this.value[i] < position.value[i]
	return this.value.length < position.value.length
}

export function multiIndexEqual(this: MultiIndex, position: MultiIndex) {
	if (this.value.length !== position.value.length) return false
	const thisVal = this.value
	const posVal = position.value
	let length = position.value.length
	while (length--) if (thisVal[length] !== posVal[length]) return false
	return true
}

export function multiIndexCopy(this: MultiIndex) {
	return new MultiIndexConstructor(([] as number[]).concat(this.value))
}

export function multiIndexSlice(
	this: MultiIndex,
	from: number = 0,
	to: number = this.value.length
) {
	this.slicer.reSlice(from, to < 0 ? this.value.length + to : to)
	return this.slicer
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
export * as Slicer from "./Slicer/methods.js"
