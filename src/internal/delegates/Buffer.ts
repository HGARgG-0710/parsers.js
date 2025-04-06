import type { IBuffer, IIndexed } from "../../interfaces.js"
import { DelegateIterable } from "./Iterable.js"

export abstract class DelegateBuffer<Type = any>
	extends DelegateIterable<Type>
	implements IBuffer<Type>
{
	["constructor"]: new (value: IBuffer<Type>) => typeof this

	protected value: IBuffer<Type>

	get size() {
		return this.value.size
	}

	read(i: number) {
		return this.value.read(i)
	}

	write(i: number, value: Type) {
		this.value.write(i, value)
		return this
	}

	push(...items: Type[]) {
		this.value.push(...items)
		return this
	}

	copy() {
		return new this.constructor(this.value.copy())
	}

	emptied() {
		return new this.constructor(this.value.emptied())
	}

	reverse() {
		this.value.reverse()
		return this
	}

	init(value: IIndexed<Type>) {
		this.value.init(value)
		return this
	}

	get() {
		return this.value.get()
	}

	constructor(value: IBuffer<Type>) {
		super(value)
	}
}
