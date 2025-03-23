import { InitializablePattern } from "./Pattern.js"
import { MultiIndex } from "src/Position/classes/MultiIndex.js"
import { array } from "@hgargg-0710/one"

export class MultiIndexModifier extends InitializablePattern<MultiIndex> {
	["constructor"]: new (value?: MultiIndex) => MultiIndexModifier

	nextLevel() {
		this.extend([0])
	}

	prevLevel() {
		return this.value!.get().pop()!
	}

	resize(length: number = 0) {
		const value = this.value!
		value.levels = length
		return value
	}

	clear() {
		const value = this.value!
		array.clear(value.get())
		return value
	}

	incLast() {
		const value = this.value!
		const multind = value.get()
		const { levels } = value
		++multind[levels - 1]
	}

	decLast() {
		const value = this.value!
		const { levels } = value
		const multind = value.get()
		--multind[levels - 1]
	}

	extend(subIndex: number[]) {
		this.value!.get().push(...subIndex)
	}

	copy() {
		return new this.constructor(this.value?.copy())
	}

	constructor(value = new MultiIndex()) {
		super(value)
	}
}
