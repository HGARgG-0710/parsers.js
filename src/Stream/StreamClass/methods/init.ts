import type {
	BufferizedStreamClassInstance,
	PatternStreamClassInstance,
	PositionalStreamClassInstance,
	StatefulStreamClassInstance,
	StreamClassInstance
} from "../interfaces.js"

import type { Summat } from "@hgargg-0710/summat.ts"
import type { FreezableBuffer } from "../../../Collection/Buffer/interfaces.js"

import { positionNull } from "../../../Position/utils.js"
import { assignBuffer } from "src/Collection/Buffer/refactor.js"
import { optionalValue } from "../../../Pattern/utils.js"
import { createState, preInit, realCurr } from "../refactor.js"
import { preEnd, preStart } from "../refactor.js"

// * types

export interface Initializable {
	init: InitMethod
}

export type InitMethod =
	| BaseInitMethod
	| BufferInitMethod
	| StateInitMethod
	| BufferStateInitMethod
	| PatternInitMethod
	| BufferPatternInitMethod
	| StatePatternInitMethod
	| BufferStatePatternInitMethod

export type BaseInitMethod = () => void
export type BufferInitMethod = <Type = any>(buffer?: FreezableBuffer<Type>) => void
export type StateInitMethod = (state?: Summat) => void
export type PatternInitMethod = (value: any) => void

export type BufferStateInitMethod = <Type = any>(
	buffer?: FreezableBuffer<Type>,
	state?: Summat
) => void

export type BufferPatternInitMethod = <Type = any>(
	value: any,
	buffer?: FreezableBuffer<Type>
) => void

export type StatePatternInitMethod = (value: any, state?: Summat) => void

export type BufferStatePatternInitMethod = <Type = any>(
	value: any,
	buffer?: FreezableBuffer<Type>,
	state?: Summat
) => void

// * possible '.init' methods

export function baseInitialize<Type = any>(this: StreamClassInstance<Type>) {
	preStart(this)
	preEnd(this)
}

export function initialize<Type = any>(this: StreamClassInstance<Type>) {
	realCurr(this)
	baseInitialize.call(this)
}

