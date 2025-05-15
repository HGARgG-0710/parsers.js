import { type } from "@hgargg-0710/one"
import assert from "assert"
import type { ICopiable, IReadable } from "../interfaces.js"

const { isNumber } = type

export class ReadableView<Type = any> implements ICopiable, IReadable<Type> {
	private ["constructor"]: new (
		offset: number,
		buffer: IReadable<Type>
	) => this

	//
	// * Interface Methods
	//

	copy() {
		return new this.constructor(this.offset, this.sequence)
	}

	read(i: number) {
		return this.sequence.read(this.offset + i)
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

	constructor(
		private offset: number,
		private readonly sequence: IReadable<Type>
	) {
		assert(isNumber(offset))
		assert(offset > 0)
	}
}
