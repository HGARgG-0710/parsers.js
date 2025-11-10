import { type } from "@hgargg-0710/one"
import assert from "assert"
import type {
	IConcreteReadable,
	IInitializable,
	IReadable
} from "../interfaces.js"

const { isNumber } = type

type IView<T = any> = IReadable<T> & IInitializable<[IReadable<T>]>

/**
 * This is a class representing an offset to an `IReadable`.
 * Serves to implement the `.peek(n: number)` method of the `InputStream`.
 */
export class ReadableView<T = any> implements IView<T> {
	private ["constructor"]: new (
		offset: number,
		sequence: IConcreteReadable<T>
	) => this

	private readable: IConcreteReadable<T>

	copy() {
		return new this.constructor(this.offset, this.readable)
	}

	read(i: number) {
		return this.readable.read(this.offset + i)
	}

	init(readable?: IConcreteReadable<T>) {
		if (readable) this.readable = readable
		return this
	}

	has(n: number) {
		return this.readable.size - this.offset > n
	}

	forward(n: number = 1) {
		this.offset += n
	}

	constructor(private offset: number, readable?: IConcreteReadable<T>) {
		assert(isNumber(offset))
		assert(offset >= 0)
		this.init(readable)
	}
}
