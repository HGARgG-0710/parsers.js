import { array, type } from "@hgargg-0710/one"
import assert from "assert"
import type {
	IUnfreezableSequence,
	IWritableSequence
} from "../../../interfaces.js"
import { TypicalUnfreezable } from "./TypicalUnfreezable.js"

const { isArray } = type

export class OutputBuffer<Type = any>
	extends TypicalUnfreezable<Type>
	implements IUnfreezableSequence<Type>, IWritableSequence<Type>
{
	protected collection: Type[]

	push(...elements: Type[]) {
		if (!this.isFrozen) this.collection.push(...elements)
		return this
	}

	get() {
		return super.get() as readonly Type[]
	}

	copy() {
		return new this.constructor(array.copy(this.collection))
	}

	write(i: number, value: Type) {
		if (!this.isFrozen) this.collection[i] = value
		return this
	}

	constructor(value: Type[] = []) {
		assert(isArray(value))
		super(value)
	}
}
