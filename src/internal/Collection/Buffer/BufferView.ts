import { type } from "@hgargg-0710/one"
import assert from "assert"
import type { IBuffer, ICopiable } from "../../../interfaces.js"

const { isNumber } = type

export class BufferView<Type = any> implements ICopiable {
	["constructor"]: new (offset: number, buffer: IBuffer<Type>) => typeof this

	//
	// * Interface Methods
	//

	copy() {
		return new this.constructor(this.offset, this.buffer)
	}

	read(i: number) {
		return this.buffer.read(this.offset + i)
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
		private readonly buffer: IBuffer<Type>
	) {
		assert(isNumber(offset))
		assert(offset > 0)
	}
}
