import type { ITreeStream } from "../../interfaces.js"
import { BadIndex } from "../../../constants.js"
import { InitializablePattern } from "../../../internal/Pattern.js"

import { array } from "@hgargg-0710/one"
const { last, first, copy } = array

export class MultiIndex extends InitializablePattern<number[]> {
	set levels(length: number) {
		this.value!.length = length
	}

	get levels() {
		return this.value!.length
	}

	convert(stream: ITreeStream) {
		let final = 0
		stream.rewind()
		while (!stream.isEnd && !stream.pos.equals(this)) {
			stream.next()
			++final
		}
		return final
	}

	first() {
		return first(this.value!)
	}

	last() {
		return last(this.value!)
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
