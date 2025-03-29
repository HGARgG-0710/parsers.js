import type { IDynamicBuffer, IIndexed } from "../interfaces.js"
import { ArrayCollection } from "../Collection/classes.js"

import { array, inplace } from "@hgargg-0710/one"
const { insert, out } = inplace

export abstract class TypicalBuffer<Type = any> extends ArrayCollection<Type> {
	read(i: number) {
		return this.value[i]
	}

	write(i: number, value: Type) {
		this.value[i] = value
		return this
	}
}

export class CallbackBuffer<Type = any>
	extends TypicalBuffer<Type>
	implements IDynamicBuffer<Type>
{
	["constructor"]: new (
		callback: (thisArg: IDynamicBuffer<Type>) => void,
		value?: Type[]
	) => typeof this

	protected registerChange() {
		this.callback(this)
	}

	emptied() {
		return new this.constructor(this.callback)
	}

	truncate(from: number, to: number = this.size) {
		this.value = this.value.slice(from, to)
		this.callback(this)
		return this
	}

	remove(i: number, count = 1) {
		out(this.value, i, count)
		this.registerChange()
		return this
	}

	insert(i: number, ...values: Type[]) {
		insert(this.value, i, ...values)
		this.registerChange()
		return this
	}

	init(value?: IIndexed<Type> | undefined): void {
		super.init(value)
		if (value) this.registerChange()
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
		return new this.constructor(this.callback, array.copy(this.value))
	}

	constructor(
		protected readonly callback: (thisArg: IDynamicBuffer<Type>) => void,
		value?: Type[]
	) {
		super(value)
	}
}
