import { array, functional } from "@hgargg-0710/one"
import type { IMappable } from "../interfaces.js"

const { id } = functional
const { uniqueArr } = array

export class Enum<Type = any> {
	["constructor"]: new (value?: Type[]) => this

	private ensureUnique() {
		this.enumItems = uniqueArr(this.enumItems!)
	}

	private enumItems: Type[] = []

	copy() {
		return new this.constructor(array.copy(this.enumItems!))
	}

	map<Out = any>(mapped: IMappable<Type, Out> = id<Type> as any) {
		return this.enumItems.map(mapped)
	}

	get size() {
		return this.enumItems.length
	}

	join(space: Enum<Type>) {
		this.enumItems.push(...space.map())
		this.ensureUnique()
		return this
	}

	constructor(...enumItems: Type[]) {
		this.enumItems = enumItems
	}
}
