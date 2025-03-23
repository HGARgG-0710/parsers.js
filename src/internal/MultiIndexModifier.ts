import { InitializablePattern } from "./Pattern.js"
import type { MultiIndex } from "src/Position/classes/MultiIndex.js"

import { array } from "@hgargg-0710/one"
const { clear } = array

export class MultiIndexModifier extends InitializablePattern<MultiIndex> {
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