// * Explanation: the private function here is only for refactoring;
function generateInitMethods(initialize: BaseInitMethod): InitMethod[] {
	function preInitInitialize<Type = any>(this: StreamClassInstance<Type>) {
		initialize.call(this)
		preInit(this)
	}

	function posInitialize<Type = any>(this: PositionalStreamClassInstance<Type>) {
		positionNull(this)
		initialize.call(this)
	}

	function preInitPosInitialize<Type = any>(this: PositionalStreamClassInstance<Type>) {
		positionNull(this)
		preInitInitialize.call(this)
	}

	function bufferInitialze<Type = any>(
		this: BufferizedStreamClassInstance<Type>,
		buffer: FreezableBuffer
	) {
		assignBuffer(this, buffer)
		initialize.call(this)
	}

	function preInitBufferInitialize<Type = any>(
		this: BufferizedStreamClassInstance<Type>,
		buffer: FreezableBuffer
	) {
		assignBuffer(this, buffer)
		preInitInitialize.call(this)
	}

	function posBufferInitialize<Type = any>(
		this: BufferizedStreamClassInstance<Type> & PositionalStreamClassInstance<Type>,
		buffer?: FreezableBuffer
	) {
		assignBuffer(this, buffer)
		posInitialize.call(this)
	}

	function preInitPosBufferInitialize<Type = any>(
		this: BufferizedStreamClassInstance<Type> & PositionalStreamClassInstance<Type>,
		buffer?: FreezableBuffer
	) {
		assignBuffer(this, buffer)
		preInitPosInitialize.call(this)
	}

	function stateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type>,
		state: Summat = {}
	) {
		createState(this, state)
		initialize.call(this)
	}

	function preInitStateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type>,
		state: Summat = {}
	) {
		createState(this, state)
		preInitInitialize.call(this)
	}

	function posStateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type> & PositionalStreamClassInstance<Type>,
		state: Summat = {}
	) {
		createState(this, state)
		posInitialize.call(this)
	}

	function preInitPosStateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type> & PositionalStreamClassInstance<Type>,
		state: Summat = {}
	) {
		createState(this, state)
		preInitPosInitialize.call(this)
	}

	function bufferStateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type> & BufferizedStreamClassInstance<Type>,
		buffer?: FreezableBuffer,
		state: Summat = {}
	) {
		createState(this, state)
		bufferInitialze.call(this, buffer)
	}

	function preInitBufferStateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type> & BufferizedStreamClassInstance<Type>,
		buffer?: FreezableBuffer,
		state: Summat = {}
	) {
		createState(this, state)
		preInitBufferInitialize.call(this, buffer)
	}

	function posBufferStateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type> &
			BufferizedStreamClassInstance<Type> &
			PositionalStreamClassInstance<Type>,
		buffer?: FreezableBuffer,
		state: Summat = {}
	) {
		createState(this, state)
		posBufferInitialize.call(this, buffer)
	}

	function preInitPosBufferStateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type> &
			BufferizedStreamClassInstance<Type> &
			PositionalStreamClassInstance<Type>,
		buffer?: FreezableBuffer,
		state: Summat = {}
	) {
		createState(this, state)
		preInitPosBufferInitialize.call(this, buffer)
	}

	function patternInitialize<Type = any>(
		this: PatternStreamClassInstance<Type>,
		value?: any
	) {
		optionalValue(this, value)
		initialize.call(this)
	}

	function preInitPatternInitialize<Type = any>(
		this: PatternStreamClassInstance<Type>,
		value?: any
	) {
		optionalValue(this, value)
		preInitInitialize.call(this)
	}

	function posPatternInitialize<Type = any>(
		this: PatternStreamClassInstance<Type> & PositionalStreamClassInstance<Type>,
		value?: any
	) {
		optionalValue(this, value)
		posInitialize.call(this)
	}

	function preInitPosPatternInitialize<Type = any>(
		this: PatternStreamClassInstance<Type> & PositionalStreamClassInstance<Type>,
		value?: any
	) {
		optionalValue(this, value)
		preInitPosInitialize.call(this)
	}

	function bufferPatternInitialize<Type = any>(
		this: BufferizedStreamClassInstance<Type> & PatternStreamClassInstance<Type>,
		value?: any,
		buffer?: FreezableBuffer<Type>
	) {
		optionalValue(this, value)
		bufferInitialze.call(this, buffer)
	}

	function preInitBufferPatternInitialize<Type = any>(
		this: BufferizedStreamClassInstance<Type> & PatternStreamClassInstance<Type>,
		value?: any,
		buffer?: FreezableBuffer<Type>
	) {
		optionalValue(this, value)
		preInitBufferInitialize.call(this, buffer)
	}

	function posBufferPatternInitialize<Type = any>(
		this: PositionalStreamClassInstance<Type> &
			BufferizedStreamClassInstance<Type> &
			PatternStreamClassInstance<Type>,
		value?: any,
		buffer?: FreezableBuffer<Type>
	) {
		optionalValue(this, value)
		posBufferInitialize.call(this, buffer)
	}

	function preInitPosBufferPatternInitialize<Type = any>(
		this: PositionalStreamClassInstance<Type> &
			BufferizedStreamClassInstance<Type> &
			PatternStreamClassInstance<Type>,
		value?: any,
		buffer?: FreezableBuffer<Type>
	) {
		optionalValue(this, value)
		preInitPosBufferInitialize.call(this, buffer)
	}

	function statePatternInitialize<Type = any>(
		this: PatternStreamClassInstance<Type> & StatefulStreamClassInstance<Type>,
		value?: any,
		state: Summat = {}
	) {
		optionalValue(this, value)
		stateInitialize.call(this, state)
	}

	function preInitStatePatternInitialize<Type = any>(
		this: PatternStreamClassInstance<Type> & StatefulStreamClassInstance<Type>,
		value?: any,
		state: Summat = {}
	) {
		optionalValue(this, value)
		preInitStateInitialize.call(this, state)
	}

	function posStatePatternInitialize<Type = any>(
		this: PositionalStreamClassInstance<Type> &
			PatternStreamClassInstance<Type> &
			StatefulStreamClassInstance<Type>,
		value?: any,
		state: Summat = {}
	) {
		optionalValue(this, value)
		posStateInitialize.call(this, state)
	}

	function preInitPosStatePatternInitialize<Type = any>(
		this: PositionalStreamClassInstance<Type> &
			PatternStreamClassInstance<Type> &
			StatefulStreamClassInstance<Type>,
		value?: any,
		state: Summat = {}
	) {
		optionalValue(this, value)
		preInitPosStateInitialize.call(this, state)
	}

	function bufferStatePatternInitialize<Type = any>(
		this: BufferizedStreamClassInstance<Type> &
			StatefulStreamClassInstance<Type> &
			PatternStreamClassInstance<Type>,
		value?: any,
		buffer?: FreezableBuffer<Type>,
		state: Summat = {}
	) {
		optionalValue(this, value)
		bufferStateInitialize.call(this, buffer, state)
	}

	function preInitBufferStatePatternInitialize<Type = any>(
		this: BufferizedStreamClassInstance<Type> &
			StatefulStreamClassInstance<Type> &
			PatternStreamClassInstance<Type>,
		value?: any,
		buffer?: FreezableBuffer<Type>,
		state: Summat = {}
	) {
		optionalValue(this, value)
		preInitBufferStateInitialize.call(this, buffer, state)
	}

	function posBufferStatePatternInitialize<Type = any>(
		this: PositionalStreamClassInstance<Type> &
			BufferizedStreamClassInstance<Type> &
			StatefulStreamClassInstance<Type> &
			PatternStreamClassInstance<Type>,
		value?: any,
		buffer?: FreezableBuffer<Type>,
		state: Summat = {}
	) {
		optionalValue(this, value)
		posBufferStateInitialize.call(this, buffer, state)
	}

	function preInitPosBufferStatePatternInitialize<Type = any>(
		this: PositionalStreamClassInstance<Type> &
			BufferizedStreamClassInstance<Type> &
			StatefulStreamClassInstance<Type> &
			PatternStreamClassInstance<Type>,
		value?: any,
		buffer?: FreezableBuffer<Type>,
		state: Summat = {}
	) {
		optionalValue(this, value)
		preInitPosStatePatternInitialize.call(this, buffer, state)
	}

	return [
		// * 0
		initialize,

		// * 1 << 0, + 1, '.preInit'
		preInitInitialize,

		// * 1 << 1, + 2, '.pos'
		posInitialize,
		preInitPosInitialize,

		// * 1 << 2, + 4, '.buffer'
		bufferInitialze,
		preInitBufferInitialize,
		posBufferInitialize,
		preInitPosBufferInitialize,

		// * 1 << 3, + 8, '.state'
		stateInitialize,
		preInitStateInitialize,
		posStateInitialize,
		preInitPosStateInitialize,
		bufferStateInitialize,
		preInitBufferStateInitialize,
		posBufferStateInitialize,
		preInitPosBufferStateInitialize,

		// * 1 << 4, + 16, '.pattern'
		patternInitialize,
		preInitPatternInitialize,
		posPatternInitialize,
		preInitPosPatternInitialize,
		bufferPatternInitialize,
		preInitBufferPatternInitialize,
		posBufferPatternInitialize,
		preInitPosBufferPatternInitialize,
		statePatternInitialize,
		preInitStatePatternInitialize,
		posStatePatternInitialize,
		preInitPosStatePatternInitialize,
		bufferStatePatternInitialize,
		preInitBufferStatePatternInitialize,
		posBufferStatePatternInitialize,
		preInitPosBufferStatePatternInitialize
	]
}

