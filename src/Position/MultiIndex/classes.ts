import type { ITreeStream } from "../../Stream/TreeStream/interfaces.js"
import type { IMultiIndex, IMultiIndexModifier } from "./interfaces.js"

import { InitializablePattern } from "../../Pattern/abstract.js"
import { BadIndex } from "../../constants.js"

import { array } from "@hgargg-0710/one"
const { last, first, copy, clear } = array

export class MultiIndexModifier
	extends InitializablePattern<MultiIndex>
	implements IMultiIndexModifier
{
	["constructor"]: new (value?: MultiIndex) => MultiIndexModifier

	nextLevel() {
		return this.extend([0])
	}

	prevLevel() {
		return [this.value!.get().pop() as number]
	}

	resize(length: number = 0) {
		const value = this.value!
		value.levels = length
		return value
	}

	clear() {
		const value = this.value!
		clear(value.get())
		return value
	}

	incLast() {
		const value = this.value!
		const multind = value.get()
		const { levels } = value
		return ++multind[levels - 1]
	}

	decLast() {
		const value = this.value!
		const { levels } = value
		const multind = value.get()
		return --multind[levels - 1]
	}

	extend(subIndex: number[]) {
		this.value!.get().push(...subIndex)
		return subIndex
	}

	copy() {
		return new this.constructor(this.value?.copy())
	}
}

export class MultiIndex
	extends InitializablePattern<number[]>
	implements IMultiIndex
{
	set levels(length: number) {
		this.value!.length = length
	}

	get levels() {
		return this.value!.length
	}

	convert(stream: ITreeStream) {
		let final = 0
		stream.rewind()
		while (!stream.isEnd && !stream.multind.equals(this)) {
			stream.next()
			++final
		}
		return final
	}

	firstLevel() {
		return [first(this.value!)]
	}

	lastLevel() {
		return [last(this.value!)]
	}

	slice(from: number = 0, to: number = this.levels) {
		return this.value!.slice(from, to < 0 ? this.levels + to : to)
	}

	compare(position: MultiIndex) {
		const value = this.value!
		const posval = position.value!

		const { levels } = this
		const { levels: polevs } = position

		const minlen = Math.min(levels, polevs)
		for (let i = 0; i < minlen; ++i)
			if (value[i] !== posval[i]) return value[i] < posval[i]

		return levels < polevs
	}

	equals(position: MultiIndex) {
		const { levels } = this

		if (levels === position.levels) {
			const value = this.value!
			const posval = position.value!

			let i = levels - 1
			while (i > BadIndex && value[i] === posval[i]) --i
			return i === BadIndex
		}

		return false
	}

	copy() {
		return new MultiIndex(copy(this.value!))
	}

	constructor(multind: number[] = []) {
		super(multind)
	}
}
