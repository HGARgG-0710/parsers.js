import { functional } from "@hgargg-0710/one"
import assert from "assert"
import type { IMappable } from "../interfaces.js"

const { id } = functional

export class Enum<Type = any> {
	private ["constructor"]: new (...value: Type[]) => this

	private readonly enumItems: Type[]
	private readonly setItems: Set<Type>

	private assertDisjoint(space: Enum<Type>) {
		assert.strictEqual(space.setItems.intersection(this.setItems).size, 0)
	}

	copy() {
		return new this.constructor(...this.enumItems)
	}

	map<Out = any>(mapped: IMappable<Type, Out> = id<Type> as any) {
		return this.enumItems.map(mapped)
	}

	get size() {
		return this.enumItems.length
	}

	join(space: Enum<Type>) {
		return new this.constructor(...this.enumItems.concat(space.enumItems))
	}

	unite(space: Enum<Type>) {
		this.assertDisjoint(space)
		return this.join(space)
	}

	constructor(...enumItems: Type[]) {
		this.setItems = new Set(enumItems)
		this.enumItems = Array.from(this.setItems)
	}
}
