import type { IPositionObject } from "../../interfaces.js"
import type { IWalkable } from "../../../interfaces.js"

import { InitializablePattern } from "../../../internal/Pattern.js"

import { array } from "@hgargg-0710/one"
const { last, first, copy } = array

export class MultiIndex<Type extends IWalkable<Type> = IWalkable>
	extends InitializablePattern<number[]>
	implements IPositionObject
{
	set levels(length: number) {
		this.value!.length = length
	}

	get levels() {
		return this.value!.length
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

	copy() {
		return new MultiIndex(copy(this.value!))
	}

	constructor(multind: number[] = []) {
		super(multind)
	}
}