const fullInitialize = generateInitMethods(initialize)
const cutInitialize = generateInitMethods(baseInitialize)

export const [
	,
	preInitInitialize,
	posInitialize,
	preInitPosInitialize,
	bufferInitialze,
	preInitBufferInitialize,
	posBufferInitialize,
	preInitPosBufferInitialize,
	stateInitialize,
	preInitStateInitialize,
	posStateInitialize,
	preInitPosStateInitialize,
	bufferStateInitialize,
	preInitBufferStateInitialize,
	posBufferStateInitialize,
	preInitPosBufferStateInitialize,
	patternInitialize,
	preInitPatternInitialize,
	posPatternInitialize,
	preInitPosPatternInitialize,
	bufferPatternInitialize,
	preInitBufferPatternInitialize,
	posBufferPatternInitialize,
	preInitPosBufferPatternInitialize,
	statePatternInitialize,
	preInitStatePatternInitialize,
	posStatePatternInitialize,
	preInitPosStatePatternInitialize,
	bufferStatePatternInitialize,
	preInitBufferStatePatternInitialize,
	posBufferStatePatternInitialize,
	preInitPosBufferStatePatternInitialize
] = fullInitialize

export const [
	,
	basePreInitInitialize,
	basePosInitialize,
	basePreInitPosInitialize,
	baseBufferInitialze,
	basePreInitBufferInitialize,
	basePosBufferInitialize,
	basePreInitPosBufferInitialize,
	baseStateInitialize,
	basePreInitStateInitialize,
	basePosStateInitialize,
	basePreInitPosStateInitialize,
	baseBufferStateInitialize,
	basePreInitBufferStateInitialize,
	basePosBufferStateInitialize,
	basePreInitPosBufferStateInitialize,
	basePatternInitialize,
	basePreInitPatternInitialize,
	basePosPatternInitialize,
	basePreInitPosPatternInitialize,
	baseBufferPatternInitialize,
	basePreInitBufferPatternInitialize,
	basePosBufferPatternInitialize,
	basePreInitPosBufferPatternInitialize,
	baseStatePatternInitialize,
	basePreInitStatePatternInitialize,
	basePosStatePatternInitialize,
	basePreInitPosStatePatternInitialize,
	baseBufferStatePatternInitialize,
	basePreInitBufferStatePatternInitialize,
	basePosBufferStatePatternInitialize,
	basePreInitPosBufferStatePatternInitialize
] = cutInitialize

const methodList = fullInitialize.concat(cutInitialize)

export function chooseMethod<Type = any>(
	preInit: boolean = false,
	hasPosition: boolean = false,
	buffer: boolean = false,
	state: boolean = false,
	pattern: boolean = false,
	currGetter?: () => Type
) {
	return methodList[
		+preInit |
			(+hasPosition << 1) |
			(+buffer << 2) |
			(+state << 3) |
			(+pattern << 4) |
			(+!!currGetter << 5)
	]
}
