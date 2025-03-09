import type { ArrayEnum } from "./interfaces.js"
import type { Mappable } from "../interfaces.js"

import { defaults } from "../constants.js"
const { size: globalSize } = defaults.EnumSpace

import { functional, inplace, object } from "@hgargg-0710/one"
const { id } = functional
const { out } = inplace
const { empty } = object

export class ConstEnum implements ArrayEnum<{}> {
	protected value: {}[] = []

	set size(newSize: number) {
		const diff = this.size - newSize
		if (diff < 0) this.add(-diff)
		else out(this.value, newSize, diff)
	}

	get size() {
		return this.value.length
	}

	add(size: number) {
		this.value.push(...Array.from({ length: size }, empty))
		return this
	}

	join(enums: ArrayEnum<{}>) {
		this.value.push(...enums.get())
		return this
	}

	copy() {
		return new ConstEnum(this.size)
	}

	map(mapped: Mappable<{}> = id) {
		return this.value.map(mapped)
	}

	get() {
		return this.value as readonly {}[]
	}

	constructor(size: number = globalSize) {
		this.size = size
	}
}
