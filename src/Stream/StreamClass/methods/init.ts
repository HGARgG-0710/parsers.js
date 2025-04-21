import type { Summat } from "@hgargg-0710/summat.ts"

import type { IStateful } from "src/interfaces.js"
import type { IPattern } from "src/interfaces.js"
import type { IPosed, IPosition } from "../../Position/interfaces.js"
import type {
	IBufferized,
	IFreezableBuffer
} from "../../../Collection/Buffer/interfaces.js"

import { positionNull } from "../../Position/refactor.js"
import { assignBuffer } from "../../../Collection/Buffer/refactor.js"
import { optionalValue } from "../../../utils.js"
import {
	createState,
	start,
	type IStreamClassInstanceImpl
} from "../refactor.js"
import type { IThisMethod } from "../../../refactor.js"
import { BitHash } from "../../../HashMap/classes.js"
import { ArrayInternal } from "../../../HashMap/InternalHash/classes.js"

// * types

export type IStreamClassInitSignature<Type = any> =
	| IBaseStreamClassInitSignature
	| IBufferizedStreamClassInitSignature<Type>
	| IStatefulStreamClassInitSignature
	| IBufferizedStatefulStreamClassInitSignature<Type>
	| IPatternStreamClassInitSignature
	| IBufferizedPatternStreamClassInitSignature<Type>
	| IStatefulPatternStreamClassInitSignature
	| IBufferizedStatefulPatternStreamClassInitSignature<Type>

export type IBaseStreamClassInitSignature = []

export type IBufferizedStreamClassInitSignature<Type = any> = [
	IFreezableBuffer<Type>?
]

export type IStatefulStreamClassInitSignature = [Summat?]

export type IBufferizedStatefulStreamClassInitSignature<Type = any> = [
	IFreezableBuffer<Type>?,
	Summat?
]

export type IPatternStreamClassInitSignature = [any?]

export type IBufferizedPatternStreamClassInitSignature<Type = any> = [
	any?,
	IFreezableBuffer<Type>?
]

export type IStatefulPatternStreamClassInitSignature = [any?, Summat?]

export type IBufferizedStatefulPatternStreamClassInitSignature<Type = any> = [
	any?,
	IFreezableBuffer<Type>?,
	Summat?
]

export type IStreamClassInitMethod<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> =
	| IStreamClassBaseInitMethod<Type, SubType, PosType>
	| IStreamClassBufferInitMethod<Type, SubType, PosType>
	| IStreamClassStateInitMethod<Type, SubType, PosType>
	| IStreamClassBufferStateInitMethod<Type, SubType, PosType>
	| IStreamClassPatternInitMethod<Type, SubType, PosType>
	| IStreamClassBufferPatternInitMethod<Type, SubType, PosType>
	| IStreamClassStatePatternInitMethod<Type, SubType, PosType>
	| IStreamClassBufferStatePatternInitMethod<Type, SubType, PosType>

export type IStreamClassBaseInitMethod<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> = IThisMethod<
	IBaseStreamClassInitSignature,
	IStreamClassInstanceImpl<Type, SubType, PosType>
>

export type IStreamClassBufferInitMethod<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> = IThisMethod<
	IBufferizedStreamClassInitSignature<Type>,
	IStreamClassInstanceImpl<Type, SubType, PosType> & IBufferized<Type>
>

export type IStreamClassStateInitMethod<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> = IThisMethod<
	IStatefulStreamClassInitSignature,
	IStreamClassInstanceImpl<Type, SubType, PosType> & IStateful
>

export type IStreamClassBufferStateInitMethod<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> = IThisMethod<
	IBufferizedStatefulStreamClassInitSignature<Type>,
	IStreamClassInstanceImpl<Type, SubType, PosType> &
		IBufferized<Type> &
		IStateful
>

export type IStreamClassPatternInitMethod<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> = IThisMethod<
	IPatternStreamClassInitSignature,
	IStreamClassInstanceImpl<Type, SubType, PosType>
>

export type IStreamClassBufferPatternInitMethod<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> = IThisMethod<
	IBufferizedPatternStreamClassInitSignature<Type>,
	IStreamClassInstanceImpl<Type, SubType, PosType> & IBufferized<Type>
>

export type IStreamClassStatePatternInitMethod<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> = IThisMethod<
	IStatefulPatternStreamClassInitSignature,
	IStreamClassInstanceImpl<Type, SubType, PosType> & IStateful
>

export type IStreamClassBufferStatePatternInitMethod<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> = IThisMethod<
	IBufferizedStatefulPatternStreamClassInitSignature<Type>,
	IStreamClassInstanceImpl<Type, SubType, PosType> &
		IBufferized<Type> &
		IStateful
>

// * possible '.init' methods

function initialize<Type = any>(this: IStreamClassInstanceImpl<Type>) {
	;(this as any).realCurr = null
	start(this)
	if (!(this.isEnd = this.defaultIsEnd()))
		(this as any).realCurr = (this.initGetter || this.currGetter)!()
	return this
}

