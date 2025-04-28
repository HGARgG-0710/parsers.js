import { array, inplace, type } from "@hgargg-0710/one"
import assert from "assert"
import type { IDynamicSequence } from "../../interfaces.js"
import { TypicalBuffer } from "./TypicalBuffer.js"

const { isFunction } = type
const { insert, out } = inplace

export class CallbackBuffer<Type = any>
	extends TypicalBuffer<Type>
	implements IDynamicSequence<Type>
{
	["constructor"]: new (
		callback: (thisArg: IDynamicSequence<Type>) => void,
		value?: Type[]
	) => this

	private registerChange() {
		this.callback(this)
	}

	emptied() {
		return new this.constructor(this.callback)
	}

	truncate(from: number, to: number = this.size) {
		this.collection = this.collection.slice(from, to)
		this.registerChange()
		return this
	}

	remove(i: number, count = 1) {
		out(this.collection, i, count)
		this.registerChange()
		return this
	}

	insert(i: number, ...values: Type[]) {
		insert(this.collection, i, ...values)
		this.registerChange()
		return this
	}

	init(value?: Type[] | undefined): this {
		if (value) {
			this.collection = value
			this.registerChange()
		}
		return this
	}

	push(...x: Type[]): this {
		super.push(...x)
		this.registerChange()
		return this
	}

	write(i: number, value: Type): this {
		super.write(i, value)
		this.registerChange()
		return this
	}

	copy() {
		return new this.constructor(this.callback, array.copy(this.collection))
	}

	*[Symbol.iterator]() {
		yield* this.collection
	}

	constructor(
		private readonly callback: (thisArg: IDynamicSequence<Type>) => void,
		collection?: Type[]
	) {
		assert(isFunction(callback))
		super(collection)
	}
}
