import type { Summat } from "@hgargg-0710/summat.ts"
import type { ICopiable } from "../../../interfaces.js"

import type {
	IPreSignature,
	ILayerSignature,
	IStateSignature
} from "./interfaces.js"

import { applySignature } from "./utils.js"

import { Composition } from "../classes.js"

import { array, functional, boolean } from "@hgargg-0710/one"
const { sort, numbers } = array
const { negate, has } = functional
const { eqcurry } = boolean

export const PreSignature = (
	preSignature: IndexSet,
	preSignatureFill: any[]
): IPreSignature => ({
	preSignature,
	preSignatureFill
})

export const LayerSignature = (
	signature: IPreSignature,
	toApplyOn: IndexSet
): ILayerSignature => ({
	...signature,
	toApplyOn
})

export const StateSignature = (
	signature: ILayerSignature,
	stateIndex: number,
	stateTransform: (x: Summat) => Summat
): IStateSignature => ({
	...signature,
	stateIndex,
	stateTransform
})

export class IndexSet implements ICopiable, Iterable<number> {
	protected readonly asArray: number[]
	protected readonly asSet: Set<number>;

	["constructor"]: new (arity: number, indexes: number[]) => IndexSet

	keepOut(x: number) {
		return new IndexSet(this.length, this.asArray.filter(negate(eqcurry(x))))
	}

	complement() {
		return new IndexSet(
			this.length,
			numbers(this.length).filter(negate(has(this.asSet)))
		)
	}

	*[Symbol.iterator]() {
		yield* this.asArray
	}

	subtract(x: IndexSet) {
		return new IndexSet(
			this.length,
			this.asArray.filter(negate(has(new Set(x))))
		)
	}

	has(x: number): boolean {
		return this.asSet.has(x)
	}

	copy() {
		return new this.constructor(this.length, this.asArray)
	}

	constructor(public readonly length: number, indexes: number[]) {
		this.asArray = sort(
			Array.from((this.asSet = new Set(indexes.filter((x) => x < length))))
		)
	}
}

// * important pre-doc note: *THE* Holy Grail of this library [to which StreamParser is second], towards which ALL has been building - The Lord Self-Modifying Parser Cometh!
// ! important things to keep in mind [for future docs]:
// * 1. Signatures for given 'Function's [except for last one] used have form: f(value [0], ... [preFilledSignature], state [stateIndex], ... [preFilledSignature])
// * 2. The LAST "entry" function can have ANY 'preFilledSignature'

// ! PROBLEM: *cannot* use multiple signatures here:
// 	* Reason:
// 		1. we are ALREADY using the `this.state` here.
// 		2. the 'this.state' is needed ONLY FOR THE *LAST* signature
// TODO: decouple:
// 		* 1. REMOVE the `copy(state)` from `applySignature`;
// 		* 2. REMOVE the `stateTransform` thing;
// 		* 3. '.toApplyOn', '.preSignature' (rename to "preIndexes") and `preSignatureFill (rename to "preFill")` REMAIN
// 		* 4. merge `ILayerSignature` with `IPreSignature` into `ISignature`
// 		* 5. remove `IStateSignature` (stateIndex goes as well)
// 		* 6. DECOUPLE definition of `{ parser: this }` into:
// 			1. a util 'parserState = (parser) => ({parser})'
// 			2. a property 'protected stateMaker: (parser: DynamicParser) => Summat'
// 			3. a call to 'this.stateMaker()' [which produces a new state EACH TIME the user calls `.init()`, BUT WHICH IS SYNCHRONIZED!]
// 			4. a getter-only property `this.state`, which returns the CURRENTLY CACHED `this.#state` [which is a result of `this.stateMaker(this)` - a protected method called `makeState()`]
// 			5. A USER-PASSED "signatureMaker" CALLBACK, which:
// 				1. takes in the `state` property
// 				2. returns the `signatures` to be used
// 		* 7. 'applySignature' - SIMPLIFY: 
// 			1. remove the `state` [and its applications]
// 			2. sync with the rest of the changes
// * 		3. replace with a new `Signature` class: 
// 				0. Replaces the `ISignature` object
// 				1. takes in the LIST OF ARGUMENTS [constructor, protected, ONLY ONCE]: 
// 					1. toApplyOn: 
// 						1. this is ALSO a `number[]` - SEE THE ``
// 					2. arity
// 					3. preIndexes: 
// 						1. this is a `number[]`
// 						2. the `IndexSet` GOES PRIVATE [id est, into `internal`], and is USED here to construct the item FROM the given `number[]`; 
// 				2. allows injection of a `.value` property - the previous `.preFill` property [extends 'InitializablePattern']
// 					1. this is SUPPOSED to be done by the user within the `callback` [object creation + .init, WHICH can be done in a single expression]
// 				3. has an `.apply` method, which takes in a `layers: Function[]`, and RETURNS the result of applying it. 
// 	*	8. GENERALIZE the `DynamicParser` into `ComplexComposition` generic function, which returns a class: 
// 			1. DynamicCallable
// 				1. takes in the `stateMaker`
// 				2. binds it to the `.prototype`
// 				3. uses as-said
// 			2. DynamicParser = ComplexComposition(parserState)
export class DynamicParser<
	ArgType extends any[] = any[],
	OutType = any
> extends Composition<ArgType, OutType> {
	#original: Function[] = []

	state: Summat = { parser: this }

	init(signatures: IStateSignature[]) {
		let layers = array.copy(this.#original)
		for (const signature of signatures)
			applySignature(layers, signature, this.state)
		this.layers = layers
	}

	constructor(layers?: Function[], signatures: IStateSignature[] = []) {
		super(layers)
		if (layers) {
			this.#original = layers
			this.init(signatures)
		}
	}
}
