import type { TreeStream } from "../../Stream/TreeStream/interfaces.js"
import type { MultiIndexModifier as MultiIndexModifierType } from "./interfaces.js"
import type { MultiIndex as MultiIndexType } from "./interfaces.js"

import { BadIndex, defaults } from "../../constants.js"
const { DefaultValue } = defaults.MultiIndex

import { array } from "@hgargg-0710/one"
const { last, first, copy, clear } = array

export class MultiIndex implements MultiIndexType {
	#value: number[]

	static MultiIndexModifier = class MultiIndexModifier
		implements MultiIndexModifierType
	{
		#multind: MultiIndex

		nextLevel() {
			return this.extend([0])
		}

		prevLevel() {
			return [this.#multind.#value.pop() as number]
		}

		resize(length: number = 0) {
			const multind = this.#multind
			multind.levels = length
			return multind
		}

		clear() {
			const multind = this.#multind
			clear(multind.#value)
			return multind
		}

		incLast() {
			const multind = this.#multind
			const value = multind.#value
			const { levels } = multind
			return ++value[levels - 1]
		}

		decLast() {
			const multind = this.#multind
			const { levels } = multind
			const value = multind.#value
			return --value[levels - 1]
		}

		extend(subIndex: number[]) {
			this.#multind.#value.push(...subIndex)
			return subIndex
		}

		init(multind?: MultiIndex) {
			if (multind) this.#multind = multind
			return this
		}

		constructor(value?: MultiIndex) {
			this.init(value)
		}
	}

	set levels(length: number) {
		this.#value.length = length
	}

	get levels() {
		return this.#value.length
	}

	get() {
		return this.#value as readonly number[]
	}

	convert(stream: TreeStream) {
		let final = 0
		stream.rewind()
		while (!stream.isEnd && !stream.multind.equals(this)) {
			stream.next()
			++final
		}
		return final
	}

	firstLevel() {
		return [first(this.#value)]
	}

	lastLevel() {
		return [last(this.#value)]
	}

	slice(from: number = 0, to: number = this.levels) {
		return this.#value.slice(from, to < 0 ? this.levels + to : to)
	}

	compare(position: MultiIndex) {
		const value = this.#value
		const posval = position.#value

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
			const value = this.#value
			const posval = position.#value

			let i = levels - 1
			while (i > BadIndex && value[i] === posval[i]) --i
			return i === BadIndex
		}

		return false
	}

	copy() {
		return new MultiIndex(copy(this.#value))
	}

	constructor(multind: number[] = DefaultValue()) {
		this.#value = multind
	}
}

export namespace MultiIndex {
	export type MultiIndexModifier = InstanceType<
		(typeof MultiIndex)["MultiIndexModifier"]
	>
}
