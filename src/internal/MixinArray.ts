import assert from "assert"
import { type } from "@hgargg-0710/one"

const { isArray } = type

export class MixinArray<Type = any> {
	write(i: number, value: Type) {
		this.items[i] = value
		return this
	}

	push(...x: Type[]) {
		this.items.push(...x)
		return this
	}

	read(i: number) {
		return this.items[i]
	}

	protected set size(newSize: number) {
		this.items.length = newSize
	}

	get size() {
		return this.items.length
	}

	get() {
		return this.items as readonly Type[]
	}

	*[Symbol.iterator]() {
		for (let i = 0; i < this.size; ++i) yield this.read(i)
	}

	constructor(protected items: Type[] = []) {
		assert(isArray(items))
	}
}

export class InitializableMixin<Type = any> extends MixinArray<Type> {
	init(items: Type[]) {
		this.items = items
		return this
	}
}
