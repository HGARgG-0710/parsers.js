import { array, functional } from "@hgargg-0710/one"
import assert from "assert"
import type { IMappable } from "../interfaces.js"
import { Pairs } from "../samples.js"

const { id } = functional
const { first, firstOut } = array

export class Enum<T = any> {
	private ["constructor"]: new (value: T[]) => this

	private readonly enumItems: T[]
	private readonly setItems: Set<T>

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

	toMap<Out = any>(mapped: IMappable<T, Out> = id<T> as any) {
		return new Map(
			Pairs.to(this.enumItems, this.enumItems.map(mapped))
		)
	}

	constructor(enumItems: T[]) {
		this.setItems = new Set(enumItems)
		this.enumItems = Array.from(this.setItems)
	}
}

export class MapConcatenator {
	static concat<K = any, V = any>(...maps: Map<K, V>[]) {
		return new Map(
			maps
				.map((m) =>
					Pairs.to(Array.from(m.keys()), Array.from(m.values()))
				)
				.flat(1)
		)
	}
}
