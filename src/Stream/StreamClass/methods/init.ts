import type { Summat } from "@hgargg-0710/summat.ts"

import type { IStateful, IStreamClassInstance } from "../interfaces.js"
import type { IPattern } from "../../../Pattern/interfaces.js"
import type { IPosed } from "../../../Position/interfaces.js"
import type {
	IBufferized,
	IFreezableBuffer
} from "../../../Collection/Buffer/interfaces.js"

import { positionNull } from "src/Position/refactor.js"
import { assignBuffer } from "src/Collection/Buffer/refactor.js"
import { optionalValue } from "../../../Pattern/utils.js"
import { createState, start } from "../refactor.js"

// * types

export interface IInitializable {
	init: IInitMethod
}

export type IInitMethod =
	| IBaseInitMethod
	| IBufferInitMethod
	| IStateInitMethod
	| IBufferStateInitMethod
	| IPatternInitMethod
	| IBufferPatternInitMethod
	| IStatePatternInitMethod
	| IBufferStatePatternInitMethod

export type IBaseInitMethod = () => void
export type IBufferInitMethod = <Type = any>(buffer?: IFreezableBuffer<Type>) => void
export type IStateInitMethod = (state?: Summat) => void
export type IPatternInitMethod = (value: any) => void

export type IBufferStateInitMethod = <Type = any>(
	buffer?: IFreezableBuffer<Type>,
	state?: Summat
) => void

export type IBufferPatternInitMethod = <Type = any>(
	value: any,
	buffer?: IFreezableBuffer<Type>
) => void

export type IStatePatternInitMethod = (value: any, state?: Summat) => void

export type IBufferStatePatternInitMethod = <Type = any>(
	value: any,
	buffer?: IFreezableBuffer<Type>,
	state?: Summat
) => void

// * possible '.init' methods

function initialize<Type = any>(this: IStreamClassInstance<Type>) {
	;(this as any).realCurr = null
	start(this)
	if (!(this.isEnd = this.defaultIsEnd())) {
		;(this as any).realCurr = (this.initGetter || this.currGetter)!()
	}
}

// * Explanation: the private function here is only for refactoring;
function generateInitMethods(initialize: IBaseInitMethod): IInitMethod[] {
	function posInitialize<Type = any>(this: IStreamClassInstance<Type> & IPosed<number>) {
		positionNull(this)
		initialize.call(this)
	}

	function bufferInitialze<Type = any>(
		this: IStreamClassInstance<Type> & IBufferized<Type>,
		buffer: IFreezableBuffer
	) {
		assignBuffer(this, buffer)
		initialize.call(this)
	}

	function posBufferInitialize<Type = any>(
		this: IStreamClassInstance<Type> & IPosed<number> & IBufferized<Type>,
		buffer?: IFreezableBuffer
	) {
		assignBuffer(this, buffer)
		posInitialize.call(this)
	}

	function stateInitialize<Type = any>(
		this: IStreamClassInstance<Type> & IStateful,
		state: Summat = {}
	) {
		createState(this, state)
		initialize.call(this)
	}

	function posStateInitialize<Type = any>(
		this: IStreamClassInstance<Type> & IStateful & IPosed<number>,
		state: Summat = {}
	) {
		createState(this, state)
		posInitialize.call(this)
	}

	function bufferStateInitialize<Type = any>(
		this: IStreamClassInstance<Type> & IStateful & IBufferized<Type>,
		buffer?: IFreezableBuffer,
		state: Summat = {}
	) {
		createState(this, state)
		bufferInitialze.call(this, buffer)
	}

	function posBufferStateInitialize<Type = any>(
		this: IStreamClassInstance<Type> & IStateful & IBufferized<Type> & IPosed<number>,
		buffer?: IFreezableBuffer,
		state: Summat = {}
	) {
		createState(this, state)
		posBufferInitialize.call(this, buffer)
	}

	function patternInitialize<Type = any>(
		this: IStreamClassInstance<Type> & IPattern,
		value?: any
	) {
		optionalValue(this, value)
		initialize.call(this)
	}

	function posPatternInitialize<Type = any>(
		this: IPattern & IStreamClassInstance<Type> & IPosed<number>,
		value?: any
	) {
		optionalValue(this, value)
		posInitialize.call(this)
	}

	function bufferPatternInitialize<Type = any>(
		this: IStreamClassInstance<Type> & IPattern & IBufferized<Type>,
		value?: any,
		buffer?: IFreezableBuffer<Type>
	) {
		optionalValue(this, value)
		bufferInitialze.call(this, buffer)
	}

	function posBufferPatternInitialize<Type = any>(
		this: IStreamClassInstance<Type> & IPosed<number> & IBufferized<Type> & IPattern,
		value?: any,
		buffer?: IFreezableBuffer<Type>
	) {
		optionalValue(this, value)
		posBufferInitialize.call(this, buffer)
	}

	function statePatternInitialize<Type = any>(
		this: IStreamClassInstance<Type> & IPattern & IStateful,
		value?: any,
		state: Summat = {}
	) {
		optionalValue(this, value)
		stateInitialize.call(this, state)
	}

	function posStatePatternInitialize<Type = any>(
		this: IStreamClassInstance<Type> & IPosed<number> & IPattern & IStateful,
		value?: any,
		state: Summat = {}
	) {
		optionalValue(this, value)
		posStateInitialize.call(this, state)
	}

	function bufferStatePatternInitialize<Type = any>(
		this: IStreamClassInstance<Type> & IBufferized<Type> & IStateful & IPattern,
		value?: any,
		buffer?: IFreezableBuffer<Type>,
		state: Summat = {}
	) {
		optionalValue(this, value)
		bufferStateInitialize.call(this, buffer, state)
	}

	function posBufferStatePatternInitialize<Type = any>(
		this: IStreamClassInstance<Type> &
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
