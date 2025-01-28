import type {
	BufferizedStreamClassInstance,
	PatternStreamClassInstance,
	PositionalBufferizedStreamClassInstance,
	PositionalStreamClassInstance,
	StatefulStreamClassInstance,
	StreamClassInstance
} from "../interfaces.js"

import type { Summat } from "@hgargg-0710/summat.ts"
import type { FreezableBuffer } from "../../../Collection/Buffer/interfaces.js"

import { positionNull } from "src/Position/refactor.js"
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

function initialize<Type = any>(this: StreamClassInstance<Type>) {
	realCurr(this)
	preStart(this)
	preEnd(this)
	preInit(this)
}

// * Explanation: the private function here is only for refactoring;
function generateInitMethods(initialize: BaseInitMethod): InitMethod[] {
	function posInitialize<Type = any>(this: PositionalStreamClassInstance<Type>) {
		positionNull(this)
		initialize.call(this)
	}

	function bufferInitialze<Type = any>(
		this: BufferizedStreamClassInstance<Type>,
		buffer: FreezableBuffer
	) {
		assignBuffer(this, buffer)
		initialize.call(this)
	}

	function posBufferInitialize<Type = any>(
		this: PositionalBufferizedStreamClassInstance<Type>,
		buffer?: FreezableBuffer
	) {
		assignBuffer(this, buffer)
		posInitialize.call(this)
	}

	function stateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type>,
		state: Summat = {}
	) {
		createState(this, state)
		initialize.call(this)
	}

	function posStateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type> & PositionalStreamClassInstance<Type>,
		state: Summat = {}
	) {
		createState(this, state)
		posInitialize.call(this)
	}

	function bufferStateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type> & BufferizedStreamClassInstance<Type>,
		buffer?: FreezableBuffer,
		state: Summat = {}
	) {
		createState(this, state)
		bufferInitialze.call(this, buffer)
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

	function patternInitialize<Type = any>(
		this: PatternStreamClassInstance<Type>,
		value?: any
	) {
		optionalValue(this, value)
		initialize.call(this)
	}

	function posPatternInitialize<Type = any>(
		this: PatternStreamClassInstance<Type> & PositionalStreamClassInstance<Type>,
		value?: any
	) {
		optionalValue(this, value)
		posInitialize.call(this)
	}

	function bufferPatternInitialize<Type = any>(
		this: BufferizedStreamClassInstance<Type> & PatternStreamClassInstance<Type>,
		value?: any,
		buffer?: FreezableBuffer<Type>
	) {
		optionalValue(this, value)
		bufferInitialze.call(this, buffer)
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

	function statePatternInitialize<Type = any>(
		this: PatternStreamClassInstance<Type> & StatefulStreamClassInstance<Type>,
		value?: any,
		state: Summat = {}
	) {
		optionalValue(this, value)
		stateInitialize.call(this, state)
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

const methodList = generateInitMethods(initialize)

export function chooseMethod(
	hasPosition: boolean = false,
	buffer: boolean = false,
	state: boolean = false,
	pattern: boolean = false
) {
	return methodList[+hasPosition | (+buffer << 1) | (+state << 2) | (+pattern << 3)]
}
