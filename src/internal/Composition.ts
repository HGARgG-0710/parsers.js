import { functional, type } from "@hgargg-0710/one"
import assert from "assert"
import type {
	IComposition,
	IFunctionTuple
} from "../DynamicParser/interfaces.js"
import type { IDynamicSequence } from "../interfaces.js"
import { Callable } from "./Callable.js"
import { CallbackBuffer } from "./Buffer/CallbackBuffer.js"

const { trivialCompose, id } = functional
const { isArray } = type

export class Composition<ArgType extends any[] = any[], OutType = any>
	extends Callable
	implements IComposition
{
	["constructor"]: new (layers?: Function[]) => this

	readonly layers: IFunctionTuple = new CallbackBuffer(this.merge.bind(this))

	protected merged: (...x: ArgType) => OutType = id as any

	protected merge(buffer: IDynamicSequence<Function>) {
		this.merged = trivialCompose(...buffer)
	}

	protected __call__(...x: ArgType) {
		return this.merged(...x)
	}

	copy() {
		return new this.constructor(this.layers.get() as Function[])
	}

	constructor(layers?: Function[]) {
		super()
		assert(isArray(layers))

		if (layers) this.layers.init(layers)
	}
}
