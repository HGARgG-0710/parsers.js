import type { Summat } from "@hgargg-0710/summat.ts"
import type { ICopiable, IInitializable } from "../../interfaces.js"
import type {
	IComplexComposition,
	IDynamicParser,
	IParserState,
	ISignatureCallback
} from "./interfaces.js"

import type { IFunctionTuple } from "../interfaces.js"

import { IndexSet } from "../../internal/IndexSet.js"
import { CallbackBuffer } from "../../internal/Collection/Buffer/CallbackBuffer.js"

import { Composition } from "../classes.js"

import { array, object, functional } from "@hgargg-0710/one"
import { BasicHash } from "../../HashMap/classes.js"
import { MapInternal } from "../../HashMap/InternalHash/classes.js"
const { argFiller } = functional
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor

export class Signature
	implements ICopiable, IInitializable<[any[]], Signature>
{
	protected readonly toApplyOn: IndexSet
	protected readonly preIndexes: IndexSet
	protected preFill: any[];

	["constructor"]: new (
		arity: number,
		toApplyOn: number[],
		preIndexes: number[]
	) => typeof this

	apply(layers: Function[]) {
		const { preIndexes, preFill, toApplyOn } = this
		const accessSet = new Set(toApplyOn)
		return layers.map((layer: Function, i: number) =>
			accessSet.has(i)
				? argFiller(layer)(...Array.from(preIndexes))(...preFill)
				: layer
		)
	}

	copy() {
		return new this.constructor(
			this.arity,
			Array.from(this.toApplyOn),
			Array.from(this.preIndexes)
		)
	}

	init(preFill: any[]) {
		this.preFill = array.copy(preFill)
		return this
	}

	constructor(
		public readonly arity: number,
		toApplyOn: number[],
		preIndexes: number[]
	) {
		this.toApplyOn = new IndexSet(this.arity, toApplyOn)
		this.preIndexes = new IndexSet(this.arity, preIndexes)
	}
}

const generics = new BasicHash(new MapInternal())

abstract class PreComplexComposition<
		StateType extends Summat = Summat,
		ArgType extends any[] = any[],
		OutType = any
	>
	extends Composition<ArgType, OutType>
	implements IComplexComposition<StateType>
{
	#original: Function[] = []
	#state: StateType | null = null

	readonly layers: IFunctionTuple = new CallbackBuffer(
		function (
			this: PreComplexComposition<StateType, ArgType, OutType>,
			buffer: CallbackBuffer<Function>
		) {
			this.merge(buffer)
			this.#original = buffer.get() as Function[]
		}.bind(this)
	)

	get state() {
		return this.#state!
	}

	protected stateMaker: (thisArg: IComplexComposition) => StateType

	protected makeState() {
		this.#state = this.stateMaker(this)
		return this
	}

	init(callback: ISignatureCallback<StateType>) {
		let layers = array.copy(this.#original)
		for (const signature of callback(this.makeState()))
			layers = signature.apply(layers)
		this.layers.init(layers)
		return this
	}
}

export function ComplexComposition<StateType extends Summat = Summat>(
	stateMaker: (thisArg: IComplexComposition) => StateType
): new (layers?: Function[]) => IComplexComposition<StateType> {
	const cachedClass = generics.index(stateMaker)
	if (cachedClass) return cachedClass

	class complexComposition<
		ArgType extends any[] = any[],
		OutType = any
	> extends PreComplexComposition<StateType, ArgType, OutType> {}

	extendPrototype(complexComposition, {
		stateMaker: ConstDescriptor(stateMaker)
	})

	// * caching the class
	generics.set(stateMaker, complexComposition)

	return complexComposition
}

/**
 * Returns an `IParserState` object with `x` as the value of the
 * `parser` property.
 *
 * Incredibly useful for self-modifying parsers.
 * Employed by the library's `DynamicParser`.
 */
export const ParserState = (x: IDynamicParser): IParserState => ({ parser: x })

// * important pre-doc note: *THE* Holy Grail of this library [to which StreamParser is second], towards which ALL has been building - The Lord Self-Modifying Parser Cometh!
// ! important things to keep in mind [for future docs]:
// * 1. `callback` USES the passed `.state` property when it needs it
// * 2. THE USER controls how the 'signature's operate precisely
export const DynamicParser: new (layers?: Function[]) => IDynamicParser =
	ComplexComposition(ParserState)
