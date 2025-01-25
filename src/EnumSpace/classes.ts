import type { MarkedTokenType, TokenInstanceClass } from "../Token/interfaces.js"
import type { ArrayEnum, EnumSpace, Mappable } from "./interfaces.js"

import { TokenType, TokenInstance } from "../Token/classes.js"

import { defaults } from "../constants.js"
const { size: globalSize, DefaultValue: value } = defaults.EnumSpace

import { functional, inplace } from "@hgargg-0710/one"
const { id } = functional
const { out } = inplace

export class ConstEnum implements ArrayEnum<{}> {
	#value: {}[] = value()
	#size: number

	set size(newSize: number) {
		const diff = this.#size - newSize
		if (diff < 0) this.add(-diff)
		else out(this.#value, newSize, diff)
	}

	get size() {
		return this.#size
	}

	add(size: number) {
		this.#value.push(...Array.from({ length: size }, () => ({})))
		this.#size += size
		return this
	}

	join(enums: ArrayEnum<{}>) {
		this.#value.push(...enums.get())
		this.#size += enums.size
		return this
	}

	copy() {
		return new ConstEnum(this.size)
	}

	map(mapped: Mappable<{}> = id) {
		return this.#value.map(mapped)
	}

	get() {
		return this.#value as readonly {}[]
	}

	constructor(size: number = globalSize) {
		this.size = size
	}
}

export const [TokenInstanceEnum, SimpleTokenTypeEnum] = [TokenInstance, TokenType].map(
	(f) => (enums: EnumSpace) => enums.map(f)
) as [(enums: EnumSpace) => TokenInstanceClass[], (enums: EnumSpace) => MarkedTokenType[]]