// * Explanation: the private function here is only for refactoring;
function generateInitMethods<Type = any>(
	initialize: IStreamClassBaseInitMethod
): IStreamClassInitMethod<Type>[] {
	function posInitialize<Type = any>(
		this: IStreamClassInstanceImpl<Type> & IPosed<number>
	) {
		positionNull(this)
		initialize.call(this)
		return this
	}

	function bufferInitialze<Type = any>(
		this: IStreamClassInstanceImpl<Type> & IBufferized<Type>,
		buffer: IFreezableBuffer
	) {
		assignBuffer(this, buffer)
		initialize.call(this)
		return this
	}

	function posBufferInitialize<Type = any>(
		this: IStreamClassInstanceImpl<Type> &
			IPosed<number> &
			IBufferized<Type>,
		buffer?: IFreezableBuffer
	) {
		assignBuffer(this, buffer)
		posInitialize.call(this)
		return this
	}

	function stateInitialize<Type = any>(
		this: IStreamClassInstanceImpl<Type> & IStateful,
		state: Summat = {}
	) {
		createState(this, state)
		initialize.call(this)
		return this
	}

	function posStateInitialize<Type = any>(
		this: IStreamClassInstanceImpl<Type> & IStateful & IPosed<number>,
		state: Summat = {}
	) {
		createState(this, state)
		posInitialize.call(this)
		return this
	}

	function bufferStateInitialize<Type = any>(
		this: IStreamClassInstanceImpl<Type> & IStateful & IBufferized<Type>,
		buffer?: IFreezableBuffer,
		state: Summat = {}
	) {
		createState(this, state)
		bufferInitialze.call(this, buffer)
		return this
	}

	function posBufferStateInitialize<Type = any>(
		this: IStreamClassInstanceImpl<Type> &
			IStateful &
			IBufferized<Type> &
			IPosed<number>,
		buffer?: IFreezableBuffer,
		state: Summat = {}
	) {
		createState(this, state)
		posBufferInitialize.call(this, buffer)
		return this
	}

	function patternInitialize<Type = any>(
		this: IStreamClassInstanceImpl<Type>,
		value?: any
	) {
		optionalValue(this, value)
		initialize.call(this)
		return this
	}

	function posPatternInitialize<Type = any>(
		this: IPattern & IStreamClassInstanceImpl<Type> & IPosed<number>,
		value?: any
	) {
		optionalValue(this, value)
		posInitialize.call(this)
		return this
	}

	function bufferPatternInitialize<Type = any>(
		this: IStreamClassInstanceImpl<Type> & IBufferized<Type>,
		value?: any,
		buffer?: IFreezableBuffer<Type>
	) {
		optionalValue(this, value)
		bufferInitialze.call(this, buffer)
		return this
	}

	function posBufferPatternInitialize<Type = any>(
		this: IStreamClassInstanceImpl<Type> &
			IPosed<number> &
			IBufferized<Type> &
			IPattern,
		value?: any,
		buffer?: IFreezableBuffer<Type>
	) {
		optionalValue(this, value)
		posBufferInitialize.call(this, buffer)
		return this
	}

	function statePatternInitialize<Type = any>(
		this: IStreamClassInstanceImpl<Type> & IStateful,
		value?: any,
		state: Summat = {}
	) {
		optionalValue(this, value)
		stateInitialize.call(this, state)
		return this
	}

	function posStatePatternInitialize<Type = any>(
		this: IStreamClassInstanceImpl<Type> &
			IPosed<number> &
			IPattern &
			IStateful,
		value?: any,
		state: Summat = {}
	) {
		optionalValue(this, value)
		posStateInitialize.call(this, state)
		return this
	}

	function bufferStatePatternInitialize<Type = any>(
		this: IStreamClassInstanceImpl<Type> &
			IBufferized<Type> &
			IStateful &
			IPattern,
		value?: any,
		buffer?: IFreezableBuffer<Type>,
		state: Summat = {}
	) {
		optionalValue(this, value)
		bufferStateInitialize.call(this, buffer, state)
		return this
	}

	function posBufferStatePatternInitialize<Type = any>(
		this: IStreamClassInstanceImpl<Type> &
			IPosed<number> &
			IBufferized<Type> &
			IStateful &
			IPattern,
		value?: any,
		buffer?: IFreezableBuffer<Type>,
		state: Summat = {}
	) {
		optionalValue(this, value)
		posBufferStateInitialize.call(this, buffer, state)
		return this
	}

	return [
		// * 0
		initialize,

		// * 1 << 0, + 1, '.pos'
		posInitialize,

		// * 1 << 1, + 2, '.buffer'
		bufferInitialze,
		posBufferInitialize,

		// * 1 << 2, + 4, '.state'
		stateInitialize,
		posStateInitialize,
		bufferStateInitialize,
		posBufferStateInitialize,

		// * 1 << 3, + 8, '.pattern'
		patternInitialize,
		posPatternInitialize,
		bufferPatternInitialize,
		posBufferPatternInitialize,
		statePatternInitialize,
		posStatePatternInitialize,
		bufferStatePatternInitialize,
		posBufferStatePatternInitialize
	]
}

const MethodHash = new BitHash(
	new ArrayInternal(generateInitMethods<NonNullable<Summat>>(initialize))
)

export function chooseMethod(
	hasPosition = false,
	hasBuffer = false,
	hasState = false,
	isPattern = false
) {
	return MethodHash.index([hasPosition, hasBuffer, hasState, isPattern])
}
