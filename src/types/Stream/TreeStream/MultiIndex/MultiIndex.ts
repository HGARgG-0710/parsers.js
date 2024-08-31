import { Slicer } from "../../../Slicer.js"
import type { TreeStream } from "../../TreeStream.js"
import type { MultiIndex } from "../MultiIndex.js"

import { array } from "@hgargg-0710/one"
import { MultiIndexModifier } from "./MultiIndexModifier.js"
const { last, first } = array

export function multiIndexCompare(this: MultiIndex, position: MultiIndex) {
	const minlen = Math.min(this.value.length, position.value.length)
	for (let i = 0; i < minlen; ++i)
		if (this.value[i] !== position.value[i]) return this.value[i] < position.value[i]
	return this.value.length < position.value.length
}

export function multiIndexEqual(this: MultiIndex, position: MultiIndex) {
	if (this.value.length !== position.value.length) return false
	return this.value.every((x: number, i: number) => x === position.value[i])
}

export function multiIndexCopy(this: MultiIndex) {
	return MultiIndex([...this.value])
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

export function multiIndexConvert(this: MultiIndex, stream: TreeStream) {
	let final = 0
	stream.rewind()
	while (!stream.isEnd && !this.equals(stream.pos)) {
		stream.next()
		++final
	}
	return final
}

export function MultiIndex(multindex: number[]): MultiIndex {
	const T = {
		value: multindex,
		convert: multiIndexConvert,
		compare: multiIndexCompare,
		equals: multiIndexEqual,
		copy: multiIndexCopy,
		slicer: Slicer(multindex),
		slice: multiIndexSlice,
		firstLevel: multiIndexFirstLevel,
		lastLevel: multiIndexLastLevel
	} as unknown as MultiIndex
	T.modifier = MultiIndexModifier(T)
	return T
}
