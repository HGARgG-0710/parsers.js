import { type } from "@hgargg-0710/one"
import assert from "assert"
import type { ICopiable, IInitializable, IReadable } from "../interfaces.js"

const { isNumber } = type

type IView<T = any> = ICopiable & IReadable<T> & IInitializable<[IReadable<T>]>

/**
 * This is a class representing an offset to an `IReadable`.
 * Serves to implement the `.peek(n: number)` method of the `InputStream`.
 */
export class ReadableView<T = any> implements IView<T> {
	private ["constructor"]: new (
		offset: number,
		sequence: IReadable<T>
	) => this

	private readable: IReadable<T>

	//
	// * Interface Methods
	//

	copy() {
		return new this.constructor(this.offset, this.readable)
	}

	read(i: number) {
		return this.readable.read(this.offset + i)
	}

	init(readable?: IReadable<T>) {
		if (readable) this.readable = readable
		return this
	}

	//
	// * Non-interface Methods
	//

	backward() {
		if (this.offset > 0) --this.offset
	}

	forward() {
		++this.offset
	}

	constructor(private offset: number, readable?: IReadable<T>) {
		assert(isNumber(offset))
		assert(offset >= 0)
		this.init(readable)
	}
}
