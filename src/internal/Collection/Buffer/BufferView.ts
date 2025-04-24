import { type } from "@hgargg-0710/one"
import assert from "assert"
import type { ICopiable, ISequence } from "../../../interfaces.js"

const { isNumber } = type

export class BufferView<Type = any> implements ICopiable {
	["constructor"]: new (
		offset: number,
		buffer: ISequence<Type>
	) => typeof this

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
		private readonly sequence: ISequence<Type>
	) {
		assert(isNumber(offset))
		assert(offset > 0)
	}
}
