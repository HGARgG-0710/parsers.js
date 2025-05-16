import { type } from "@hgargg-0710/one"
import assert from "assert"
import type { ICopiable, IInitializable, IReadable } from "../interfaces.js"

const { isNumber } = type

type IView<Type = any> = ICopiable &
	IReadable<Type> &
	IInitializable<[IReadable<Type>]>

export class ReadableView<Type = any> implements IView<Type> {
	private ["constructor"]: new (
		offset: number,
		sequence: IReadable<Type>
	) => this

	private readable: IReadable<Type>

	//
	// * Interface Methods
	//

	copy() {
		return new this.constructor(this.offset, this.readable)
	}

	read(i: number) {
		return this.readable.read(this.offset + i)
	}

	init(readable?: IReadable<Type>) {
		if (readable) this.readable = readable
		return this
	}

	//
	// * Non-interface Methods
	//

	backward() {
		--this.offset
	}

	forward() {
		++this.offset
	}

	constructor(private offset: number, readable?: IReadable<Type>) {
		assert(isNumber(offset))
		assert(offset > 0)
		this.init(readable)
	}
}
