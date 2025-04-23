import { functional } from "@hgargg-0710/one"
import type {
	IComposition,
	IFunctionTuple
} from "../DynamicParser/interfaces.js"
import type { IDynamicBuffer } from "../interfaces.js"
import { Callable } from "./Callable.js"
import { CallbackBuffer } from "./Collection/Buffer/CallbackBuffer.js"

const { trivialCompose, id } = functional

export class Composition<ArgType extends any[] = any[], OutType = any>
	extends Callable
	implements IComposition
{
	readonly layers: IFunctionTuple = new CallbackBuffer(this.merge.bind(this))

	protected merged: (...x: ArgType) => OutType = id as any

	protected merge(buffer: IDynamicBuffer<Function>) {
		this.merged = trivialCompose(...buffer)
	}

	["constructor"]: new (layers?: Function[]) => Composition

	protected __call__(...x: ArgType) {
		return this.merged(...x)
	}

	copy() {
		return new this.constructor(this.layers.get() as Function[])
	}

	constructor(layers?: Function[]) {
		super()
		if (layers) this.layers.init(layers)
	}
}
