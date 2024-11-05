import type {
	Bufferized,
	BufferizedStreamClassInstance,
	PositionalStreamClassInstance,
	Stateful,
	StatefulStreamClassInstance,
	StreamClassInstance
} from "../interfaces.js"
import { StreamClass } from "../../../constants.js"

import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "src/Stream/interfaces.js"
import type { Posed } from "src/Position/interfaces.js"
import type { FreezableBuffer } from "src/Pattern/Collection/Buffer/interfaces.js"

// * utility functions

export function createBuffer<Type = any>(
	bufferized: Bufferized<Type>,
	buffer: FreezableBuffer
) {
	bufferized.buffer = buffer
}

export function nullPos(posed: Posed<number>) {
	posed.pos = 0
}

// * Explanation: For 'StreamClassInstance'-s, it's a call to the 'initGetter' (IN CASE IT'S PRESENT); Otherwise, a no-op
export function preInit(x: BasicStream) {
	if (!x.isEnd) x.curr
}

export function createState(x: Stateful, state: Summat) {
	x.state = state
}

export function initRealCurr(stream: StreamClassInstance) {
	stream.realCurr = StreamClass.DefaultRealCurr
}

// * possible '.init' methods

export function baseInitialize<Type = any>(this: StreamClassInstance<Type>) {
	this.isStart = StreamClass.PreCurrInit
	this.isEnd = this.defaultIsEnd()
}

export function initialize<Type = any>(this: StreamClassInstance<Type>) {
	initRealCurr(this)
	baseInitialize.call(this)
}

// * Explanation: the private function here is only for refactoring;
function generateInitMethods(initialize: Function) {
	function preInitInitialize<Type = any>(this: StreamClassInstance<Type>) {
		initialize.call(this)
		preInit(this)
	}

	function posInitialize<Type = any>(this: PositionalStreamClassInstance<Type>) {
		nullPos(this)
		initialize.call(this)
	}

	function preInitPosInitialize<Type = any>(this: PositionalStreamClassInstance<Type>) {
		nullPos(this)
		preInitInitialize.call(this)
	}

	function bufferInitialze<Type = any>(
		this: BufferizedStreamClassInstance<Type>,
		buffer: FreezableBuffer
	) {
		createBuffer(this, buffer)
		initialize.call(this)
	}

	function preInitBufferInitialize<Type = any>(
		this: BufferizedStreamClassInstance<Type>,
		buffer: FreezableBuffer
	) {
		createBuffer(this, buffer)
		preInitInitialize.call(this)
	}

	function posBufferInitialize<Type = any>(
		this: BufferizedStreamClassInstance<Type> & PositionalStreamClassInstance<Type>,
		buffer: FreezableBuffer
	) {
		createBuffer(this, buffer)
		posInitialize.call(this)
	}

	function preInitPosBufferInitialize<Type = any>(
		this: BufferizedStreamClassInstance<Type> & PositionalStreamClassInstance<Type>,
		buffer: FreezableBuffer
	) {
		createBuffer(this, buffer)
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
		state: Summat = {},
		buffer: FreezableBuffer
	) {
		createState(this, state)
		bufferInitialze.call(this, buffer)
	}

	function preInitBufferStateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type> & BufferizedStreamClassInstance<Type>,
		buffer: FreezableBuffer,
		state: Summat = {}
	) {
		createState(this, state)
		preInitBufferInitialize.call(this, buffer)
	}

	function posBufferStateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type> &
			BufferizedStreamClassInstance<Type> &
			PositionalStreamClassInstance<Type>,
		buffer: FreezableBuffer,
		state: Summat = {}
	) {
		createState(this, state)
		posBufferInitialize.call(this, buffer)
	}

	function preInitPosBufferStateInitialize<Type = any>(
		this: StatefulStreamClassInstance<Type> &
			BufferizedStreamClassInstance<Type> &
			PositionalStreamClassInstance<Type>,
		buffer: FreezableBuffer,
		state: Summat = {}
	) {
		createState(this, state)
		preInitPosBufferInitialize.call(this, buffer)
	}

	return [
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
		preInitPosBufferStateInitialize
	]
}

const fullInitialize = generateInitMethods(initialize)
const cutInitialize = generateInitMethods(baseInitialize)

export const [
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
	preInitPosBufferStateInitialize
] = fullInitialize

export const [
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
	basePreInitPosBufferStateInitialize
] = cutInitialize

const methodList = [initialize, ...fullInitialize, baseInitialize, ...cutInitialize]

export function chooseMethod<Type = any>(
	preInit: boolean = false,
	hasPosition: boolean = false,
	buffer: boolean = false,
	state: boolean = false
) {
	return methodList[
		+preInit | (+hasPosition << 1) | (+buffer << 2) | (+state << 3)
	]<Type>
}
