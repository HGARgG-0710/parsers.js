import { array, functional, object, type } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import assert from "assert"
import { Composition } from "src/internal/Composition.js"
import { BasicHash } from "../HashMap/classes.js"
import { MapInternal } from "../HashMap/InternalHash/classes.js"
import type { ICopiable, IInitializable } from "../interfaces.js"
import { Autocache } from "../internal/Autocache.js"
import { CallbackBuffer } from "../internal/Collection/Sequence/CallbackBuffer.js"
import { IndexSet } from "../internal/IndexSet.js"
import type {
	IComplexComposition,
	IDynamicParser,
	IFunctionTuple,
	IParserState,
	ISignatureCallback
} from "./interfaces.js"

const { argFiller } = functional
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor
const { isNumber, isArray } = type

export class Signature implements ICopiable, IInitializable {
	protected readonly toApplyOn: IndexSet
	protected readonly preIndexes: IndexSet
	protected preFill: any[];

	["constructor"]: new (
		arity: number,
		toApplyOn: number[],
		preIndexes: number[]
	) => this

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
		assert(isNumber(arity))
		assert(isArray(toApplyOn))
		assert(isArray(preIndexes))

		this.toApplyOn = new IndexSet(this.arity, toApplyOn)
		this.preIndexes = new IndexSet(this.arity, preIndexes)
	}
}

abstract class PreComplexComposition<
		StateType extends Summat = Summat,
		ArgType extends any[] = any[],
		OutType = any
	>
	extends Composition<ArgType, OutType>
	implements IComplexComposition<StateType>
{
	#original: Function[] = []
	#state: StateType | undefined = undefined

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
		return this.#state
	}

	protected stateMaker?: (thisArg: IComplexComposition) => StateType

	protected makeState() {
		this.#state = this.stateMaker?.(this)
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

export const ComplexComposition = new Autocache(
	new BasicHash(new MapInternal()),
	function <StateType extends Summat = Summat>(
		stateMaker?: (thisArg: IComplexComposition) => StateType
	) {
		class complexComposition<
			ArgType extends any[] = any[],
			OutType = any
		> extends PreComplexComposition<StateType, ArgType, OutType> {}

		extendPrototype(complexComposition, {
			stateMaker: ConstDescriptor(stateMaker)
		})

		return complexComposition
	}
) as unknown as <StateType extends Summat = Summat>(
	stateMaker?: (thisArg: IComplexComposition) => StateType
) => new (layers?: Function[]) => IComplexComposition<StateType>

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

// * pre-doc note: this is intended for usage WITHOUT the self-modification of the parser;
// useful for error-handling [see ErrorHandler] and other such operations;
export const CommonParser = ComplexComposition()
