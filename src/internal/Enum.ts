import { functional, array } from "@hgargg-0710/one"
import assert from "assert"
import type { IMappable } from "../interfaces.js"
import { toPairs } from "../utils/IndexMap.js"

const { id } = functional
const { first, firstOut } = array

export class Enum<Type = any> {
	private ["constructor"]: new (value: Type[]) => this

	private readonly enumItems: Type[]
	private readonly setItems: Set<Type>

	private static combinedItems(...spaces: Enum[]) {
		return first(spaces).enumItems.concat(
			...firstOut(spaces).map((x) => x.enumItems)
		)
	}

	static assertDisjoint(...spaces: Enum[]) {
		const combined = Enum.combinedItems(...spaces)
		assert.strictEqual(new Set(combined).size, combined.length)
	}

	copy() {
		return new this.constructor(this.enumItems)
	}

	toMap<Out = any>(mapped: IMappable<Type, Out> = id<Type> as any) {
		return new Map(toPairs(this.enumItems, this.enumItems.map(mapped)))
	}

	constructor(enumItems: Type[]) {
		this.setItems = new Set(enumItems)
		this.enumItems = Array.from(this.setItems)
	}
}

export class MapConcatenator {
	static concat<K = any, V = any>(...maps: Map<K, V>[]) {
		return new Map(
			maps
				.map((m) =>
					toPairs(Array.from(m.keys()), Array.from(m.values()))
				)
				.flat(1)
		)
	}
}
